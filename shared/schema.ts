import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";

// Define the status enums for validation
export const transactionStatusValues = ['pending', 'approved', 'rejected'] as const;
export const withdrawalStatusValues = ['pending', 'processing', 'completed', 'rejected'] as const;
export const ticketStatusValues = ['open', 'in_progress', 'resolved', 'closed'] as const;
export const ticketPriorityValues = ['low', 'medium', 'high', 'urgent'] as const;

// User interface
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  googleId?: string;
  customUserId?: string; // Human-readable ID like "USER001"
  isAdmin: boolean;
  isEmailVerified: boolean;
  isBlocked: boolean;
  blockedReason?: string;
  blockedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// User schema
const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, maxlength: 255 },
  password: { type: String, maxlength: 255 },
  firstName: { type: String, maxlength: 100 },
  lastName: { type: String, maxlength: 100 },
  profileImageUrl: { type: String, maxlength: 500 },
  googleId: { type: String, unique: true, sparse: true, maxlength: 255 },
  customUserId: { type: String, unique: true, sparse: true, maxlength: 20 },
  isAdmin: { type: Boolean, default: false, required: true },
  isEmailVerified: { type: Boolean, default: false, required: true },
  isBlocked: { type: Boolean, default: false, required: true },
  blockedReason: { type: String },
  blockedAt: { type: Date }
}, {
  timestamps: true
});

// Mining Plan interface
export interface IMiningPlan extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  miningRate: number; // MH/s
  dailyEarnings: number; // BTC
  monthlyRoi: number; // percentage
  contractPeriod: number; // months
  isActive: boolean;
  description: string;
  features: string[]; // Array of features
  createdAt: Date;
  updatedAt: Date;
}

// Mining Plan schema
const miningPlanSchema = new Schema<IMiningPlan>({
  name: { type: String, required: true, maxlength: 255 },
  price: { type: Number, required: true },
  miningRate: { type: Number, required: true }, // MH/s
  dailyEarnings: { type: Number, required: true }, // BTC
  monthlyRoi: { type: Number, required: true }, // percentage
  contractPeriod: { type: Number, required: true }, // months
  isActive: { type: Boolean, default: true, required: true },
  description: { type: String, required: true },
  features: [{ type: String }] // Array of features
}, {
  timestamps: true
});

// Transaction interface
export interface ITransaction extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  cryptoAmount: number;
  walletAddress: string;
  transactionHash?: string;
  status: typeof transactionStatusValues[number];
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Transaction schema
const transactionSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: Schema.Types.ObjectId, ref: 'MiningPlan', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, maxlength: 10 },
  cryptoAmount: { type: Number, required: true },
  walletAddress: { type: String, required: true, maxlength: 255 },
  transactionHash: { type: String, maxlength: 255 },
  status: { type: String, enum: transactionStatusValues, default: 'pending', required: true },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  rejectionReason: { type: String }
}, {
  timestamps: true
});

// Mining Contract interface
export interface IMiningContract extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  transactionId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  totalEarnings: number;
  lastPayoutAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Mining Contract schema
const miningContractSchema = new Schema<IMiningContract>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: Schema.Types.ObjectId, ref: 'MiningPlan', required: true },
  transactionId: { type: Schema.Types.ObjectId, ref: 'Transaction', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true, required: true },
  totalEarnings: { type: Number, default: 0, required: true },
  lastPayoutAt: { type: Date }
}, {
  timestamps: true
});

// Mining Earning interface
export interface IMiningEarning extends Document {
  _id: mongoose.Types.ObjectId;
  contractId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: Date;
  amount: number; // BTC
  usdValue: number;
  createdAt: Date;
}

// Mining Earning schema
const miningEarningSchema = new Schema<IMiningEarning>({
  contractId: { type: Schema.Types.ObjectId, ref: 'MiningContract', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true }, // BTC
  usdValue: { type: Number, required: true }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Withdrawal interface
export interface IWithdrawal extends Document {
  _id: mongoose.Types.ObjectId;
  withdrawalId: string; // Auto-generated like "WD001234"
  userId: mongoose.Types.ObjectId;
  currency: string;
  amount: number;
  walletAddress: string;
  status: typeof withdrawalStatusValues[number];
  transactionHash?: string;
  networkFee: number;
  rejectionReason?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Withdrawal schema
const withdrawalSchema = new Schema<IWithdrawal>({
  withdrawalId: { type: String, unique: true, maxlength: 20 },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  currency: { type: String, required: true, maxlength: 10 },
  amount: { type: Number, required: true },
  walletAddress: { type: String, required: true, maxlength: 255 },
  status: { type: String, enum: withdrawalStatusValues, default: 'pending', required: true },
  transactionHash: { type: String, maxlength: 255 },
  networkFee: { type: Number, default: 0 },
  rejectionReason: { type: String },
  processedAt: { type: Date }
}, {
  timestamps: true
});

// Crypto Price interface
export interface ICryptoPrice extends Document {
  _id: mongoose.Types.ObjectId;
  symbol: string;
  name: string;
  price: number;
  change1h?: number;
  change24h?: number;
  change7d?: number;
  marketCap?: number;
  volume24h?: number;
  circulatingSupply?: number;
  logoUrl?: string;
  updatedAt: Date;
}

// Crypto Price schema
const cryptoPriceSchema = new Schema<ICryptoPrice>({
  symbol: { type: String, required: true, unique: true, maxlength: 10 },
  name: { type: String, required: true, maxlength: 100 },
  price: { type: Number, required: true },
  change1h: { type: Number },
  change24h: { type: Number },
  change7d: { type: Number },
  marketCap: { type: Number },
  volume24h: { type: Number },
  circulatingSupply: { type: Number },
  logoUrl: { type: String, maxlength: 500 }
}, {
  timestamps: { createdAt: false, updatedAt: true }
});

// Announcement interface
export interface IAnnouncement extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  type: string; // promotion, announcement, warning
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Announcement schema
const announcementSchema = new Schema<IAnnouncement>({
  title: { type: String, required: true, maxlength: 255 },
  content: { type: String, required: true },
  type: { type: String, default: 'promotion', required: true, maxlength: 20 },
  isActive: { type: Boolean, default: true, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

// Support Ticket interface
export interface ISupportTicket extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  subject: string;
  description: string;
  status: typeof ticketStatusValues[number];
  priority: typeof ticketPriorityValues[number];
  category: string; // 'technical', 'payment', 'account', 'general'
  assignedTo?: mongoose.Types.ObjectId;
  assignedAt?: Date;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Support Ticket schema
const supportTicketSchema = new Schema<ISupportTicket>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true, maxlength: 255 },
  description: { type: String, required: true },
  status: { type: String, enum: ticketStatusValues, default: 'open', required: true },
  priority: { type: String, enum: ticketPriorityValues, default: 'medium', required: true },
  category: { type: String, required: true, maxlength: 100 },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  assignedAt: { type: Date },
  resolvedAt: { type: Date }
}, {
  timestamps: true
});

// Support Ticket Message interface
export interface ISupportTicketMessage extends Document {
  _id: mongoose.Types.ObjectId;
  ticketId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  message: string;
  isFromAdmin: boolean;
  attachments: string[]; // Array of file URLs
  createdAt: Date;
}

// Support Ticket Message schema
const supportTicketMessageSchema = new Schema<ISupportTicketMessage>({
  ticketId: { type: Schema.Types.ObjectId, ref: 'SupportTicket', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  isFromAdmin: { type: Boolean, default: false, required: true },
  attachments: [{ type: String }] // Array of file URLs
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Create models
export const User = mongoose.model<IUser>('User', userSchema);
export const MiningPlan = mongoose.model<IMiningPlan>('MiningPlan', miningPlanSchema);
export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
export const MiningContract = mongoose.model<IMiningContract>('MiningContract', miningContractSchema);
export const MiningEarning = mongoose.model<IMiningEarning>('MiningEarning', miningEarningSchema);
export const Withdrawal = mongoose.model<IWithdrawal>('Withdrawal', withdrawalSchema);
export const CryptoPrice = mongoose.model<ICryptoPrice>('CryptoPrice', cryptoPriceSchema);
export const Announcement = mongoose.model<IAnnouncement>('Announcement', announcementSchema);
export const SupportTicket = mongoose.model<ISupportTicket>('SupportTicket', supportTicketSchema);
export const SupportTicketMessage = mongoose.model<ISupportTicketMessage>('SupportTicketMessage', supportTicketMessageSchema);

// Zod schemas for validation
export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  profileImageUrl: z.string().optional(),
  googleId: z.string().optional(),
  customUserId: z.string().optional(),
  isBlocked: z.boolean().optional(),
  blockedReason: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export const createTransactionSchema = z.object({
  planId: z.string(), // MongoDB ObjectId as string
  currency: z.string(),
  cryptoAmount: z.number().positive(),
  walletAddress: z.string().min(1),
  transactionHash: z.string().optional(),
});

export const createWithdrawalSchema = z.object({
  currency: z.string(),
  amount: z.number().positive(),
  walletAddress: z.string().min(1),
});

export const createAnnouncementSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  type: z.string().default('promotion'),
  isActive: z.boolean().default(true),
});

export const createSupportTicketSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(['technical', 'payment', 'account', 'general']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
});

export const createTicketMessageSchema = z.object({
  ticketId: z.string(), // MongoDB ObjectId as string
  message: z.string().min(1, "Message is required"),
  attachments: z.array(z.string()).optional(),
});

export const updateTicketSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assignedTo: z.string().optional(), // MongoDB ObjectId as string
});

// Type definitions (using interface names for MongoDB documents)
export type UserType = IUser;
export type NewUser = Partial<IUser>;
export type MiningPlanType = IMiningPlan;
export type NewMiningPlan = Partial<IMiningPlan>;
export type TransactionType = ITransaction;
export type NewTransaction = Partial<ITransaction>;
export type MiningContractType = IMiningContract;
export type NewMiningContract = Partial<IMiningContract>;
export type MiningEarningType = IMiningEarning;
export type NewMiningEarning = Partial<IMiningEarning>;
export type WithdrawalType = IWithdrawal;
export type NewWithdrawal = Partial<IWithdrawal>;
export type CryptoPriceType = ICryptoPrice;
export type NewCryptoPrice = Partial<ICryptoPrice>;
export type AnnouncementType = IAnnouncement;
export type NewAnnouncement = Partial<IAnnouncement>;
export type SupportTicketType = ISupportTicket;
export type NewSupportTicket = Partial<ISupportTicket>;
export type SupportTicketMessageType = ISupportTicketMessage;
export type NewSupportTicketMessage = Partial<ISupportTicketMessage>;

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type CreateTransactionData = z.infer<typeof createTransactionSchema>;
export type CreateWithdrawalData = z.infer<typeof createWithdrawalSchema>;
export type CreateAnnouncementData = z.infer<typeof createAnnouncementSchema>;
export type CreateSupportTicketData = z.infer<typeof createSupportTicketSchema>;
export type CreateTicketMessageData = z.infer<typeof createTicketMessageSchema>;
export type UpdateTicketData = z.infer<typeof updateTicketSchema>;

// Crypto payment addresses
export const PAYMENT_ADDRESSES = {
  BNB: '0x09f616C4118870CcB2BE1aCE1EAc090bF443833B',
  BTC: 'bc1qfxl02mlrwfnnamr6qqhcgcutyth87du67u0nm0',
  USDT: 'TDsBManQwvT698thSMKmhjYqKTupVxWFwK',
  SOL: '9ENQmbQFA1mKWYZWaL1qpH1ACLioLz55eANsigHGckXt',
  ETH: '0x09f616C4118870CcB2BE1aCE1EAc090bF443833B',
};

// Supported withdrawal currencies (only currencies with payment addresses and price data)
export const WITHDRAWAL_CURRENCIES = [
  { symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
  { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
  { symbol: 'USDT', name: 'Tether USDT', icon: '₮' },
  { symbol: 'BNB', name: 'Binance Coin', icon: 'BNB' },
  { symbol: 'SOL', name: 'Solana', icon: 'SOL' },
];