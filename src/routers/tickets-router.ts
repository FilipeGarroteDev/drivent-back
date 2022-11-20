import { createNewTicketAndSendData, listSearchedTicketsTypes, searchUserTicket } from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { ticketTypeSchema } from "@/schemas";
import { Router } from "express";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", listSearchedTicketsTypes)
  .get("/", searchUserTicket)
  .post("/", validateBody(ticketTypeSchema), createNewTicketAndSendData);

export { ticketsRouter };
