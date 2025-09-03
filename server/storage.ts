import mongoose from 'mongoose';
import {
  User,
  MiningPlan,
  Transaction,
  MiningContract,
  MiningEarning,
  Withdrawal,
  CryptoPrice,
  Announcement,
  SupportTicket,
  SupportTicketMessage,
  type UserType,
  type MiningPlanType,
  type TransactionType,
  type MiningContractType,
  type MiningEarningType,
  type WithdrawalType,
  type CryptoPriceType,
  type AnnouncementType,
  type SupportTicketType,
  type SupportTicketMessageType,
  type NewUser,
  type NewMiningPlan,
  type NewTransaction,
  type NewMiningContract,
  type NewMiningEarning,
  type NewWithdrawal,
  type NewCryptoPrice,
  type NewAnnouncement,
  type NewSupportTicket,
  type NewSupportTicketMessage,
  type CreateTransactionData,
  type CreateWithdrawalData,
  type CreateAnnouncementData,
  type CreateSupportTicketData,
  type CreateTicketMessageData,
  type UpdateTicketData,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<UserType | null>;
  getUserByEmail(email: string): Promise<UserType | null>;
  getUserByGoogleId(googleId: string): Promise<UserType | null>;
  createUser(user: Partial<NewUser>): Promise<UserType>;
  updateUser(id: string, updates: Partial<UserType>): Promise<UserType | null>;
  getTotalUsers(): Promise<number>;
  getAllUsers(): Promise<UserType[]>;
  getBlockedUsers(): Promise<UserType[]>;
  blockUser(id: string, reason: string, blockedBy: string): Promise<UserType | null>;
  unblockUser(id: string, unblockedBy: string): Promise<UserType | null>;
  generateCustomUserId(): Promise<string>;
  generateWithdrawalId(): Promise<string>;
  
  // Mining plans
  getMiningPlans(): Promise<MiningPlanType[]>;
  getMiningPlan(id: string): Promise<MiningPlanType | null>;
  createMiningPlan(plan: NewMiningPlan): Promise<MiningPlanType>;
  updateMiningPlan(id: string, updates: Partial<MiningPlanType>): Promise<MiningPlanType | null>;
  
  // Transactions
  createTransaction(transaction: CreateTransactionData & { userId: string; amount: number }): Promise<TransactionType>;
  getTransaction(id: string): Promise<TransactionType | null>;
  getUserTransactions(userId: string): Promise<TransactionType[]>;
  getPendingTransactions(): Promise<TransactionType[]>;
  getAllTransactions(): Promise<TransactionType[]>;
  approveTransaction(id: string, approvedBy: string): Promise<TransactionType | null>;
  rejectTransaction(id: string, approvedBy: string, reason: string): Promise<TransactionType | null>;
  
  // Mining contracts
  createMiningContract(contract: NewMiningContract): Promise<MiningContractType>;
  getUserMiningContracts(userId: string): Promise<MiningContractType[]>;
  getActiveMiningContracts(): Promise<MiningContractType[]>;
  
  // Mining earnings
  createMiningEarning(earning: NewMiningEarning): Promise<MiningEarningType>;
  getUserEarnings(userId: string, limit?: number): Promise<MiningEarningType[]>;
  getUserTotalEarnings(userId: string): Promise<{ totalBtc: number; totalUsd: number }>;
  
  // Withdrawals
  createWithdrawal(withdrawal: CreateWithdrawalData & { userId: string }): Promise<WithdrawalType>;
  getUserWithdrawals(userId: string): Promise<WithdrawalType[]>;
  getPendingWithdrawals(): Promise<WithdrawalType[]>;
  getAllWithdrawals(): Promise<WithdrawalType[]>;
  updateWithdrawal(id: string, updates: Partial<WithdrawalType>): Promise<WithdrawalType | null>;
  
  // Crypto prices
  upsertCryptoPrice(price: NewCryptoPrice): Promise<CryptoPriceType>;
  getCryptoPrices(): Promise<CryptoPriceType[]>;
  getCryptoPrice(symbol: string): Promise<CryptoPriceType | null>;
  
  // Announcements
  createAnnouncement(announcement: CreateAnnouncementData & { createdBy: string }): Promise<AnnouncementType>;
  getActiveAnnouncements(): Promise<AnnouncementType[]>;
  getAllAnnouncements(): Promise<AnnouncementType[]>;
  updateAnnouncement(id: string, updates: Partial<AnnouncementType>): Promise<AnnouncementType | null>;
  deleteAnnouncement(id: string): Promise<boolean>;
  
  // Support Tickets
  createSupportTicket(ticket: CreateSupportTicketData & { userId: string }): Promise<SupportTicketType>;
  getSupportTicket(id: string): Promise<SupportTicketType | null>;
  getUserSupportTickets(userId: string): Promise<SupportTicketType[]>;
  getAllSupportTickets(): Promise<SupportTicketType[]>;
  updateSupportTicket(id: string, updates: UpdateTicketData): Promise<SupportTicketType | null>;
  
  // Support Ticket Messages
  createTicketMessage(message: CreateTicketMessageData & { userId: string; isFromAdmin: boolean }): Promise<SupportTicketMessageType>;
  getTicketMessages(ticketId: string): Promise<SupportTicketMessageType[]>;
}

export class MongoStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<UserType | null> {
    try {
      return await User.findById(id);
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<UserType | null> {
    try {
      return await User.findOne({ email });
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  async getUserByGoogleId(googleId: string): Promise<UserType | null> {
    try {
      return await User.findOne({ googleId });
    } catch (error) {
      console.error('Error getting user by Google ID:', error);
      return null;
    }
  }

  async createUser(userData: Partial<NewUser>): Promise<UserType> {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: string, updates: Partial<UserType>): Promise<UserType | null> {
    try {
      return await User.findByIdAndUpdate(id, updates, { new: true });
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  async getTotalUsers(): Promise<number> {
    try {
      return await User.countDocuments();
    } catch (error) {
      console.error('Error getting total users:', error);
      return 0;
    }
  }

  async getAllUsers(): Promise<UserType[]> {
    try {
      return await User.find().sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  async getBlockedUsers(): Promise<UserType[]> {
    try {
      return await User.find({ isBlocked: true });
    } catch (error) {
      console.error('Error getting blocked users:', error);
      return [];
    }
  }

  async blockUser(id: string, reason: string, blockedBy: string): Promise<UserType | null> {
    try {
      return await User.findByIdAndUpdate(id, {
        isBlocked: true,
        blockedReason: reason,
        blockedAt: new Date()
      }, { new: true });
    } catch (error) {
      console.error('Error blocking user:', error);
      return null;
    }
  }

  async unblockUser(id: string, unblockedBy: string): Promise<UserType | null> {
    try {
      return await User.findByIdAndUpdate(id, {
        isBlocked: false,
        blockedReason: undefined,
        blockedAt: undefined
      }, { new: true });
    } catch (error) {
      console.error('Error unblocking user:', error);
      return null;
    }
  }

  async generateCustomUserId(): Promise<string> {
    try {
      const userCount = await User.countDocuments();
      return `USER${String(userCount + 1).padStart(4, '0')}`;
    } catch (error) {
      console.error('Error generating custom user ID:', error);
      return `USER${String(Date.now()).slice(-4)}`;
    }
  }

  async generateWithdrawalId(): Promise<string> {
    try {
      const withdrawalCount = await Withdrawal.countDocuments();
      return `WD${String(withdrawalCount + 1).padStart(6, '0')}`;
    } catch (error) {
      console.error('Error generating withdrawal ID:', error);
      return `WD${String(Date.now()).slice(-6)}`;
    }
  }

  // Mining plans
  async getMiningPlans(): Promise<MiningPlanType[]> {
    try {
      return await MiningPlan.find({ isActive: true }).sort({ price: 1 });
    } catch (error) {
      console.error('Error getting mining plans:', error);
      return [];
    }
  }

  async getMiningPlan(id: string): Promise<MiningPlanType | null> {
    try {
      return await MiningPlan.findById(id);
    } catch (error) {
      console.error('Error getting mining plan:', error);
      return null;
    }
  }

  async createMiningPlan(planData: NewMiningPlan): Promise<MiningPlanType> {
    try {
      const plan = new MiningPlan(planData);
      return await plan.save();
    } catch (error) {
      console.error('Error creating mining plan:', error);
      throw error;
    }
  }

  async updateMiningPlan(id: string, updates: Partial<MiningPlanType>): Promise<MiningPlanType | null> {
    try {
      return await MiningPlan.findByIdAndUpdate(id, updates, { new: true });
    } catch (error) {
      console.error('Error updating mining plan:', error);
      return null;
    }
  }

  // Transactions
  async createTransaction(transactionData: CreateTransactionData & { userId: string; amount: number }): Promise<TransactionType> {
    try {
      const transaction = new Transaction(transactionData);
      return await transaction.save();
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  async getTransaction(id: string): Promise<TransactionType | null> {
    try {
      return await Transaction.findById(id);
    } catch (error) {
      console.error('Error getting transaction:', error);
      return null;
    }
  }

  async getUserTransactions(userId: string): Promise<TransactionType[]> {
    try {
      return await Transaction.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting user transactions:', error);
      return [];
    }
  }

  async getPendingTransactions(): Promise<TransactionType[]> {
    try {
      return await Transaction.find({ status: 'pending' }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting pending transactions:', error);
      return [];
    }
  }

  async getAllTransactions(): Promise<TransactionType[]> {
    try {
      return await Transaction.find().sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting all transactions:', error);
      return [];
    }
  }

  async approveTransaction(id: string, approvedBy: string): Promise<TransactionType | null> {
    try {
      return await Transaction.findByIdAndUpdate(id, {
        status: 'approved',
        approvedBy: new mongoose.Types.ObjectId(approvedBy),
        approvedAt: new Date()
      }, { new: true });
    } catch (error) {
      console.error('Error approving transaction:', error);
      return null;
    }
  }

  async rejectTransaction(id: string, approvedBy: string, reason: string): Promise<TransactionType | null> {
    try {
      return await Transaction.findByIdAndUpdate(id, {
        status: 'rejected',
        approvedBy: new mongoose.Types.ObjectId(approvedBy),
        rejectionReason: reason
      }, { new: true });
    } catch (error) {
      console.error('Error rejecting transaction:', error);
      return null;
    }
  }

  // Mining contracts
  async createMiningContract(contractData: NewMiningContract): Promise<MiningContractType> {
    try {
      const contract = new MiningContract(contractData);
      return await contract.save();
    } catch (error) {
      console.error('Error creating mining contract:', error);
      throw error;
    }
  }

  async getUserMiningContracts(userId: string): Promise<MiningContractType[]> {
    try {
      return await MiningContract.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting user mining contracts:', error);
      return [];
    }
  }

  async getActiveMiningContracts(): Promise<MiningContractType[]> {
    try {
      return await MiningContract.find({
        isActive: true,
        endDate: { $gte: new Date() }
      });
    } catch (error) {
      console.error('Error getting active mining contracts:', error);
      return [];
    }
  }

  // Mining earnings
  async createMiningEarning(earningData: NewMiningEarning): Promise<MiningEarningType> {
    try {
      const earning = new MiningEarning(earningData);
      return await earning.save();
    } catch (error) {
      console.error('Error creating mining earning:', error);
      throw error;
    }
  }

  async getUserEarnings(userId: string, limit?: number): Promise<MiningEarningType[]> {
    try {
      const query = MiningEarning.find({ userId }).sort({ date: -1 });
      
      if (limit) {
        query.limit(limit);
      }
      
      return await query;
    } catch (error) {
      console.error('Error getting user earnings:', error);
      return [];
    }
  }

  async getUserTotalEarnings(userId: string): Promise<{ totalBtc: number; totalUsd: number }> {
    try {
      const result = await MiningEarning.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalBtc: { $sum: '$amount' },
            totalUsd: { $sum: '$usdValue' }
          }
        }
      ]);

      return {
        totalBtc: result[0]?.totalBtc || 0,
        totalUsd: result[0]?.totalUsd || 0
      };
    } catch (error) {
      console.error('Error getting user total earnings:', error);
      return { totalBtc: 0, totalUsd: 0 };
    }
  }

  // Withdrawals
  async createWithdrawal(withdrawalData: CreateWithdrawalData & { userId: string }): Promise<WithdrawalType> {
    try {
      const withdrawal = new Withdrawal(withdrawalData);
      return await withdrawal.save();
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      throw error;
    }
  }

  async getUserWithdrawals(userId: string): Promise<WithdrawalType[]> {
    try {
      return await Withdrawal.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting user withdrawals:', error);
      return [];
    }
  }

  async getPendingWithdrawals(): Promise<WithdrawalType[]> {
    try {
      return await Withdrawal.find({ status: 'pending' }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting pending withdrawals:', error);
      return [];
    }
  }

  async getAllWithdrawals(): Promise<WithdrawalType[]> {
    try {
      return await Withdrawal.find().sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting all withdrawals:', error);
      return [];
    }
  }

  async updateWithdrawal(id: string, updates: Partial<WithdrawalType>): Promise<WithdrawalType | null> {
    try {
      return await Withdrawal.findByIdAndUpdate(id, updates, { new: true });
    } catch (error) {
      console.error('Error updating withdrawal:', error);
      return null;
    }
  }

  // Crypto prices
  async upsertCryptoPrice(priceData: NewCryptoPrice): Promise<CryptoPriceType> {
    try {
      return await CryptoPrice.findOneAndUpdate(
        { symbol: priceData.symbol },
        priceData,
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('Error upserting crypto price:', error);
      throw error;
    }
  }

  async getCryptoPrices(): Promise<CryptoPriceType[]> {
    try {
      return await CryptoPrice.find().sort({ updatedAt: -1 });
    } catch (error) {
      console.error('Error getting crypto prices:', error);
      return [];
    }
  }

  async getCryptoPrice(symbol: string): Promise<CryptoPriceType | null> {
    try {
      return await CryptoPrice.findOne({ symbol });
    } catch (error) {
      console.error('Error getting crypto price:', error);
      return null;
    }
  }

  // Announcements
  async createAnnouncement(announcementData: CreateAnnouncementData & { createdBy: string }): Promise<AnnouncementType> {
    try {
      const announcement = new Announcement(announcementData);
      return await announcement.save();
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  }

  async getActiveAnnouncements(): Promise<AnnouncementType[]> {
    try {
      return await Announcement.find({ isActive: true }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting active announcements:', error);
      return [];
    }
  }

  async getAllAnnouncements(): Promise<AnnouncementType[]> {
    try {
      return await Announcement.find().sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting all announcements:', error);
      return [];
    }
  }

  async updateAnnouncement(id: string, updates: Partial<AnnouncementType>): Promise<AnnouncementType | null> {
    try {
      return await Announcement.findByIdAndUpdate(id, updates, { new: true });
    } catch (error) {
      console.error('Error updating announcement:', error);
      return null;
    }
  }

  async deleteAnnouncement(id: string): Promise<boolean> {
    try {
      const result = await Announcement.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting announcement:', error);
      return false;
    }
  }

  // Support Tickets implementation
  async createSupportTicket(ticketData: CreateSupportTicketData & { userId: string }): Promise<SupportTicketType> {
    try {
      const ticket = new SupportTicket(ticketData);
      return await ticket.save();
    } catch (error) {
      console.error('Error creating support ticket:', error);
      throw error;
    }
  }

  async getSupportTicket(id: string): Promise<SupportTicketType | null> {
    try {
      return await SupportTicket.findById(id);
    } catch (error) {
      console.error('Error getting support ticket:', error);
      return null;
    }
  }

  async getUserSupportTickets(userId: string): Promise<SupportTicketType[]> {
    try {
      return await SupportTicket.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting user support tickets:', error);
      return [];
    }
  }

  async getAllSupportTickets(): Promise<SupportTicketType[]> {
    try {
      return await SupportTicket.find().sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting all support tickets:', error);
      return [];
    }
  }

  async updateSupportTicket(id: string, updates: UpdateTicketData): Promise<SupportTicketType | null> {
    try {
      const updateData: any = { ...updates };
      
      if (updates.status === 'resolved') {
        updateData.resolvedAt = new Date();
      }
      
      if (updates.assignedTo) {
        updateData.assignedTo = new mongoose.Types.ObjectId(updates.assignedTo);
        updateData.assignedAt = new Date();
      }
      
      return await SupportTicket.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      console.error('Error updating support ticket:', error);
      return null;
    }
  }

  // Support Ticket Messages implementation
  async createTicketMessage(messageData: CreateTicketMessageData & { userId: string; isFromAdmin: boolean }): Promise<SupportTicketMessageType> {
    try {
      const message = new SupportTicketMessage(messageData);
      return await message.save();
    } catch (error) {
      console.error('Error creating ticket message:', error);
      throw error;
    }
  }

  async getTicketMessages(ticketId: string): Promise<SupportTicketMessageType[]> {
    try {
      return await SupportTicketMessage.find({ ticketId }).sort({ createdAt: 1 });
    } catch (error) {
      console.error('Error getting ticket messages:', error);
      return [];
    }
  }
}

export const storage = new MongoStorage();