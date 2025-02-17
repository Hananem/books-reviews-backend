

import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://merntypescript:merntypescript@cluster0-shard-00-00.yz3wc.mongodb.net:27017,cluster0-shard-00-01.yz3wc.mongodb.net:27017,cluster0-shard-00-02.yz3wc.mongodb.net:27017/?ssl=true&replicaSet=atlas-ghrc4q-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI); // 🔥 No need for extra options

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;

