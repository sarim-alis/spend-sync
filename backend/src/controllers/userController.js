// src/controllers/userController.js
// Imports.
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";


// Signup.
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists.
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // Create user.
    const user = await prisma.user.create({
      data: { name, email, password },
    });

    return res.status(201).json({ message: "User created", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// Login.
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists.
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Login user.
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });

    return res.json({ message: "Login success", token, user, userId: user.id, name: user.name});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
