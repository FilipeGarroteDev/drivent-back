import { prisma } from "@/config";

function getBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      Room: true,
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
  getAllRoomBookings,
  postNewBooking,
  updateBookingData,
};

export default bookingsRepository;
