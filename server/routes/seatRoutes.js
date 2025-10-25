import express from "express";
import auth from "../middleware/authMiddleware.js";
import Seat from "../models/Seat.js";

const router = express.Router();


// GET all seats
router.get("/", async (req, res) => {
try {
const seats = await Seat.find().populate("bookedBy", "name email");
res.json(seats);
} catch (err) {
console.error(err);
res.status(500).send("Server error");
}
});



// Book seats (body: { seatNumbers: ["R1C1","R2C3"] })
router.post("/book", auth, async (req, res) => {
try {
const userId = req.user.id;
const { seatNumbers } = req.body;
if (!Array.isArray(seatNumbers) || seatNumbers.length === 0)
return res.status(400).json({ msg: "No seats provided" });


// Use transactions for atomicity if using replica set; simplified here
const updated = [];
for (const sn of seatNumbers) {
const seat = await Seat.findOne({ seatNumber: sn });
if (!seat) return res.status(404).json({ msg: `Seat ${sn} not found` });
if (seat.isBooked && seat.bookedBy?.toString() !== userId)
return res.status(400).json({ msg: `Seat ${sn} already booked` });
seat.isBooked = true;
seat.bookedBy = userId;
await seat.save();
updated.push(seat);
}


res.json({ msg: "Booked", seats: updated });
} catch (err) {
console.error(err);
res.status(500).send("Server error");
}
});



// Cancel seat booking (only by owner)
// POST /api/seats/cancel body { seatNumber: "R1C1" }
router.post("/cancel", auth, async (req, res) => {
try {
const { seatNumber } = req.body;
const userId = req.user.id;
const seat = await Seat.findOne({ seatNumber });
if (!seat) return res.status(404).json({ msg: "Seat not found" });
if (!seat.isBooked || seat.bookedBy?.toString() !== userId)
return res.status(403).json({ msg: "You don't own this booking" });


seat.isBooked = false;
seat.bookedBy = null;
await seat.save();
res.json({ msg: "Cancelled", seat });
} catch (err) {
console.error(err);
res.status(500).send("Server error");
}
});




// Update booking: change seats (body { from: ["R1C1"], to: ["R2C1","R2C2"] })
router.post("/update", auth, async (req, res) => {
try {
const userId = req.user.id;
const { from = [], to = [] } = req.body;


// Release 'from' seats owned by user
for (const f of from) {
const seat = await Seat.findOne({ seatNumber: f });
if (!seat) return res.status(404).json({ msg: `Seat ${f} not found` });
if (seat.bookedBy?.toString() !== userId) return res.status(403).json({ msg: `You don't own ${f}` });
seat.isBooked = false;
seat.bookedBy = null;
await seat.save();
}


// Book 'to' seats if available
const booked = [];
for (const t of to) {
const seat = await Seat.findOne({ seatNumber: t });
if (!seat) return res.status(404).json({ msg: `Seat ${t} not found` });
if (seat.isBooked && seat.bookedBy?.toString() !== userId) return res.status(400).json({ msg: `${t} already booked` });
seat.isBooked = true;
seat.bookedBy = userId;
await seat.save();
booked.push(seat);
}


res.json({ msg: "Updated", booked });
} catch (err) {
console.error(err);
res.status(500).send("Server error");
}
});


export default router;