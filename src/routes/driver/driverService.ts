import { Driver } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

import {
  ResponseStatus,
  ServiceResponse,
} from "@/common/models/serviceResponse";
import { logger } from "@/server";

import { driverRepository } from "./driverRepository";
import { CreateDriverDTO } from "./dto/create-driver-dto";
import { UpdateDriverDto } from "./dto/update-driver-dto";

export const driverService = {
  findAll: async (): Promise<ServiceResponse<Driver[] | null>> => {
    try {
      const drivers = await driverRepository.findAll();
      if (!drivers) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "No drivers found",
          null,
          StatusCodes.NOT_FOUND,
        );
      }
      return new ServiceResponse<Driver[]>(
        ResponseStatus.Success,
        "Drivers found",
        drivers,
        StatusCodes.OK,
      );
    } catch (ex) {
      const errorMessage = `Error finding all drivers: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  },

  findById: async (id: number): Promise<ServiceResponse<Driver | null>> => {
    try {
      const driver = await driverRepository.findById(id);
      if (!driver) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Driver not found",
          null,
          StatusCodes.NOT_FOUND,
        );
      }
      return new ServiceResponse<Driver>(
        ResponseStatus.Success,
        "Driver found",
        driver,
        StatusCodes.OK,
      );
    } catch (ex) {
      const errorMessage = `Error finding driver with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  },

  create: async (
    driverDTO: CreateDriverDTO,
  ): Promise<ServiceResponse<Driver | null>> => {
    try {
      const driver = await driverRepository.create(driverDTO);

      return new ServiceResponse<Driver>(
        ResponseStatus.Success,
        "Driver created",
        driver,
        StatusCodes.OK,
      );
    } catch (ex) {
      const errorMessage = `Error creating a driver: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  },

  delete: async (id: number): Promise<ServiceResponse<null>> => {
    try {
      await driverRepository.delete(id);
      return new ServiceResponse<null>(
        ResponseStatus.Success,
        "Driver deleted",
        null,
        StatusCodes.OK,
      );
    } catch (ex) {
      const errorMessage = `Error deleting a driver: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  },

  update: async (
    id: number,
    driverDTO: UpdateDriverDto,
  ): Promise<ServiceResponse<Driver | null>> => {
    try {
      const driver = await driverRepository.update(id, driverDTO);

      if (!driver) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          `Driver with id ${id} not found`,
          null,
          StatusCodes.NOT_FOUND,
        );
      }

      return new ServiceResponse<Driver>(
        ResponseStatus.Success,
        "Driver updated",
        driver,
        StatusCodes.OK,
      );
    } catch (ex) {
      const errorMessage = `Error updating driver: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  },
};
