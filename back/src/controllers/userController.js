import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const signup = async (request, reply) => {
  try {
    const { name, email, password } = request.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return reply.status(400).send({ message: "User already exists" });

    const user = await prisma.user.create({
      data: { name, email, password },
    });

    return reply.status(201).send({ message: "User created", user });
  } catch (err) {
    console.error(err);
    reply.status(500).send({ message: "Server error" });
  }
};

export const login = async (request, reply) => {
  try {
    const { email, password } = request.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return reply.status(400).send({ message: "Invalid credentials" });

    if (user.password !== password) {
      return reply.status(400).send({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });

    return reply.send({ message: "Login success", token, user, userId: user.id, name: user.name});
  } catch (err) {
    console.error(err);
    reply.status(500).send({ message: "Server error" });
  }
};
