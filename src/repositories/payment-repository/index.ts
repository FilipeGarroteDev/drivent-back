import { prisma } from "@/config";
import { Payment } from "@prisma/client";

function getTicketById(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      Enrollment: true,
      TicketType: true,
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

function postTicketPayment(paymentData: Omit<Payment, "id" | "createdAt">) {
  return prisma.payment.create({
    data: paymentData,
  });
}

function setPaidStatusOnTicket(ticketId: number) {
  return prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: "PAID",
    },
  });
}

const paymentsRepository = {
  getTicketById,
  getPaymentData,
  postTicketPayment,
  setPaidStatusOnTicket,
};

export default paymentsRepository;
