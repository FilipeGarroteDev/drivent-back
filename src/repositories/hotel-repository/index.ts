import { prisma } from "@/config";

function getAllHotels() {
  return prisma.hotel.findMany();
}

function getRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

const hotelsRepository = {
  getAllHotels,
  getRoomsByHotelId,
};

export default hotelsRepository;
