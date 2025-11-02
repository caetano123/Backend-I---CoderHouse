import mongoose from "mongoose";

const connectDB = async () => {
  try {
await mongoose.connect("mongodb://127.0.0.1:27017/backend1");
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error);
  }
};

export default connectDB;
