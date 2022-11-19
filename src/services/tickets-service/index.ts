import { invalidDataError, notFoundError } from "@/errors";
import { TicketsTypes, TicketTypeId } from "@/protocols";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { ticketTypeSchema } from "@/schemas";
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

async function storeNewTicketAndPickUpContent(ticketTypeId: TicketTypeId, userId: number) {
  const enrollmentId: number = await verifyUserEnrollment(userId);

  const { error } = ticketTypeSchema.validate(ticketTypeId);

  if (error) {
    const messages = error.details.map((err) => err.message);
    throw invalidDataError(messages);
  }

  createAndSaveTicket(ticketTypeId.ticketTypeId, enrollmentId);

  return await ticketsRepository.getTicketByTicketTypeId(ticketTypeId.ticketTypeId);
}

async function verifyUserEnrollment(userId: number): Promise<number> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  return enrollment.id;
}

async function createAndSaveTicket(ticketTypeId: number, enrollmentId: number) {
  const newTicket: Omit<Ticket, "id" | "createdAt"> = {
    ticketTypeId,
    enrollmentId,
    status: "RESERVED",
    updatedAt: new Date(),
  };

  await ticketsRepository.postNewTicket(newTicket);
}

const ticketsService = {
  listTicketsTypes,
  searchUserTicketByUserId,
  storeNewTicketAndPickUpContent,
};

export default ticketsService;
