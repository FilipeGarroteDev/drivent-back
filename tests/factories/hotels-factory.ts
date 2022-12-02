import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.internet.url(),
      updatedAt: new Date(),
    },
  });
}

export async function createHotelRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: 3,
      hotelId,
      updatedAt: new Date(),
    },
  });
}

export async function createHotelSingleRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: 1,
      hotelId,
      updatedAt: new Date(),
    },
  });
}
