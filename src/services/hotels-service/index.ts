import { invalidDataError, notFoundError, unauthorizedError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotel-repository";
import ticketsRepository from "@/repositories/ticket-repository";
import { Hotel } from "@prisma/client";

async function searchAllAvailableHotels(userId: number): Promise<Hotel[]> {
  const enrollmentId = await verifyUserEnrollment(userId);
  const ticket = await ticketsRepository.getUserTicketByEnrollmentId(enrollmentId);

  if (!ticket || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote) {
    throw notFoundError();
  } else if (ticket.status === "RESERVED") {
    throw invalidDataError(["Ticket payment not found"]);
  }

  return await hotelsRepository.getAllHotels();
}

async function verifyUserEnrollment(userId: number): Promise<number> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw unauthorizedError();
  }
  return enrollment.id;
}

const hotelsService = {
  searchAllAvailableHotels,
};

export default hotelsService;
