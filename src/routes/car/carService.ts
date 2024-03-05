import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';
import { Car } from './carModel';
import { carRepository } from './carRepository';
import { CreateCarDTO } from './dto/createCarDto';

export const carService = {

  findAll: async (query: {color?: string,brand?: string } ): Promise<ServiceResponse<Car[] | null>> => {
  
    try {
      const cars = await carRepository.findAll(query);
      if (!cars) {
        return new ServiceResponse(ResponseStatus.Failed, 'No Cars found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Car[]>(ResponseStatus.Success, 'Cars found', cars, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all cars: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  findById: async (id: number): Promise<ServiceResponse<Car | null>> => {
    try {
      const car = await carRepository.findById(id);
      if (!car) {
        return new ServiceResponse(ResponseStatus.Failed, 'Car not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Car>(ResponseStatus.Success, 'Car found', car, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding car with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  create: async(carDTO: CreateCarDTO): Promise<ServiceResponse<Car | null>> => {
    try {
      const existentCar = await carRepository.findByPlate(carDTO.plate)
      if(existentCar) return new ServiceResponse(ResponseStatus.Failed,'Car with this plate already exists', null, StatusCodes.BAD_REQUEST)
      const car = await carRepository.create(carDTO)
      
      return new ServiceResponse<Car>(ResponseStatus.Success, 'Car created', car, StatusCodes.OK);
    } catch (ex) {
      console.log((ex as Error).name);
      
      const errorMessage = `Error for creating a car:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  delete: async(id: number): Promise<ServiceResponse<null>> => {
    try {
      await carRepository.delete(id)
      return new ServiceResponse<null>(ResponseStatus.Success, 'Car deleted',null,StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error for deleting a car:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
};
