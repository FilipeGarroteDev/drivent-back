import { invalidDataError, notFoundError, unauthorizedError } from "@/errors";
import paymentsRepository from "@/repositories/payments-repository";

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

const paymentsService = {
  searchPaymentByTicketId,
};

export default paymentsService;
