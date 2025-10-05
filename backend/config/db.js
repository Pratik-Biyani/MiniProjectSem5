// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('💡 Please check:');
    console.log('   1. MongoDB is running (mongod)');
    console.log('   2. MONGO_URI in .env file is correct');
    console.log('   3. Database name exists');
    process.exit(1);
  }
};

module.exports = connectDB;