import { notFoundError } from "@/errors";
import { TicketsTypes } from "@/protocols";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";

async function listTicketsTypes(): Promise<TicketsTypes[]> {
  const tickets = await ticketsRepository.getTicketsTypes();
  return tickets;
}

async function searchUserTicketByUserId(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketsRepository.getUserTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  }

  return ticket;
}

const ticketsService = {
  listTicketsTypes,
  searchUserTicketByUserId,
};

export default ticketsService;
