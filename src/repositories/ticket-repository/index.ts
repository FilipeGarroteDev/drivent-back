import { prisma } from "@/config";
import { Ticket } from "@prisma/client";

function getTicketsTypes() {
  return prisma.ticketType.findMany();
}

function getUserTicketByEnrollmentId(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId,
    },
    include: {
      TicketType: true,
    },
  });
}

async function postNewTicket(newTicket: Omit<Ticket, "id" | "createdAt">) {
  return prisma.ticket.create({
    data: newTicket,
    include: {
      TicketType: true,
    }
  });
}

const ticketsRepository = {
  getTicketsTypes,
  getUserTicketByEnrollmentId,
  postNewTicket,
};

export default ticketsRepository;
