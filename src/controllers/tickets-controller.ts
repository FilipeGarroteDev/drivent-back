import { AuthenticatedRequest } from "@/middlewares";
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
