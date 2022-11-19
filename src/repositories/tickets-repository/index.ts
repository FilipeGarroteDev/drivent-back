import { prisma } from "@/config";
import { NewTicketEntity } from "@/protocols";

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

function getTicketByTicketType(ticketTypeId: number) {
  return prisma.ticket.findFirst({
    where: {
      ticketTypeId: ticketTypeId,
    },
    include: {
      TicketType: true,
    },
  });
}

function postNewTicket(newTicket: any) {
  return prisma.ticket.create({
    data: newTicket,
  });
}

const ticketsRepository = {
  getTicketsTypes,
  getUserTicketByEnrollmentId,
  getTicketByTicketType,
  postNewTicket,
};

export default ticketsRepository;
