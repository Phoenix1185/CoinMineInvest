# CryptoMine Pro

A comprehensive cryptocurrency mining platform that enables users to purchase mining contracts, track earnings, and manage withdrawals. Built with modern web technologies and featuring real-time price tracking and admin management capabilities.

## 🚀 Features

### User Features
- **Mining Contract Management**: Purchase and manage different mining plans
- **Real-time Earnings**: Track mining earnings updated every second
- **Cryptocurrency Withdrawals**: Support for multiple cryptocurrencies (BTC, ETH, USDT, BNB, SOL, ADA, DOT)
- **Live Price Tracking**: Real-time cryptocurrency price updates
- **Transaction History**: Complete history of purchases and withdrawals
- **Support System**: Built-in ticket system for user support

### Admin Features
- **Transaction Management**: Approve or reject user transactions
- **Withdrawal Processing**: Process withdrawal requests with transaction hash tracking
- **User Management**: View and manage all platform users
- **Analytics Dashboard**: Platform statistics and performance metrics
- **Announcement System**: Create and manage platform announcements
- **Support Ticket Management**: Handle user support requests

### Technical Features
- **Real-time Updates**: Live balance and earnings updates
- **Secure Authentication**: Replit OAuth integration
- **Database Management**: PostgreSQL with Drizzle ORM
- **Responsive Design**: Modern UI with dark theme
- **Type Safety**: Full TypeScript implementation

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
- **PostgreSQL** database
- **Replit OAuth** for authentication

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
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
   # Create PostgreSQL database
   createdb cryptomine_pro
   
   # Push schema to database
   npm run db:push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 🚀 Deployment

### Replit Deployment (Recommended)

1. **Import to Replit**
   - Create a new Replit project
   - Import your code repository
   - Replit will automatically detect the Node.js environment

2. **Configure Environment Variables**
   - Go to your Replit project settings
   - Add all required environment variables in the "Secrets" tab
   - Replit will automatically provide `DATABASE_URL` for the built-in PostgreSQL

3. **Deploy Database Schema**
   ```bash
   npm run db:push
   ```

4. **Start the Application**
   ```bash
   npm run dev
   ```

Replit will automatically handle the deployment and provide you with a public URL.

### VPS/Cloud Deployment

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib
   ```

2. **Database Setup**
   ```bash
   # Create database user and database
   sudo -u postgres createuser --superuser cryptomine
   sudo -u postgres createdb cryptomine_pro
   sudo -u postgres psql -c "ALTER USER cryptomine PASSWORD 'your_password';"
   ```

3. **Application Deployment**
   ```bash
   # Clone repository
   git clone <repository-url>
   cd cryptomine-pro
   
   # Install dependencies
   npm install
   
   # Build application
   npm run build
   
   # Push database schema
   npm run db:push
   
   # Start with PM2 (recommended)
   npm install -g pm2
   pm2 start npm --name "cryptomine-pro" -- run dev
   pm2 startup
   pm2 save
   ```

4. **Nginx Configuration** (Optional)
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   
   COPY . .
   RUN npm run build
   
   EXPOSE 5000
   CMD ["npm", "run", "dev"]
   ```

2. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "5000:5000"
       environment:
         - DATABASE_URL=postgresql://postgres:password@db:5432/cryptomine_pro
         - SESSION_SECRET=your_session_secret
       depends_on:
         - db
     
     db:
       image: postgres:15
       environment:
         - POSTGRES_DB=cryptomine_pro
         - POSTGRES_PASSWORD=password
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
   volumes:
     postgres_data:
   ```

3. **Deploy**
   ```bash
   docker-compose up -d
   ```

## 🔧 Configuration

### Mining Plans
The platform comes with pre-configured mining plans. You can modify them by updating the database or using the admin interface.

### Admin Account
An admin account is automatically created on first startup:
- Email: `admin@cryptomine.pro`
- Password: `admin123`

**Important**: Change the admin password immediately after deployment!

### Cryptocurrency Prices
The platform automatically fetches cryptocurrency prices from external APIs. Fallback prices are configured in case of API failures.

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User accounts and authentication
- `mining_plans` - Available mining contract plans
- `mining_contracts` - Active user mining contracts
- `mining_earnings` - Real-time earnings records
- `transactions` - Purchase transactions
- `withdrawals` - Withdrawal requests
- `crypto_prices` - Cryptocurrency price data
- `announcements` - Platform announcements
- `support_tickets` - User support system

## 🔒 Security

- **Authentication**: Secure OAuth integration
- **Session Management**: Server-side sessions with PostgreSQL storage
- **CSRF Protection**: Built-in CSRF protection
- **Input Validation**: Comprehensive input validation with Zod
- **SQL Injection Prevention**: Parameterized queries with Drizzle ORM

## 🧪 Development

### Running Tests
```bash
npm test
```

### Database Management
```bash
# Push schema changes
npm run db:push

# Force push (if conflicts)
npm run db:push --force

# Generate migrations
npm run db:generate
```

### Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## 📈 Performance Optimization

The application includes several performance optimizations:
- **Real-time Updates**: Efficient WebSocket-like updates using polling
- **Database Indexing**: Optimized database queries
- **Caching**: React Query for client-side caching
- **Code Splitting**: Dynamic imports for optimal bundle size
- **Image Optimization**: Optimized asset loading

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
- Contact the development team
- Check the documentation

## 🏗 Architecture

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   └── pages/          # Application pages
├── server/                 # Backend Express application
│   ├── auth.ts            # Authentication logic
│   ├── db.ts              # Database connection
│   ├── routes.ts          # API routes
│   └── storage.ts         # Database operations
├── shared/                 # Shared code between frontend and backend
│   └── schema.ts          # Database schema and validation
└── package.json           # Dependencies and scripts
```

## 🎯 Roadmap

- [ ] Mobile application
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Additional payment methods
- [ ] Enhanced security features
- [ ] API documentation
- [ ] Automated testing suite

---

Built with ❤️ for the cryptocurrency mining community.