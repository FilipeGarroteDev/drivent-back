import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createUserBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
      updatedAt: faker.date.recent(),
      createdAt: faker.date.recent(),
    },
  });
}

export async function searchCreatedBooking(id: number) {
  return prisma.booking.findFirst({
    where: {
      id,
    },
  });
}
