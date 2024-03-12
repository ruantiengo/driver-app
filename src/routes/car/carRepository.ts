import { prisma } from "@/server";

import { Car } from "./carModel";
import { CreateCarDTO } from "./dto/createCarDto";
import { UpdateCarDTO } from "./dto/updateCarDto";

export const carRepository = {
  findAll: async (query: {
    color?: string;
    brand?: string;
  }): Promise<Car[]> => {
    return await prisma.car.findMany({
      where: {
        brand: query.brand?.toLowerCase(),
        color: query.color?.toLowerCase(),
      },
    });
  },

  findById: async (id: number): Promise<Car | null> => {
    return await prisma.car.findUnique({ where: { id } });
  },

  findByPlate: async (plate: string): Promise<Car | null> => {
    return await prisma.car.findUnique({
      where: {
        plate,
      },
    });
  },

  create: async (newCarDTO: CreateCarDTO): Promise<Car> => {
    return await prisma.car.create({
      data: {
        ...newCarDTO,
        color: newCarDTO.color.toLowerCase(),
        brand: newCarDTO.brand.toLocaleLowerCase(),
      },
    });
  },

  update: async (
    id: number,
    updatedCarDTO: UpdateCarDTO,
  ): Promise<Car | null> => {
    return await prisma.car.update({
      where: { id },
      data: {
        ...updatedCarDTO,
        color: updatedCarDTO.color?.toLowerCase(),
        brand: updatedCarDTO.brand?.toLowerCase(),
      },
    });
  },
  delete: async (id: number): Promise<Car> => {
    return await prisma.car.delete({
      where: { id },
    });
  },
};
