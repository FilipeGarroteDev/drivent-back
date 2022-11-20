import { findTicketPayment } from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { Router } from "express";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", findTicketPayment)
  .post("/process", () => console.log("EM CONSTRUÇÃO"));

export { paymentsRouter };
