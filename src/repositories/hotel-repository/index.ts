import { prisma } from "@/config";

function getAllHotels() {
  return prisma.hotel.findMany();
}

const hotelsRepository = {
  getAllHotels,
};

export default hotelsRepository;
