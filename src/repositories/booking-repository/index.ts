import { prisma } from "@/config";

function getUserBooking(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}

function getRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

function postNewBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId
    },
    include: {
      Room: true,
    },
  });
}

const bookingsRepository = {
  getUserBooking,
  getRoomsByHotelId,
  postNewBooking,
};

export default bookingsRepository;
