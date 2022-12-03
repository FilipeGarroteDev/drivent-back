import { forbiddenError, notFoundError } from "@/errors";
import { BookingEntity, CompletedTicket } from "@/protocols";
import bookingsRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/ticket-repository";

async function searchBookingByUserId(userId: number): Promise<BookingEntity> {
  const booking: BookingEntity = await bookingsRepository.getBookingByUserId(userId);

  if (!booking) {
    throw notFoundError();
  }

  return booking;
}

async function createAndSaveNewBooking(userId: number, roomId: number): Promise<number> {
  const enrollmentId: number = await verifyUserEnrollment(userId);
  const ticket: CompletedTicket = await ticketsRepository.getUserTicketByEnrollmentId(enrollmentId);
  const totalRoomBookings = await bookingsRepository.getAllRoomBookings(roomId);

  verifyValidTicket(ticket);

  if (!roomId || !totalRoomBookings) {
    throw notFoundError();
  }

  if (totalRoomBookings.Booking.length >= totalRoomBookings.capacity) {
    throw forbiddenError();
  }

  const booking = await bookingsRepository.postNewBooking(userId, roomId);

  return booking.id;
}

async function changeExistentBookingData(userId: number, roomId: number, bookingId: string): Promise<number> {
  const totalRoomBookings = await bookingsRepository.getAllRoomBookings(roomId);
  const numberBookingId = Number(bookingId);

  if (!roomId || !totalRoomBookings) {
    throw notFoundError();
  }

  if (totalRoomBookings.Booking.length >= totalRoomBookings.capacity) {
    throw forbiddenError();
  }

  const booking = await bookingsRepository.getBookingByUserId(userId);

  if (!numberBookingId || !booking || booking.id !== numberBookingId) {
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

function verifyValidTicket(ticket: CompletedTicket): void {
  if (!ticket) {
    throw forbiddenError();
  } else if (ticket.status === "RESERVED") {
    throw forbiddenError();
  } else if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }
}

const bookingsService = {
  searchBookingByUserId,
  createAndSaveNewBooking,
  changeExistentBookingData,
};

export default bookingsService;
