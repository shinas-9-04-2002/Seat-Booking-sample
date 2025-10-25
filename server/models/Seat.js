import mongoose from "mongoose";


const seatSchema = new mongoose.Schema({
seatNumber: { type: String, required: true, unique: true },
isBooked: { type: Boolean, default: false },
bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
});


export default mongoose.model("Seat", seatSchema);