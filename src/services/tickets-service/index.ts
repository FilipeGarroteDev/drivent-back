import { notFoundError } from "@/errors";
import { TicketsTypes, TicketTypeId } from "@/protocols";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/ticket-repository";
import { Ticket } from "@prisma/client";

async function listTicketsTypes(): Promise<TicketsTypes[]> {
  const tickets = await ticketsRepository.getTicketsTypes();
  return tickets;
}

async function searchUserTicketByUserId(userId: number) {
  const enrollmentId: number = await verifyUserEnrollment(userId);

  const ticket = await ticketsRepository.getUserTicketByEnrollmentId(enrollmentId);
  if (!ticket) {
    throw notFoundError();
  }

  return ticket;
}

async function createAndStoreNewTicket(ticketTypeId: TicketTypeId, userId: number) {
  const enrollmentId: number = await verifyUserEnrollment(userId);

  const newTicket: Omit<Ticket, "id" | "createdAt"> = {
    ticketTypeId: ticketTypeId.ticketTypeId,
    enrollmentId,
    status: "RESERVED",
    updatedAt: new Date(),
  };

  return await ticketsRepository.postNewTicket(newTicket);
}

async function verifyUserEnrollment(userId: number): Promise<number> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  return enrollment.id;
}

const ticketsService = {
  listTicketsTypes,
  searchUserTicketByUserId,
  createAndStoreNewTicket,
};

export default ticketsService;
