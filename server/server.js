import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import authRoutes from "./routes/authRoutes.js";
import seatRoutes from "./routes/seatRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/seats", seatRoutes);

// --- Serve frontend (client/dist) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname1 = dirname(__filename);

app.use(express.static(join(__dirname1, "client/dist")));

app.use((req, res) => {
  res.sendFile(join(__dirname1, "client/dist/index.html"));
});

// --- Connect DB and start server ---
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("MongoDB connected successfully");

    // Initialize seats if not present
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
