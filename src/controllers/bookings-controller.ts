import { AuthenticatedRequest } from "@/middlewares";
import bookingsService from "@/services/bookings-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function listUserBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as AuthenticatedRequest;

  try {
    const booking = await bookingsService.searchBookingByUserId(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.message === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.message === "ForbiddenError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
  }
}

export async function bookAnAvailableHotelRoom(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as AuthenticatedRequest;
  const roomId: number = req.body.roomId;

  try {
    const bookingId = await bookingsService.createAndSaveNewBooking(userId, roomId);
    res.sendStatus(httpStatus.OK).send(bookingId);
  } catch (error) {
    if (error.message === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.message === "ForbiddenError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
  }
}

// export async function changeActiveBooking(req: AuthenticatedRequest, res: Response) {}
