import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { Mock } from "vitest";

import {
  ResponseStatus,
  ServiceResponse,
} from "@/common/models/serviceResponse";
import { app } from "@/server";

import { Car } from "../carModel";
import { carService } from "../carService";

vi.mock("@/routes/car/carService");

const mockCars: Car[] = [
  { id: 1, brand: "", color: "", plate: "" },
  { id: 2, brand: "", color: "", plate: "" },
];

describe("Car Route", () => {
  describe("Car findAll", () => {
    it("Should return all cars", async () => {
      (carService.findAll as Mock).mockReturnValue(
        new ServiceResponse(
          ResponseStatus.Success,
          "Cars found",
          mockCars,
          StatusCodes.OK,
        ),
      );
      const response = await request(app).get("/cars");
      const responseBody: ServiceResponse<Car[]> = response.body;

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("Cars found");
      expect(responseBody.responseObject.length).toEqual(mockCars.length);
      expect(carService.findAll).toBeCalledTimes(1);
    });
    it("Should return error when service throws", async () => {
      (carService.findAll as Mock).mockResolvedValue(
        new ServiceResponse(
          ResponseStatus.Failed,
          "Error finding all cars",
          null,
          StatusCodes.INTERNAL_SERVER_ERROR,
        ),
      );
      const response = await request(app).get("/cars");
      const responseBody: ServiceResponse<Car[]> = response.body;

      expect(responseBody.statusCode).toEqual(
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain("Error finding all cars");
      expect(responseBody.responseObject).toBeNull();
    });
  });

  describe("Car findById", () => {
    it("Should find a car", async () => {
      mockFindOne();
      const testId = 1;
      const response = await request(app).get(`/cars/${testId}`);
      const responseBody: ServiceResponse<Car> = response.body;

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("Car found");
      expect(carService.findById).toBeCalledTimes(1);
      expect(carService.findById).toBeCalledWith(testId);
      compareCar(mockCars[0], responseBody.responseObject);
    });
    it("Should return error when service throws", async () => {
      const testId = 1;
      (carService.findById as Mock).mockResolvedValue(
        new ServiceResponse(
          ResponseStatus.Failed,
          `Error finding user with id ${testId}`,
          null,
          StatusCodes.INTERNAL_SERVER_ERROR,
        ),
      );
      const response = await request(app).get(`/cars/${testId}`);
      const responseBody: ServiceResponse<Car> = response.body;

      expect(responseBody.statusCode).toEqual(
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain(
        `Error finding user with id ${testId}`,
      );
      expect(responseBody.responseObject).toBeNull();
    });
  });

  describe("POST /cars", () => {
    it("should create a car and return a successful response", async () => {
      const mockCar = {
        brand: "Test Brand",
        color: "Test Color",
        plate: "ABC-1234",
      };
      const mockCreateCarDTO = {
        brand: mockCar.brand,
        color: mockCar.color,
        plate: mockCar.plate,
      };

      // Mock the carService.create method to return a successful ServiceResponse
      (carService.create as Mock).mockResolvedValue(
        new ServiceResponse(
          ResponseStatus.Success,
          "Car created",
          mockCar,
          StatusCodes.OK,
        ),
      );

      const response = await request(app).post("/cars").send(mockCreateCarDTO); // Send request body

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body.success).toBeTruthy();
      expect(response.body.message).toContain("Car created");
      expect(response.body.responseObject).toEqual(mockCar);
      expect(carService.create).toBeCalledTimes(1); // Ensure carService.create is called once
      expect(carService.create).toBeCalledWith(mockCreateCarDTO); // Check arguments passed to carService.create
    });

    it("should handle errors during creation and return an error response", async () => {
      const mockCreateCarDTO = {
        brand: "Test Brand",
        color: "Test Color",
        plate: "ABC-1234",
      };
      (carService.create as Mock).mockResolvedValue(
        new ServiceResponse(
          ResponseStatus.Failed,
          "Error for creating a car:",
          null,
          StatusCodes.INTERNAL_SERVER_ERROR,
        ),
      );
      const response = await request(app).post("/cars").send(mockCreateCarDTO);

      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body.success).toBeFalsy();
      expect(response.body.message).toContain("Error for creating a car:");
      expect(response.body.responseObject).toBeNull();
    });
  });
});

function mockFindOne() {
  (carService.findById as Mock).mockReturnValue(
    new ServiceResponse(
      ResponseStatus.Success,
      "Car found",
      mockCars[0],
      StatusCodes.OK,
    ),
  );
}

function compareCar(mockCar: Car, responseCar: Car) {
  if (!mockCar || !responseCar) {
    throw new Error("Invalid test data: mockCar or responseCar is undefined");
  }

  expect(responseCar.id).toEqual(mockCar.id);
  expect(responseCar.brand).toEqual(mockCar.brand);
  expect(responseCar.color).toEqual(mockCar.color);
  expect(responseCar.plate).toEqual(mockCar.plate);
}
