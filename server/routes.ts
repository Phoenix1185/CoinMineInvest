import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./auth";
import { createTransactionSchema, createWithdrawalSchema, createAnnouncementSchema, createSupportTicketSchema, createTicketMessageSchema, updateTicketSchema, PAYMENT_ADDRESSES } from "@shared/schema";
import { connectToDatabase } from './db';
import { z } from "zod";
import axios from 'axios';
import bcrypt from 'bcryptjs';

export async function registerRoutes(app: Express): Promise<Server> {
  // Connect to MongoDB
  await connectToDatabase();

  // Auth middleware
  setupAuth(app);

  // Initialize mining plans, admin user, and start services
  await initializeMiningPlans();
  await initializeAdminUser();
  startPriceUpdateService();
  startDailyEarningsService();

  // Crypto prices endpoint
  app.get('/api/crypto-prices', async (req, res) => {
    try {
      const prices = await storage.getCryptoPrices();
      res.json(prices);
    } catch (error) {
      console.error("Error fetching crypto prices:", error);
      res.status(500).json({ message: "Failed to fetch crypto prices" });
    }
  });

  // Mining plans endpoint
  app.get('/api/mining-plans', async (req, res) => {
    try {
      const plans = await storage.getMiningPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching mining plans:", error);
      res.status(500).json({ message: "Failed to fetch mining plans" });
    }
  });

  // Get payment addresses
  app.get('/api/payment-addresses', (req, res) => {
    res.json(PAYMENT_ADDRESSES);
  });

  // User transactions
  app.get('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const transactions = await storage.getUserTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Create transaction
  app.post('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const transactionData = createTransactionSchema.parse(req.body);

      // Get the mining plan to calculate USD amount
      const plan = await storage.getMiningPlan(transactionData.planId);
      if (!plan) {
        return res.status(404).json({ message: "Mining plan not found" });
      }

      const transaction = await storage.createTransaction({
        ...transactionData,
        userId,
        amount: Number(plan.price), // USD amount from plan
      });

      res.json(transaction);
    } catch (error) {
      console.error("Error creating transaction:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create transaction" });
      }
    }
  });

  // User mining contracts
  app.get('/api/mining-contracts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const contracts = await storage.getUserMiningContracts(userId);
      res.json(contracts);
    } catch (error) {
      console.error("Error fetching mining contracts:", error);
      res.status(500).json({ message: "Failed to fetch mining contracts" });
    }
  });

  // User mining contracts with plan details
  app.get('/api/mining-contracts-with-plans', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const contracts = await storage.getUserMiningContracts(userId);
      
      // Fetch plan details for each contract
      const contractsWithPlans = await Promise.all(
        contracts.map(async (contract) => {
          const plan = await storage.getMiningPlan(contract.planId);
          return {
            ...contract,
            plan: plan
          };
        })
      );
      
      res.json(contractsWithPlans);
    } catch (error) {
      console.error("Error fetching mining contracts with plans:", error);
      res.status(500).json({ message: "Failed to fetch mining contracts with plans" });
    }
  });

  // User earnings (optimized for dashboard - only recent earnings)
  app.get('/api/earnings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      // Only fetch recent 100 earnings for dashboard performance
      const [earnings, totals] = await Promise.all([
        storage.getUserEarnings(userId, 100),
        storage.getUserTotalEarnings(userId)
      ]);
      res.json({ earnings, totals });
    } catch (error) {
      console.error("Error fetching earnings:", error);
      res.status(500).json({ message: "Failed to fetch earnings" });
    }
  });

  // All user earnings (for detailed view with pagination)
  app.get('/api/earnings/all', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = (page - 1) * limit;
      
      // Get paginated earnings and total count
      const earnings = await storage.getUserEarnings(userId, limit);
      const totalEarnings = await storage.getUserTotalEarnings(userId);
      const totalCount = earnings.length; // For now, use earnings length as count
      
      const totalPages = Math.ceil(totalCount / limit);
      
      res.json({
        earnings,
        pagination: {
          currentPage: page,
          totalPages,
          totalRecords: totalCount,
          limit
        }
      });
    } catch (error) {
      console.error("Error fetching all earnings:", error);
      res.status(500).json({ message: "Failed to fetch all earnings" });
    }
  });

  // User withdrawals
  app.get('/api/withdrawals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const withdrawals = await storage.getUserWithdrawals(userId);
      res.json(withdrawals);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      res.status(500).json({ message: "Failed to fetch withdrawals" });
    }
  });

  // Create withdrawal
  app.post('/api/withdrawals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Check if user is blocked
      const user = await storage.getUser(userId);
      if (user?.isBlocked) {
        return res.status(403).json({ message: "Your account has been blocked. Please contact support." });
      }
      
      const withdrawalData = createWithdrawalSchema.parse(req.body);

      // Check if user has sufficient balance
      const totals = await storage.getUserTotalEarnings(userId);
      const totalBtc = totals.totalBtc;
      const requestedAmount = withdrawalData.amount;
      const requestedCurrency = withdrawalData.currency;

      // Calculate BTC equivalent for the requested withdrawal
      let btcEquivalent = requestedAmount;
      if (requestedCurrency !== "BTC") {
        // Get crypto prices for conversion
        const cryptoPrices = await storage.getCryptoPrices();
        const btcPrice = cryptoPrices.find((p: any) => p.symbol === "BTC")?.price || 0;
        const currencyPrice = cryptoPrices.find((p: any) => p.symbol === requestedCurrency)?.price || 0;
        
        if (!btcPrice) {
          return res.status(400).json({ message: "Unable to get BTC exchange rate. Please try again later." });
        }
        
        if (!currencyPrice) {
          return res.status(400).json({ message: `${requestedCurrency} exchange rate not available. Please try BTC, ETH, USDT, BNB, or SOL.` });
        }
        
        // Convert: requested amount * currency price = USD value
        // USD value / BTC price = BTC equivalent
        const usdAmount = requestedAmount * parseFloat(currencyPrice.toString());
        btcEquivalent = usdAmount / parseFloat(btcPrice.toString());
      }

      if (btcEquivalent > totalBtc) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      // Generate withdrawal ID
      const withdrawalId = await storage.generateWithdrawalId();

      const withdrawal = await storage.createWithdrawal({
        ...withdrawalData,
        userId
      });

      // Update withdrawal with generated ID
      const updatedWithdrawal = await storage.updateWithdrawal(withdrawal.id, {
        withdrawalId
      });

      res.json(withdrawal);
    } catch (error) {
      console.error("Error creating withdrawal:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid withdrawal data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create withdrawal" });
      }
    }
  });

  // Admin routes
  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const allTransactions = await storage.getAllTransactions();
      const allWithdrawals = await storage.getAllWithdrawals();
      const cryptoPrices = await storage.getCryptoPrices();
      
      const totalDeposits = allTransactions
        .filter(tx => tx.status === 'approved')
        .reduce((sum, tx) => sum + parseFloat(tx.amount.toString()), 0);
      
      // Calculate total withdrawals in BTC equivalent
      const completedWithdrawals = allWithdrawals.filter(w => w.status === 'completed');
      let totalWithdrawals = 0;
      
      // Helper function to convert withdrawal amount to BTC equivalent
      const convertToBtcEquivalent = (amount: number, currency: string): number => {
        if (currency === 'BTC') return amount;
        
        const btcPrice = cryptoPrices.find(p => p.symbol === 'BTC')?.price || 0;
        const currencyPrice = cryptoPrices.find(p => p.symbol === currency)?.price || 0;
        
        if (!btcPrice || !currencyPrice) return 0;
        
        const usdAmount = amount * parseFloat(currencyPrice.toString());
        return usdAmount / parseFloat(btcPrice.toString());
      };
      
      for (const withdrawal of completedWithdrawals) {
        const btcEquivalent = convertToBtcEquivalent(
          parseFloat(withdrawal.amount.toString()),
          withdrawal.currency
        );
        totalWithdrawals += btcEquivalent;
      }
      
      const totalUsers = await storage.getTotalUsers();
      const pendingTransactions = await storage.getPendingTransactions();
      const pendingWithdrawals = await storage.getPendingWithdrawals();

      res.json({
        totalDeposits,
        totalWithdrawals,
        totalUsers,
        pendingTransactions: pendingTransactions.length,
        pendingWithdrawals: pendingWithdrawals.length,
        netProfit: totalDeposits - totalWithdrawals
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  app.get('/api/admin/transactions', isAuthenticated, async (req: any, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const transactions = await storage.getPendingTransactions();
      
      // Get all unique user IDs to fetch in batch
      const userIds = Array.from(new Set(transactions.map(tx => tx.userId)));
      
      // Fetch all users in a single operation for better performance
      const users = await Promise.all(
        userIds.map(id => storage.getUser(id))
      );
      
      // Create a user map for quick lookup
      const userMap = new Map();
      users.forEach((user, index) => {
        if (user) {
          userMap.set(userIds[index], user);
        }
      });
      
      // Enhance transactions with user details
      const enhancedTransactions = transactions.map(tx => {
        const user = userMap.get(tx.userId);
        return {
          ...tx,
          userEmail: user?.email || 'Unknown',
          userName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
          userBindId: user?.customUserId || 'Unknown'
        };
      });
      
      res.json(enhancedTransactions);
    } catch (error) {
      console.error("Error fetching admin transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get('/api/admin/all-transactions', isAuthenticated, async (req: any, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching all transactions:", error);
      res.status(500).json({ message: "Failed to fetch all transactions" });
    }
  });

  app.post('/api/admin/transactions/:id/approve', isAuthenticated, async (req: any, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const transaction = await storage.approveTransaction(parseInt(id), req.user.id);
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      // Create mining contract for approved transaction
      if (transaction.status === "approved") {
        const plan = await storage.getMiningPlan(transaction.planId);
        if (plan) {
          const startDate = new Date();
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + plan.contractPeriod);

          const contract = await storage.createMiningContract({
            userId: transaction.userId,
            planId: transaction.planId,
            transactionId: transaction.id,
            startDate,
            endDate,
            isActive: true,
            totalEarnings: "0",
          });

          // Start generating daily earnings for this contract
          generateDailyEarnings(transaction.userId.toString(), plan, contract.id);
        }
      }

      res.json(transaction);
    } catch (error) {
      console.error("Error approving transaction:", error);
      res.status(500).json({ message: "Failed to approve transaction" });
    }
  });

  app.post('/api/admin/transactions/:id/reject', isAuthenticated, async (req: any, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const { reason } = req.body;
      const transaction = await storage.rejectTransaction(id, req.user.id, reason);
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      res.json(transaction);
    } catch (error) {
      console.error("Error rejecting transaction:", error);
      res.status(500).json({ message: "Failed to reject transaction" });
    }
  });

  // Admin withdrawal management
  app.get('/api/admin/withdrawals', isAuthenticated, async (req: any, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const withdrawals = await storage.getPendingWithdrawals();
      
      // Get all unique user IDs to fetch in batch
      const userIds = Array.from(new Set(withdrawals.map(withdrawal => withdrawal.userId)));
      
      // Fetch all users in a single operation for better performance
      const users = await Promise.all(
        userIds.map(id => storage.getUser(id))
      );
      
      // Create a user map for quick lookup
      const userMap = new Map();
      users.forEach((user, index) => {
        if (user) {
          userMap.set(userIds[index], user);
        }
      });
      
      // Enhance withdrawals with user details
      const enhancedWithdrawals = withdrawals.map(withdrawal => {
        const user = userMap.get(withdrawal.userId);
        return {
          ...withdrawal,
          userEmail: user?.email || 'Unknown',
          userName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
          userBindId: user?.customUserId || 'Unknown'
        };
      });
      
      res.json(enhancedWithdrawals);
    } catch (error) {
      console.error("Error fetching pending withdrawals:", error);
      res.status(500).json({ message: "Failed to fetch withdrawals" });
    }
  });

  app.post('/api/admin/withdrawals/:id/process', isAuthenticated, async (req: any, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const { transactionHash, networkFee } = req.body;

      // Get withdrawal details first
      const withdrawal = await storage.getWithdrawal(id);
      if (!withdrawal) {
        return res.status(404).json({ message: "Withdrawal not found" });
      }
      
      // When processing withdrawal, deduct balance from user's earnings in BTC equivalent
      if (withdrawal.currency !== 'BTC') {
        // Get current crypto prices for conversion
        const btcPrice = await storage.getCryptoPrice('BTC');
        const withdrawalCurrencyPrice = await storage.getCryptoPrice(withdrawal.currency);
        
        if (btcPrice && withdrawalCurrencyPrice) {
          // Convert withdrawal amount to BTC equivalent
          const withdrawalAmountUsd = parseFloat(withdrawal.amount.toString()) * parseFloat(withdrawalCurrencyPrice.price.toString());
          const btcEquivalent = withdrawalAmountUsd / parseFloat(btcPrice.price.toString());
          
          // Create a negative earning to deduct from balance  
          await storage.createMiningEarning({
            contractId: 0, // Special contract ID for withdrawals
            userId: withdrawal.userId,
            date: new Date(),
            amount: (-btcEquivalent).toString(),
            usdValue: (-withdrawalAmountUsd).toString(),
          });
        }
      } else {
        // For BTC withdrawals, directly deduct the BTC amount
        const btcPrice = await storage.getCryptoPrice('BTC');
        if (btcPrice) {
          const withdrawalAmountUsd = parseFloat(withdrawal.amount.toString()) * parseFloat(btcPrice.price.toString());
          
          await storage.createMiningEarning({
            contractId: 0, // Special contract ID for withdrawals
            userId: withdrawal.userId,
            date: new Date(),
            amount: (-parseFloat(withdrawal.amount.toString())).toString(),
            usdValue: (-withdrawalAmountUsd).toString(),
          });
        }
      }

      const updatedWithdrawal = await storage.updateWithdrawal(id, {
        status: 'completed',
        transactionHash,
        networkFee: networkFee || 0,
        processedAt: new Date(),
      });

      res.json(updatedWithdrawal);
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      res.status(500).json({ message: "Failed to process withdrawal" });
    }
  });

  app.post('/api/admin/withdrawals/:id/reject', isAuthenticated, async (req: any, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const { reason } = req.body;

      const withdrawal = await storage.updateWithdrawal(id, {
        status: 'rejected',
        rejectionReason: reason,
        processedAt: new Date(),
      });

      res.json(withdrawal);
    } catch (error) {
      console.error("Error rejecting withdrawal:", error);
      res.status(500).json({ message: "Failed to reject withdrawal" });
    }
  });

  // Admin user management routes
  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/admin/blocked-users', isAuthenticated, async (req: any, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const blockedUsers = await storage.getBlockedUsers();
      res.json(blockedUsers);
    } catch (error) {
      console.error("Error fetching blocked users:", error);
      res.status(500).json({ message: "Failed to fetch blocked users" });
    }
  });

  app.post('/api/admin/users/:id/block', isAuthenticated, async (req: any, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const { reason } = req.body;

      if (!reason || reason.trim() === '') {
        return res.status(400).json({ message: "Block reason is required" });
      }

      const user = await storage.blockUser(parseInt(id), reason, req.user.id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User blocked successfully", user });
    } catch (error) {
      console.error("Error blocking user:", error);
      res.status(500).json({ message: "Failed to block user" });
    }
  });

  app.post('/api/admin/users/:id/unblock', isAuthenticated, async (req: any, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const user = await storage.unblockUser(parseInt(id), req.user.id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User unblocked successfully", user });
    } catch (error) {
      console.error("Error unblocking user:", error);
      res.status(500).json({ message: "Failed to unblock user" });
    }
  });

  // Announcements routes
  app.get('/api/announcements', async (req, res) => {
    try {
      const announcements = await storage.getActiveAnnouncements();
      res.json(announcements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      res.status(500).json({ message: "Failed to fetch announcements" });
    }
  });

  // Admin announcements management
  app.get('/api/admin/announcements', isAuthenticated, async (req: any, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const announcements = await storage.getAllAnnouncements();
      res.json(announcements);
    } catch (error) {
      console.error("Error fetching admin announcements:", error);
      res.status(500).json({ message: "Failed to fetch announcements" });
    }
  });

  app.post('/api/admin/announcements', isAuthenticated, async (req: any, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const announcementData = createAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement({
        ...announcementData,
        createdBy: req.user.id
      });

      res.json(announcement);
    } catch (error) {
      console.error("Error creating announcement:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid announcement data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create announcement" });
      }
    }
  });

  app.put('/api/admin/announcements/:id', isAuthenticated, async (req: any, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const updates = createAnnouncementSchema.partial().parse(req.body);
      
      const announcement = await storage.updateAnnouncement(parseInt(id), updates);
      
      if (!announcement) {
        return res.status(404).json({ message: "Announcement not found" });
      }

      res.json(announcement);
    } catch (error) {
      console.error("Error updating announcement:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid announcement data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update announcement" });
      }
    }
  });

  app.delete('/api/admin/announcements/:id', isAuthenticated, async (req: any, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const success = await storage.deleteAnnouncement(parseInt(id));
      
      if (!success) {
        return res.status(404).json({ message: "Announcement not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting announcement:", error);
      res.status(500).json({ message: "Failed to delete announcement" });
    }
  });

  // Support Ticket endpoints

  // Public support contact (for logged out users)
  app.post('/api/contact-support', async (req, res) => {
    try {
      const { name, email, subject, message, category = 'General' } = req.body;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Create a support ticket from the public contact form
      // First, check if user exists by email
      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Create a temporary user account for public support requests
        const customUserId = await storage.generateCustomUserId();
        user = await storage.createUser({
          email,
          firstName: name.split(' ')[0] || name,
          lastName: name.split(' ').slice(1).join(' ') || '',
          customUserId,
          isEmailVerified: false,
          isAdmin: false,
        });
      }

      // Create support ticket that will appear in admin dashboard
      const ticket = await storage.createSupportTicket({
        subject: `[Public Contact] ${subject}`,
        description: message,
        category,
        priority: 'medium',
        userId: user.id,
      });

      console.log('Public support ticket created:', { 
        ticketId: ticket.id, 
        name, 
        email, 
        subject 
      });
      
      res.json({ 
        message: "Support request submitted successfully. We will get back to you soon.",
        ticketId: ticket.id 
      });
    } catch (error) {
      console.error("Error submitting support request:", error);
      res.status(500).json({ message: "Failed to submit support request" });
    }
  });

  // Get user's support tickets
  app.get('/api/support-tickets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const tickets = await storage.getUserSupportTickets(userId);
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      res.status(500).json({ message: "Failed to fetch support tickets" });
    }
  });

  // Create a new support ticket
  app.post('/api/support-tickets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const ticketData = createSupportTicketSchema.parse(req.body);
      
      const ticket = await storage.createSupportTicket({
        ...ticketData,
        userId,
      });
      
      res.status(201).json(ticket);
    } catch (error) {
      console.error("Error creating support ticket:", error);
      res.status(500).json({ message: "Failed to create support ticket" });
    }
  });

  // Get ticket messages
  app.get('/api/support-tickets/:ticketId/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const ticketId = parseInt(req.params.ticketId);
      
      // Verify user owns this ticket or is admin
      const ticket = await storage.getSupportTicket(ticketId);
      if (!ticket || (ticket.userId !== userId && !req.user.isAdmin)) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      const messages = await storage.getTicketMessages(ticketId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching ticket messages:", error);
      res.status(500).json({ message: "Failed to fetch ticket messages" });
    }
  });

  // Add message to ticket
  app.post('/api/support-tickets/:ticketId/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const ticketId = parseInt(req.params.ticketId);
      const messageData = createTicketMessageSchema.parse({
        ...req.body,
        ticketId
      });
      
      // Verify user owns this ticket or is admin
      const ticket = await storage.getSupportTicket(ticketId);
      if (!ticket || (ticket.userId !== userId && !req.user.isAdmin)) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      const message = await storage.createTicketMessage({
        ...messageData,
        userId,
        isFromAdmin: req.user.isAdmin,
      });
      
      // Update ticket status if it was resolved and user is replying
      if (ticket.status === 'resolved' && !req.user.isAdmin) {
        await storage.updateSupportTicket(ticketId, { status: 'open' });
      }
      
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating ticket message:", error);
      res.status(500).json({ message: "Failed to create ticket message" });
    }
  });

  // Admin-only endpoints

  // Get all support tickets (admin)
  app.get('/api/admin/support-tickets', isAdmin, async (req: any, res) => {
    try {
      const tickets = await storage.getAllSupportTickets();
      
      // Get all unique user IDs to fetch in batch
      const userIds = Array.from(new Set(tickets.map(ticket => ticket.userId)));
      
      // Fetch all users in a single operation for better performance
      const users = await Promise.all(
        userIds.map(id => storage.getUser(id))
      );
      
      // Create a user map for quick lookup
      const userMap = new Map();
      users.forEach((user, index) => {
        if (user) {
          userMap.set(userIds[index], user);
        }
      });
      
      // Enhance tickets with user details
      const enhancedTickets = tickets.map(ticket => {
        const user = userMap.get(ticket.userId);
        return {
          ...ticket,
          userEmail: user?.email || 'Unknown',
          userName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
          userBindId: user?.customUserId || 'Unknown'
        };
      });
      
      res.json(enhancedTickets);
    } catch (error) {
      console.error("Error fetching all support tickets:", error);
      res.status(500).json({ message: "Failed to fetch support tickets" });
    }
  });

  // Update ticket status/assignment (admin)
  app.patch('/api/admin/support-tickets/:ticketId', isAdmin, async (req: any, res) => {
    try {
      const ticketId = parseInt(req.params.ticketId);
      const updateData = updateTicketSchema.parse(req.body);
      
      if (updateData.status === 'resolved' && !updateData.assignedTo) {
        updateData.assignedTo = req.user.id;
      }
      
      const ticket = await storage.updateSupportTicket(ticketId, updateData);
      res.json(ticket);
    } catch (error) {
      console.error("Error updating support ticket:", error);
      res.status(500).json({ message: "Failed to update support ticket" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Initialize default mining plans
async function initializeMiningPlans() {
  try {
    const existingPlans = await storage.getMiningPlans();
    
    // Update existing plans to 1-month contract period if they have old values
    if (existingPlans.length > 0) {
      for (const existingPlan of existingPlans) {
        if (existingPlan.contractPeriod === 12) {
          // Update the plan with new values
          const updatedFeatures = existingPlan.features?.map(feature => 
            feature.replace('12-month contract', '1-month contract')
          );
          
          await storage.updateMiningPlan(existingPlan.id, {
            contractPeriod: 1,
            features: updatedFeatures
          });
        }
      }
      console.log("✓ Existing mining plans updated to 1-month contracts");
      return;
    }
    
    if (existingPlans.length === 0) {
      const plans = [
        {
          name: "Starter Plan",
          price: "10",
          miningRate: "1.0", // MH/s
          dailyEarnings: "0.00000045", // BTC - Corrected for 15% monthly ROI ($0.05/day)
          monthlyRoi: "15.0", // percentage
          contractPeriod: 1, // months (changed to 1 month)
          description: "Perfect for beginners wanting to start their mining journey",
          features: [
            "1 MH/s mining power",
            "Daily BTC earnings",
            "1-month contract",
            "15% monthly ROI",
            "Basic support"
          ],
          isActive: true,
        },
        {
          name: "Pro Plan",
          price: "50",
          miningRate: "5.0",
          dailyEarnings: "0.00000271", // BTC - Corrected for 18% monthly ROI ($0.30/day)
          monthlyRoi: "18.0",
          contractPeriod: 1,
          description: "For serious miners looking for better returns",
          features: [
            "5 MH/s mining power",
            "Higher daily earnings",
            "1-month contract",
            "18% monthly ROI",
            "Priority support"
          ],
          isActive: true,
        },
        {
          name: "Enterprise Plan",
          price: "200",
          miningRate: "20.0",
          dailyEarnings: "0.00001329", // BTC - Corrected for 22% monthly ROI ($1.47/day)
          monthlyRoi: "22.0",
          contractPeriod: 1,
          description: "Maximum mining power for professional investors",
          features: [
            "20 MH/s mining power",
            "Maximum daily earnings",
            "1-month contract",
            "22% monthly ROI",
            "VIP support",
            "Custom analytics"
          ],
          isActive: true,
        },
      ];

      for (const plan of plans) {
        await storage.createMiningPlan(plan);
      }
      console.log("✓ Mining plans initialized successfully");
    }
  } catch (error) {
    console.error("Error initializing mining plans:", error);
  }
}

async function initializeAdminUser() {
  try {
    console.log("Starting admin user initialization...");
    const adminEmail = "fredokcee1@gmail.com";
    const adminPassword = "@Damilola30";
    const existingAdmin = await storage.getUserByEmail(adminEmail);
    
    if (!existingAdmin) {
      console.log("Creating new admin user...");
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      const customUserId = await storage.generateCustomUserId();
      
      await storage.createUser({
        email: adminEmail,
        password: hashedPassword,
        firstName: "Administrator",
        lastName: "CryptoMine",
        customUserId,
        isEmailVerified: true,
        isAdmin: true,
      });
      
      console.log("✓ Admin user created successfully");
    } else {
      console.log("Admin user already exists, updating credentials...");
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      
      // Generate custom user ID if not exists
      let customUserId = existingAdmin.customUserId;
      if (!customUserId) {
        customUserId = await storage.generateCustomUserId();
      }
      
      await storage.updateUser(existingAdmin.id, {
        password: hashedPassword,
        customUserId,
        isAdmin: true,
        isEmailVerified: true,
        firstName: "Administrator",
        lastName: "CryptoMine",
      });
      
      console.log("✓ Admin user credentials updated successfully");
    }
  } catch (error) {
    console.error("Error initializing admin user:", error);
  }
}

// Fetch cryptocurrency prices from CoinMarketCap
async function fetchCryptoPrices() {
  try {
    // Free CoinMarketCap API alternative - using CoinGecko
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d'
    );

    if (response.data) {
      for (const crypto of response.data) {
        await storage.upsertCryptoPrice({
          symbol: crypto.symbol.toUpperCase(),
          name: crypto.name,
          price: crypto.current_price.toString(),
          change1h: crypto.price_change_percentage_1h_in_currency?.toString() || null,
          change24h: crypto.price_change_percentage_24h?.toString() || null,
          change7d: crypto.price_change_percentage_7d_in_currency?.toString() || null,
          marketCap: crypto.market_cap?.toString() || null,
          volume24h: crypto.total_volume?.toString() || null,
          circulatingSupply: crypto.circulating_supply?.toString() || null,
          logoUrl: crypto.image,
        });
      }
      console.log("✓ Crypto prices updated successfully");
    }
  } catch (error) {
    console.error("Error fetching crypto prices:", error);
    
    // Fallback: Insert some default crypto prices if API fails
    try {
      const defaultPrices = [
        { symbol: 'BTC', name: 'Bitcoin', price: 45000, change24h: 2.5 },
        { symbol: 'ETH', name: 'Ethereum', price: 3000, change24h: 1.8 },
        { symbol: 'USDT', name: 'Tether', price: 1, change24h: 0.1 },
        { symbol: 'BNB', name: 'Binance Coin', price: 300, change24h: 3.2 },
        { symbol: 'SOL', name: 'Solana', price: 100, change24h: 4.1 },
      ];

      for (const crypto of defaultPrices) {
        await storage.upsertCryptoPrice({
          ...crypto,
          price: crypto.price.toString(),
          change24h: crypto.change24h.toString()
        });
      }
    } catch (fallbackError) {
      console.error("Error setting fallback prices:", fallbackError);
    }
  }
}

// Cache BTC price for performance optimization
let cachedBtcPrice = 111325; // Fallback price
let lastBtcPriceUpdate = 0;
const BTC_PRICE_CACHE_DURATION = 60000; // Cache for 1 minute

async function getCachedBtcPrice(): Promise<number> {
  const now = Date.now();
  
  // Return cached price if still valid
  if (now - lastBtcPriceUpdate < BTC_PRICE_CACHE_DURATION) {
    return cachedBtcPrice;
  }
  
  try {
    const btcPrice = await storage.getCryptoPrice('BTC');
    if (btcPrice?.price) {
      cachedBtcPrice = Number(btcPrice.price);
      lastBtcPriceUpdate = now;
    }
  } catch (error) {
    console.error("Error fetching BTC price, using cached value:", error);
  }
  
  return cachedBtcPrice;
}

// Generate per-second earnings for active contracts  
async function generateDailyEarnings(userId: string, plan: any, contractId: number) {
  try {
    const btcPriceUsd = await getCachedBtcPrice();
    
    // Convert daily earnings to per-second earnings (daily / 86,400 seconds in a day)
    const dailyEarningsAmount = Number(plan.dailyEarnings);
    const perSecondEarningsAmount = dailyEarningsAmount / 86400; // 24 hours * 60 minutes * 60 seconds = 86,400
    
    await storage.createMiningEarning({
      contractId,
      userId: Number(userId),
      date: new Date(),
      amount: perSecondEarningsAmount.toString(), // Correct per-second BTC amount
      usdValue: (perSecondEarningsAmount * btcPriceUsd).toString(),
    });
  } catch (error) {
    console.error("Error generating per-second earnings:", error);
  }
}

// Generate earnings for all active contracts (per second)
async function generateEarningsForAllContracts() {
  try {
    const activeContracts = await storage.getActiveMiningContracts();
    
    for (const contract of activeContracts) {
      const plan = await storage.getMiningPlan(contract.planId);
      if (plan) {
        await generateDailyEarnings(contract.userId.toString(), plan, contract.id);
      }
    }
    
    // Log every 10 seconds to avoid spam
    if (Date.now() % 10000 < 1000) {
      console.log(`⛏️ Real-time mining active: ${activeContracts.length} contracts earning per second`);
    }
  } catch (error) {
    console.error("Error in real-time earnings generation:", error);
  }
}

// Real-time earnings generation service (every second)
function startDailyEarningsService() {
  console.log("✓ Real-time earnings service started - generating every second");
  
  // Generate earnings immediately
  generateEarningsForAllContracts();
  
  // Generate earnings every second (1000 milliseconds) for live balance updates
  setInterval(() => {
    generateEarningsForAllContracts();
  }, 1000);
}

// Start the price update service
function startPriceUpdateService() {
  // Update prices every 1 minute for more real-time conversion rates
  setInterval(fetchCryptoPrices, 1 * 60 * 1000);
  
  // Initial fetch
  fetchCryptoPrices();
  
  console.log("✓ Price update service started - updating every minute for real-time rates");
}

