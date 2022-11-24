import { prisma } from "@/config";

function getAllHotels() {
  return prisma.hotel.findMany();
}

function getRoomsByHotelId(hotelId: number) {
  return prisma.room.findMany({
    where: {
      hotelId,
    },
    include: {
      Hotel: true,
    },
  });
}

const hotelsRepository = {
  getAllHotels,
  getRoomsByHotelId,
};

export default hotelsRepository;
