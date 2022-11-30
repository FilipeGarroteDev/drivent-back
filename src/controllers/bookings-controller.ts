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
    } else if (error.message === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  }
}

// export async function bookAnAvailableHotelRoom(req: AuthenticatedRequest, res: Response) {}

// export async function changeActiveBooking(req: AuthenticatedRequest, res: Response) {}
