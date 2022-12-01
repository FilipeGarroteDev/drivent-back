import { prisma } from "@/config";

function getBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}

function getBookingById(id: number) {
  return prisma.booking.findFirst({
    where: {
      id,
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

function getAllRoomBookings(id: number) {
  return prisma.room.findFirst({
    where: {
      id,
    },
    include: {
      Booking: true,
      _count: {
        select: {
          Booking: true
        }
      }
    },
  });
}

function postNewBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
    include: {
      Room: true,
    },
  });
}

function updateBookingData(id: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id,
    },
    data: {
      roomId,
    },
  });
}

const bookingsRepository = {
  getBookingByUserId,
  getBookingById,
  getRoomsByHotelId,
  getAllRoomBookings,
  postNewBooking,
  updateBookingData,
};

export default bookingsRepository;
