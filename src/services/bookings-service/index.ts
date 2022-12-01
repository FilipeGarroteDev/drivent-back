import { forbiddenError, notFoundError } from "@/errors";
import bookingsRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/ticket-repository";

async function searchBookingByUserId(userId: number) {
  const booking = await bookingsRepository.getBookingByUserId(userId);

  if (!booking) {
    throw notFoundError();
  }

  return booking;
}

async function createAndSaveNewBooking(userId: number, roomId: number) {
  const enrollmentId = await verifyUserEnrollment(userId);
  const ticket = await ticketsRepository.getUserTicketByEnrollmentId(enrollmentId);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  const booking = await bookingsRepository.postNewBooking(userId, roomId);

  if (!roomId) {
    throw notFoundError();
  } else if (booking.Room.capacity < 1) {
    throw forbiddenError();
  }

  return booking.id;
}

async function changeExistentBookingData(userId: number, roomId: number, bookingId: string) {
  const enrollmentId = await verifyUserEnrollment(userId);
  const ticket = await ticketsRepository.getUserTicketByEnrollmentId(enrollmentId);
  const totalRoomBookings = await bookingsRepository.getAllRoomBookings(roomId);
  const numberBookingId = Number(bookingId);

  if (!roomId) {
    throw notFoundError();
  } else if (
    !ticket ||
    ticket.status === "RESERVED" ||
    ticket.TicketType.isRemote ||
    !ticket.TicketType.includesHotel ||
    !numberBookingId ||
    !totalRoomBookings ||
    totalRoomBookings._count.Booking === totalRoomBookings.capacity
  ) {
    throw forbiddenError();
  }

  const booking = await bookingsRepository.getBookingByUserId(userId);

  if (!booking || booking.id !== numberBookingId) {
    throw forbiddenError();
  }

  const changedBooking = await bookingsRepository.updateBookingData(numberBookingId, roomId);
  return changedBooking.id;
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
  changeExistentBookingData,
};

export default bookingsService;
