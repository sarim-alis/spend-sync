import { signup, login } from "../controllers/userController.js";

async function userRoutes(fastify, options) {
  fastify.post("/signup", signup);
  fastify.post("/login", login);
}

export default userRoutes;
