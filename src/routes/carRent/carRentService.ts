import { CarRent } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

import {
  ResponseStatus,
  ServiceResponse,
} from "@/common/models/serviceResponse";
import { logger } from "@/server";

import { carRentRepository } from "./carRentRepository";
import { CreateCarRentDTO } from "./dto/car-rent-dto";

export const carRentService = {
  findAll: async (): Promise<ServiceResponse<CarRent[] | null>> => {
    try {
      const carRents = await carRentRepository.findAll();
      if (!carRents) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "No car rents found",
          null,
          StatusCodes.NOT_FOUND,
        );
      }
      return new ServiceResponse<CarRent[]>(
        ResponseStatus.Success,
        "Car rents found",
        carRents,
        StatusCodes.OK,
      );
    } catch (ex) {
      const errorMessage = `Error finding all car rents: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  },

  findById: async (id: number): Promise<ServiceResponse<CarRent | null>> => {
    try {
      const carRent = await carRentRepository.findById(id);
      if (!carRent) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Car rent not found",
          null,
          StatusCodes.NOT_FOUND,
        );
      }
      return new ServiceResponse<CarRent>(
        ResponseStatus.Success,
        "Car rent found",
        carRent,
        StatusCodes.OK,
      );
    } catch (ex) {
      const errorMessage = `Error finding car rent with id ${id}: ${(ex as Error).message}`;
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
    carRentDTO: CreateCarRentDTO,
  ): Promise<ServiceResponse<CarRent | null>> => {
    try {
      console.log(carRentDTO.startDate);

      // Check if the car is already in use
      const activeCarRent = await carRentRepository.findActiveByCarId(
        carRentDTO.carId,
      );
      if (activeCarRent) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "The car is already in use",
          null,
          StatusCodes.BAD_REQUEST,
        );
      }

      // Check if the driver is already using a car
      const activeDriverRent = await carRentRepository.findActiveByDriverId(
        carRentDTO.driverId,
      );
      if (activeDriverRent) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "The driver is already using a car",
          null,
          StatusCodes.BAD_REQUEST,
        );
      }

      const carRent = await carRentRepository.create(carRentDTO);

      return new ServiceResponse<CarRent>(
        ResponseStatus.Success,
        "Car rent created",
        carRent,
        StatusCodes.OK,
      );
    } catch (ex) {
      const errorMessage = `Error creating a car rent: ${(ex as Error).message}`;
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
      await carRentRepository.delete(id);
      return new ServiceResponse<null>(
        ResponseStatus.Success,
        "Car rent deleted",
        null,
        StatusCodes.OK,
      );
    } catch (ex) {
      const errorMessage = `Error deleting a car rent: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  },

  finishRent: async (id: number): Promise<ServiceResponse<null>> => {
    try {
      const carRent = await carRentRepository.findById(id);
      if (!carRent) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Car rent not found",
          null,
          StatusCodes.NOT_FOUND,
        );
      }
      carRent.endDate = new Date();
      await carRentRepository.update(carRent);

      return new ServiceResponse<null>(
        ResponseStatus.Success,
        "Car rent finished",
        null,
        StatusCodes.OK,
      );
    } catch (ex) {
      const errorMessage = `Error finishing car rent: ${(ex as Error).message}`;
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
