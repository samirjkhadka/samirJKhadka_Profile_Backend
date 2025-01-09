import mongoose from "mongoose";


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB Database Connected: ${conn.connection.db.databaseName}`);
    } catch (error) {
        console.log("Database Error: " + error);
        process.exit(1);
    }
}

export default connectDB;