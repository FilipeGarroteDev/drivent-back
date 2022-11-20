import { AuthenticatedRequest } from "@/middlewares";
import { FinishPayment } from "@/protocols";
import paymentsService from "@/services/payments-service";
import { Payment } from "@prisma/client";
import { Response } from "express";
import httpStatus from "http-status";

export async function findTicketPayment(req: AuthenticatedRequest, res: Response) {
  const { ticketId } = req.query as Record<string, string>;
  const { userId } = req as AuthenticatedRequest;

  try {
    const payment: Payment = await paymentsService.searchPaymentByTicketId(ticketId, userId);
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    } else if (error.name === "InvalidDataError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
}

export async function finishTicketPayment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as AuthenticatedRequest;
  const paymentBody: FinishPayment = req.body;

  try {
    const paymentData: Payment = await paymentsService.payUsersReservedTicket(userId, paymentBody);
    return res.status(httpStatus.OK).send(paymentData);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  }
}
