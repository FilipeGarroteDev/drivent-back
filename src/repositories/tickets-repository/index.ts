import { prisma } from "@/config";

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

const ticketsRepository = {
  getTicketsTypes,
  getUserTicketByEnrollmentId
};

export default ticketsRepository;
