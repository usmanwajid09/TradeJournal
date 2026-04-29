import dns from 'node:dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Try to force Google DNS for SRV resolution
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
    try {
        console.log("[Database] Attempting connection to:", process.env.MONGODB_URI.split('@')[1]);
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            family: 4
        });
        console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[Database] Error: ${error.message}`);
        // If it still fails, it's a network restriction on the agent's side.
    }
};

export default connectDB;
