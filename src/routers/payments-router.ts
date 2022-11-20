import { findTicketPayment, finishTicketPayment } from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { paymentsSchema } from "@/schemas";
import { Router } from "express";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", findTicketPayment)
  .post("/process", validateBody(paymentsSchema), finishTicketPayment);

export { paymentsRouter };
