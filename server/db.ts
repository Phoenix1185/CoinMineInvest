import mongoose from 'mongoose';

// MongoDB connection string (will be updated in environment variables)
const MONGODB_URI = process.env.DATABASE_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/cryptomine_pro';

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    console.log('✓ Already connected to MongoDB');
    return;
  }

  try {
    // Configure Mongoose
    mongoose.set('strictQuery', false);
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      retryWrites: true,
      w: 'majority'
    });

    isConnected = true;
    console.log('✓ Connected to MongoDB');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
      isConnected = true;
    });

  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    isConnected = false;
    throw error;
  }
}

export async function disconnectFromDatabase() {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('✓ Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnectFromDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectFromDatabase();
  process.exit(0);
});

export default mongoose;