import { bookAnAvailableHotelRoom, changeActiveBooking, listUserBooking } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const bookingsRouter = Router();

bookingsRouter
  .all("/*", authenticateToken)
  .get("/", listUserBooking)
  .post("/", bookAnAvailableHotelRoom)
  .put("/:bookingId", changeActiveBooking);

export { bookingsRouter };
