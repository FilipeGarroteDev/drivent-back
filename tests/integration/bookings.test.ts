import app, { init } from "@/app";
import * as jwt from "jsonwebtoken";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createHotel, createHotelRoom, createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import { createUserBooking } from "../factories/bookings-factory";

const server = supertest(app);

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

describe("GET /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is invalid", async () => {
    const token = faker.lorem.word();
    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no active session for the given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 if there is no booking for logged user", async () => {
      const token = await generateValidToken();
      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and with booking object including room data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const hotelRoom = await createHotelRoom(hotel.id);
      const booking = await createUserBooking(user.id, hotelRoom.id);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: {
          capacity: hotelRoom.capacity,
          createdAt: hotelRoom.createdAt.toISOString(),
          updatedAt: hotelRoom.updatedAt.toISOString(),
          hotelId: hotelRoom.hotelId,
          id: hotelRoom.id,
          name: hotelRoom.name,
        }
      });
    });
  });
});
