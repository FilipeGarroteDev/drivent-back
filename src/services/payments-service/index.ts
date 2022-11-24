import { invalidDataError, notFoundError, unauthorizedError } from "@/errors";
import { FinishPayment } from "@/protocols";
import paymentsRepository from "@/repositories/payment-repository";
import { Payment } from "@prisma/client";

async function searchPaymentByTicketId(ticketId: string, userId: number) {
  if (!ticketId) throw invalidDataError([]);

  const ticket = await paymentsRepository.getTicketById(Number(ticketId));

  if (!ticket) {
    throw notFoundError();
  } else if (ticket.Enrollment.userId !== userId) {
    throw unauthorizedError();
  }

  return await paymentsRepository.getPaymentData(Number(ticketId));
}

async function payUsersReservedTicket(userId: number, payment: FinishPayment): Promise<Payment> {
  const ticket = await paymentsRepository.getTicketById(Number(payment.ticketId));
  if (!ticket) {
    throw notFoundError();
  } else if (ticket.Enrollment.userId !== userId) {
    throw unauthorizedError();
  }

  const finishedPayment: Payment = await handleAndSavePaymentInfo(payment, ticket.TicketType.price);
  await paymentsRepository.setPaidStatusOnTicket(Number(payment.ticketId));
  return finishedPayment;
}

async function handleAndSavePaymentInfo(payment: FinishPayment, price: number) {
  const cardLastDigits: string = payment.cardData.number.toString().slice(-4);
  const paymentData: Omit<Payment, "id" | "createdAt"> = {
    ticketId: payment.ticketId,
    value: price,
    cardIssuer: payment.cardData.issuer,
    cardLastDigits,
    updatedAt: new Date(),
  };

  return await paymentsRepository.postTicketPayment(paymentData);
}

const paymentsService = {
  searchPaymentByTicketId,
  payUsersReservedTicket,
};

export default paymentsService;
