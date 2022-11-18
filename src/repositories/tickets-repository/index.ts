import { prisma } from "@/config";

function getTicketsTypes() {
  return prisma.ticketType.findMany();
}

const ticketsRepository = {
  getTicketsTypes,
};

export default ticketsRepository;
