import { fastifyCors } from "@fastify/cors";
import "dotenv/config";
import { fastify } from "fastify";
import { createCompletionRoute } from "./routes/ai/create-completion";

const host = "RENDER" in process.env ? `0.0.0.0` : `localhost`;

const app = fastify();

app.register(fastifyCors, {
  origin: "*",
});

app.get("/ping", async (request, reply) => {
  return "pong";
});

app.register(createCompletionRoute);

app
  .listen({
    host,
    port: Number(process.env.PORT) || 3000,
  })
  .then((address) => {
    console.log(`Server listening on ${address}`);
  });
