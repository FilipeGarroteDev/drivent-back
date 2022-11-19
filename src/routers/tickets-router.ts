import { createNewTicketAndSendData, listSearchedTicketsTypes, searchUserTicket } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", listSearchedTicketsTypes)
  .get("/", searchUserTicket)
  .post("/", createNewTicketAndSendData);

export { ticketsRouter };
