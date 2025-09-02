# CryptoMine Pro

A comprehensive cryptocurrency mining platform that enables users to purchase mining contracts, track earnings, and manage withdrawals. Built with modern web technologies and featuring real-time price tracking and admin management capabilities.

## 🚀 Features

### User Features
- **Mining Contract Management**: Purchase and manage different mining plans
- **Real-time Earnings**: Track mining earnings updated every second
- **Cryptocurrency Withdrawals**: Support for multiple cryptocurrencies (BTC, ETH, USDT, BNB, SOL, ADA, DOT)
- **Live Price Tracking**: Real-time cryptocurrency price updates
- **Transaction History**: Complete history of purchases and withdrawals
- **Support System**: Built-in ticket system with user bind ID tracking

### Admin Features
- **Transaction Management**: Approve or reject user transactions with full user information
- **Withdrawal Processing**: Process withdrawal requests with user bind ID and name display
- **User Management**: View and manage all platform users with complete profiles
- **Support Ticket Management**: Handle user support requests with user names and bind IDs
- **Analytics Dashboard**: Platform statistics and performance metrics
- **Announcement System**: Create and manage platform announcements

### Technical Features
- **Real-time Updates**: Live balance and earnings updates
- **Secure Authentication**: Replit OAuth integration
- **Database Management**: PostgreSQL with Drizzle ORM
- **Responsive Design**: Modern UI with dark theme
- **Type Safety**: Full TypeScript implementation
- **User Bind ID System**: Custom user identifiers for easy tracking

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for routing
- **TanStack Query** for state management
- **Radix UI** + **shadcn/ui** for components
- **Tailwind CSS** for styling
- **Vite** for build tooling

### Backend
- **Node.js** with Express.js
- **TypeScript** with ES modules
- **Drizzle ORM** for database operations
- **PostgreSQL** database (Neon for production)
- **Replit OAuth** for authentication

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Neon for cloud)
- Replit account (for OAuth)

### Environment Variables
Create a `.env` file with the following variables:

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/cryptomine_pro

# Authentication (Replit OAuth)
REPLIT_CLIENT_ID=your_replit_client_id
REPLIT_CLIENT_SECRET=your_replit_client_secret

# Session
SESSION_SECRET=your_session_secret_key

# Server
PORT=5000
NODE_ENV=development
```

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cryptomine-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # For local PostgreSQL
   createdb cryptomine_pro
   
   # Push schema to database
   npm run db:push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 🚀 Production Deployment

For complete production deployment instructions, see **[DEPLOYMENT.md](./DEPLOYMENT.md)** which includes:

- **Frontend deployment to Vercel**
- **Backend deployment to Render or Koyeb**
- **Database setup with Neon PostgreSQL**
- **OAuth configuration**
- **Environment variables setup**
- **Troubleshooting guide**

### Quick Deployment Overview

#### Frontend (Vercel)
1. Connect your Git repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL=https://your-backend-url`

#### Backend (Render/Koyeb)
1. Connect your Git repository
2. Set build command: `npm install`
3. Set start command: `npm run start:prod`
4. Configure environment variables (DATABASE_URL, SESSION_SECRET, etc.)

#### Database (Neon)
1. Create a Neon PostgreSQL database
2. Copy the connection string
3. Run `npm run db:push` to setup schema

### Environment Variables for Production

#### Backend
```bash
NODE_ENV=production
DATABASE_URL=postgresql://...  # Neon connection string
SESSION_SECRET=secure-random-string
GOOGLE_CLIENT_ID=your-google-oauth-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret
GOOGLE_REDIRECT_URI=https://your-backend-url/auth/google/callback
FRONTEND_URL=https://your-frontend-url.vercel.app
```

#### Frontend
```bash
VITE_API_URL=https://your-backend-url
```

## 🔧 Configuration

### Admin Account
An admin account is automatically created on first startup:
- Email: `admin@cryptomine.pro`
- Password: `admin123`

**Important**: Change the admin password immediately after deployment!

### Mining Plans
The platform comes with pre-configured 1-month mining plans optimized for realistic ROI.

### User Bind ID System
- Each user gets a unique bind ID (e.g., USER0001)
- Displayed in admin dashboard for tickets, deposits, and withdrawals
- Makes user identification easier for support

## 📊 Database Schema

Main tables:
- `users` - User accounts with bind IDs and authentication
- `mining_plans` - Available mining contract plans
- `mining_contracts` - Active user mining contracts
- `mining_earnings` - Real-time earnings records
- `transactions` - Purchase transactions with user info
- `withdrawals` - Withdrawal requests with user info
- `support_tickets` - User support system with user tracking
- `crypto_prices` - Cryptocurrency price data
- `announcements` - Platform announcements

## 🔒 Security

- **Authentication**: Secure OAuth integration with Google/Replit
- **Session Management**: Server-side sessions with PostgreSQL storage
- **CSRF Protection**: Built-in CSRF protection
- **Input Validation**: Comprehensive input validation with Zod
- **SQL Injection Prevention**: Parameterized queries with Drizzle ORM
- **User Privacy**: Secure user bind ID system

## 🧪 Development

### Database Management
```bash
# Push schema changes
npm run db:push

# Force push (if conflicts)
npm run db:push --force
```

### Available Scripts
```bash
# Development
npm run dev              # Start development server

# Production
npm run start:prod       # Start production server
npm run build           # Build for production

# Database
npm run db:push         # Push schema to database
npm run db:push --force # Force push schema changes
```

## 🐛 Troubleshooting

### Common Issues

#### Port 5000 Already in Use
```bash
# Kill any process using port 5000
sudo lsof -t -i:5000 | xargs kill -9
```

#### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check database server is running
- Ensure SSL is enabled for cloud databases

#### User Information Shows "Unknown"
This has been fixed in the latest version. The admin dashboard now properly displays:
- User names instead of "User #ID"
- User bind IDs (e.g., USER0001)
- User email addresses

## 📈 Performance Features

- **Real-time Updates**: Efficient polling for live data
- **Database Indexing**: Optimized queries with proper indexing
- **Client-side Caching**: React Query for optimal performance
- **Batch User Loading**: Efficient user data fetching in admin dashboard
- **Connection Pooling**: PostgreSQL connection optimization

## 🎯 Latest Updates

✅ **Fixed User Display Issues**
- Admin dashboard now shows user names and bind IDs instead of "unknown"
- Support tickets display full user information
- Withdrawal requests show user details
- Transaction management includes user bind IDs

✅ **Enhanced Admin Features**
- Improved user information display across all admin panels
- Better user identification with bind ID system
- Enhanced support ticket management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Use the built-in support ticket system
- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues

## 🏗 Architecture

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # UI components with admin enhancements
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   └── pages/          # Application pages
├── server/                 # Backend Express application
│   ├── auth.ts            # Authentication logic
│   ├── db.ts              # Database connection
│   ├── routes.ts          # API routes with user info enhancement
│   └── storage.ts         # Database operations
├── shared/                 # Shared code between frontend and backend
│   └── schema.ts          # Database schema with user bind IDs
├── DEPLOYMENT.md          # Complete production deployment guide
└── package.json           # Dependencies and scripts
```

---

Built with ❤️ for the cryptocurrency mining community. Now with enhanced user management and seamless production deployment!