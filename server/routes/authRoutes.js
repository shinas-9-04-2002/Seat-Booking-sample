import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


import User from "../models/User.js";


dotenv.config();
const router = express.Router();


// Register
router.post("/register", async (req, res) => {
try {
const { name, email, password } = req.body;
let user = await User.findOne({ email });
if (user) return res.status(400).json({ msg: "User already exists" });


const salt = await bcrypt.genSalt(10);
const hashed = await bcrypt.hash(password, salt);


user = new User({ name, email, password: hashed });
await user.save();


const payload = { user: { id: user._id } };
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });


res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
} catch (err) {
console.error(err);
res.status(500).send("Server error");
}
});


// Login
router.post("/login", async (req, res) => {
try {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(400).json({ msg: "Invalid credentials" });


const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });


const payload = { user: { id: user._id } };
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });


res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
} catch (err) {
console.error(err);
res.status(500).send("Server error");
}
});


export default router;