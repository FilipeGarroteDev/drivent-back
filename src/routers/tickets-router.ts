import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/tickets/types", () => console.log("oi"))
  .get("/tickets", () => console.log("oi"))
  .post("/tickets", () => console.log("oi"));

export { ticketsRouter };
