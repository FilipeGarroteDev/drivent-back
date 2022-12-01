import { forbiddenError, notFoundError } from "@/errors";
import bookingsRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/ticket-repository";

async function searchBookingByUserId(userId: number) {
  const booking = await bookingsRepository.getUserBooking(userId);

  if (!booking) {
    throw notFoundError();
  }

  return booking;
}

async function createAndSaveNewBooking(userId: number, roomId: string) {
  const enrollmentId = await verifyUserEnrollment(userId);
  const ticket = await ticketsRepository.getUserTicketByEnrollmentId(enrollmentId);
  const numberRoomId = Number(roomId);

  if (
    !ticket ||
    ticket.status === "RESERVED" ||
    ticket.TicketType.isRemote ||
    !ticket.TicketType.includesHotel ||
    !numberRoomId
  ) {
    throw forbiddenError();
  }

  const booking = await bookingsRepository.postNewBooking(userId, numberRoomId);

  if (!roomId) {
    throw notFoundError();
  } else if (booking.Room.capacity < 1) {
    throw forbiddenError();
  }

  return booking.id;
}

async function verifyUserEnrollment(userId: number): Promise<number> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw forbiddenError();
  }
  return enrollment.id;
}

const bookingsService = {
  searchBookingByUserId,
  createAndSaveNewBooking,
};

export default bookingsService;
