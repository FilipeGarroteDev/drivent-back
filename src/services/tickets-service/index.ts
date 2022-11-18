import { TicketsTypes } from "@/protocols";
import ticketsRepository from "@/repositories/tickets-repository";

async function listTicketsTypes(): Promise<TicketsTypes[]> {
  const tickets = await ticketsRepository.getTicketsTypes();
  return tickets;
}

const ticketsService = {
  listTicketsTypes,
};

export default ticketsService;
