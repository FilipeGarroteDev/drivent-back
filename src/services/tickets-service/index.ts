import { invalidDataError, notFoundError } from "@/errors";
import { NewTicketEntity, TicketsTypes, TicketTypeId } from "@/protocols";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { ticketTypeSchema } from "@/schemas";

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

async function searchTicketByTicketType(ticketTypeId: TicketTypeId, userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const validate = ticketTypeSchema.validate(ticketTypeId);

  if (!validate || !ticketTypeId.ticketTypeId) {
    const messages = validate.error.details.map((err) => err.message);
    throw invalidDataError(messages);
  }

  saveCreatedTicket(ticketTypeId.ticketTypeId, enrollment.id);

  return await ticketsRepository.getTicketByTicketType(Number(ticketTypeId.ticketTypeId));
}

async function saveCreatedTicket(ticketTypeId: number, enrollmentId: number) {
  const newTicket = {
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
  searchTicketByTicketType,
};

export default ticketsService;
