import { prisma } from "@/config";

function getTicketById(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      Enrollment: true,
    },
  });
}

function getPaymentData(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

const paymentsRepository = {
  getTicketById,
  getPaymentData,
};

export default paymentsRepository;
