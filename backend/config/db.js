const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGO_URL;
    if (!uri) {
      console.warn("⚠️  WARNING: No MongoDB URI provided! Database will not be connected.");
      console.warn("Please add a MongoDB database to your Railway project or set the MONGO_URI variable.");
      return;
    }
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
