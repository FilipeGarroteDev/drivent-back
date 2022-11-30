import { forbiddenError, invalidDataError, notFoundError, unauthorizedError } from "@/errors";
import bookingsRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotel-repository";
import ticketsRepository from "@/repositories/ticket-repository";

async function searchBookingByUserId(userId: number) {
  const enrollmentId = await verifyUserEnrollment(userId);
  const ticket = await ticketsRepository.getUserTicketByEnrollmentId(enrollmentId);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw unauthorizedError();
  }

  const booking = await bookingsRepository.getUserBooking(userId);

  if (!booking) {
    throw notFoundError();
  }

  return booking;
}

async function searchHotelRooms(hotelId: string, userId: number) {
  const enrollmentId = await verifyUserEnrollment(userId);
  const ticket = await ticketsRepository.getUserTicketByEnrollmentId(enrollmentId);
  const numberHotelId = Number(hotelId);

  if (!ticket || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote) {
    throw forbiddenError();
  } else if (ticket.status === "RESERVED") {
    throw invalidDataError(["Ticket payment not found"]);
  } else if (!numberHotelId) {
    throw notFoundError();
  }

  const allOfRooms = await hotelsRepository.getRoomsByHotelId(numberHotelId);
  return allOfRooms;
}

async function verifyUserEnrollment(userId: number): Promise<number> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw unauthorizedError();
  }
  return enrollment.id;
}

const bookingsService = {
  searchBookingByUserId,
  searchHotelRooms,
};

export default bookingsService;
