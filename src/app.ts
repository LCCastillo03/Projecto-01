import bookRoutes from "./routes/book.routes";
import userRoutes from "./routes/user.routes";
import express from "express";
import { Request, Response } from "express";
import cors from "cors";

const SERVER_VERSION = "/api/";

function routeNotFound(request: Request, response: Response) {
  response.status(404).json({
    message: "Route not found.",
  });
}

export default function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(SERVER_VERSION + "users", userRoutes);
  app.use(SERVER_VERSION + "books", bookRoutes);

  app.use(routeNotFound);
  return app;
}