import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path"


import authRoutes from "./routes/authRoutes.js";
import seatRoutes from "./routes/seatRoutes.js";


dotenv.config();


const app = express();
app.use(express.json());
app.use(cors());


app.use("/api/auth", authRoutes);
app.use("/api/seats", seatRoutes);

const __dirname1 = path.resolve();
app.use(express.static(path.join(__dirname1, "frontend", "dist"))); 


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname1, "frontend", "dist", "index.html"));
});


const PORT = process.env.PORT || 5000;


mongoose
.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
console.log("MongoDB connected Succesfully");
// initialize seats if not present
const Seat = (await import("./models/Seat.js")).default;
const count = await Seat.countDocuments();
if (count === 0) {
const seats = [];
for (let r = 1; r <= 5; r++) {
for (let c = 1; c <= 6; c++) {
seats.push({ seatNumber: `R${r}C${c}` });
}
}
await Seat.insertMany(seats);
console.log("Initialized seats");
}


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => console.error(err));