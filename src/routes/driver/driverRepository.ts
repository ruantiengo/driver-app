import { prisma } from "@/server";

import { Driver } from "./driverModel";
import { CreateDriverDTO } from "./dto/create-driver-dto";

export const driverRepository = {
  findById: async (id: number): Promise<Driver | null> => {
    return await prisma.driver.findUnique({ where: { id } });
  },

  findAll: async (): Promise<Driver[]> => {
    return await prisma.driver.findMany();
  },

  create: async (newDriverDTO: CreateDriverDTO): Promise<Driver> => {
    return await prisma.driver.create({
      data: {
        ...newDriverDTO,
        name: newDriverDTO.name.toLowerCase(),
      },
    });
  },

  update: async (
    id: number,
    updatedDriverDTO: CreateDriverDTO,
  ): Promise<Driver> => {
    return await prisma.driver.update({
      where: { id },
      data: { ...updatedDriverDTO, name: updatedDriverDTO.name.toLowerCase() },
    });
  },

  delete: async (id: number): Promise<void> => {
    await prisma.driver.delete({
      where: { id },
    });
  },
};
