import { AuthenticatedRequest } from "@/middlewares";
import { TicketTypeId } from "@/protocols";
import ticketsService from "@/services/tickets-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function listSearchedTicketsTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const allOfTicketsTypes = await ticketsService.listTicketsTypes();
    return res.status(httpStatus.OK).send(allOfTicketsTypes);
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function searchUserTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as AuthenticatedRequest;

  try {
    const userTicket = await ticketsService.searchUserTicketByUserId(userId);
    return res.status(httpStatus.OK).send(userTicket);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createNewTicketAndSendData(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as AuthenticatedRequest;
  const ticketTypeId: TicketTypeId = req.body;

  try {
    const ticket = await ticketsService.storeNewTicketAndPickUpContent(ticketTypeId, userId);

    return res.status(httpStatus.CREATED).send(ticket);
  } catch (error) {
    if (error.name === "InvalidDataError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    } else if (error.name === "NotFoundError") return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
