import mongoose from "mongoose"

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => console.log("✊ Database Apne Sath hai"))
        await mongoose.connect(`${process.env.MONGODB_URI}/sharp_gpt`);
    } catch (error) {
        console.log("Connection error : ", error.message);
    }
}

export default connectDB;