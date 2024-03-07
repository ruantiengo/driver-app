import { prisma } from "@/server";

import { CarRent } from "./carRentModel";
import { CreateCarRentDTO } from "./dto/car-rent-dto";

export const carRentRepository = {
  findAll: async (): Promise<CarRent[]> => {
    return await prisma.carRent.findMany({
      include: {
        driver: true,
        car: true,
      },
    });
  },

  findById: async (id: number): Promise<CarRent | null> => {
    return await prisma.carRent.findUnique({ where: { id } });
  },

  create: async (newCarRentDTO: CreateCarRentDTO): Promise<CarRent> => {
    return await prisma.carRent.create({
      data: newCarRentDTO,
    });
  },

  update: async (carRent: CarRent): Promise<CarRent> => {
    return await prisma.carRent.update({
      where: { id: carRent.id },
      data: carRent,
    });
  },

  delete: async (id: number): Promise<CarRent> => {
    return await prisma.carRent.delete({
      where: { id },
    });
  },

  findActiveByDriverId: async (driverId: number): Promise<CarRent | null> => {
    return await prisma.carRent.findFirst({
      where: {
        driverId,
        endDate: null,
      },
    });
  },

  findActiveByCarId: async (carId: number): Promise<CarRent | null> => {
    return await prisma.carRent.findFirst({
      where: {
        carId,
        endDate: null,
      },
    });
  },
};
