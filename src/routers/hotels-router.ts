import { listAllHotels, listAllRoomsFromHotel } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("/", listAllHotels)
  .get("/:hotelId", listAllRoomsFromHotel);

export { hotelsRouter };
