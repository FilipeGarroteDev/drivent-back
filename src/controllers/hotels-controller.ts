import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Hotel } from "@prisma/client";
import { Response } from "express";
import httpStatus from "http-status";

export async function listAllHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as AuthenticatedRequest;

  try {
    const hotelsList: Hotel[] = await hotelsService.searchAllAvailableHotels(userId);
    return res.status(httpStatus.OK).send(hotelsList);
  } catch (error) {
    if (error.name === "ForbiddenError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    } else if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    } else if (error.name === "InvalidDataError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
  }
}

export async function listAllRoomsFromHotel(req: AuthenticatedRequest, res: Response) {
  const { hotelId } = req.params as Record<string, string>;
  const { userId } = req as AuthenticatedRequest;

  try {
    const hotelRooms = await hotelsService.searchHotelRooms(hotelId, userId);
    return res.status(httpStatus.OK).send(hotelRooms);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.name === "ForbiddenError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    } else if (error.name === "InvalidDataError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    } else if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  }
}
