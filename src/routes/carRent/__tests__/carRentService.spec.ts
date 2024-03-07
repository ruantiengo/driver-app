import { StatusCodes } from "http-status-codes";
import { Mock } from "vitest";

import { CarRent } from "../carRentModel";
import { carRentRepository } from "../carRentRepository";
import { carRentService } from "../carRentService";
import { CreateCarRentDTO } from "../dto/car-rent-dto";

vi.mock("@/routes/carRent/carRentRepository");
vi.mock("@/server", () => ({
  ...vi.importActual("@/server"),
  logger: {
    error: vi.fn(),
  },
}));

describe("carRentService", () => {
  const mockCarRents: CarRent[] = [
    {
      id: 1,
      carId: 1,
      driverId: 1,
      startDate: new Date(),
      endDate: null,
      reason: "",
    },
    {
      id: 2,
      carId: 2,
      driverId: 2,
      startDate: new Date(),
      endDate: null,
      reason: "",
    },
  ];

  describe("findAll", () => {
    it("return all car rents", async () => {
      (carRentRepository.findAll as Mock).mockReturnValue(mockCarRents);
      const result = await carRentService.findAll();
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain("Car rents found");
      expect(result.responseObject).toEqual(mockCarRents);
    });

    it("returns a not found error for no car rents found", async () => {
      (carRentRepository.findAll as Mock).mockReturnValue(null);
      const result = await carRentService.findAll();

      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain("No car rents found");
      expect(result.responseObject).toBeNull();
    });

    it("handles errors for findAll", async () => {
      (carRentRepository.findAll as Mock).mockRejectedValue(
        new Error("Database error"),
      );
      const result = await carRentService.findAll();

      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain("Error finding all car rents");
      expect(result.responseObject).toBeNull();
    });
  });

  describe("findById", () => {
    it("returns a car rent for a valid ID", async () => {
      const testId = 1;
      const mockCarRent = mockCarRents.find((rent) => rent.id === testId);
      (carRentRepository.findById as Mock).mockReturnValue(mockCarRent);

      const result = await carRentService.findById(testId);

      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain("Car rent found");
      expect(result.responseObject).toEqual(mockCarRent);
    });

    it("handles errors for findById", async () => {
      const testId = 1;
      (carRentRepository.findById as Mock).mockRejectedValue(
        new Error("Database error"),
      );

      const result = await carRentService.findById(testId);

      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain(
        `Error finding car rent with id ${testId}`,
      );
      expect(result.responseObject).toBeNull();
    });
  });

  describe("findById", () => {
    it("returns a car rent for a valid ID", async () => {
      const testId = 1;
      const mockCarRent = mockCarRents.find((rent) => rent.id === testId);
      (carRentRepository.findById as Mock).mockReturnValue(mockCarRent);

      const result = await carRentService.findById(testId);

      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain("Car rent found");
      expect(result.responseObject).toEqual(mockCarRent);
    });

    it("handles errors for findById", async () => {
      const testId = 1;
      (carRentRepository.findById as Mock).mockRejectedValue(
        new Error("Database error"),
      );

      const result = await carRentService.findById(testId);

      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain(
        `Error finding car rent with id ${testId}`,
      );
      expect(result.responseObject).toBeNull();
    });
  });

  describe("create", () => {
    it("should create a car rent and return a successful response", async () => {
      const mockCarRentDTO: CreateCarRentDTO = {
        carId: 1,
        driverId: 1,
        startDate: new Date(),
        reason: "test",
      };
      const mockCarRent = { id: 1, ...mockCarRentDTO, endDate: null };
      (carRentRepository.findActiveByCarId as Mock).mockResolvedValue(null);
      (carRentRepository.findActiveByDriverId as Mock).mockResolvedValue(null);
      (carRentRepository.create as Mock).mockResolvedValue(mockCarRent);

      const result = await carRentService.create(mockCarRentDTO);

      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain("Car rent created");
      expect(result.responseObject).toEqual(mockCarRent);
    });

    it("should return error when a car is already rented", async () => {
      const mockCarRentDTO: CreateCarRentDTO = {
        carId: 1,
        driverId: 1,
        startDate: new Date(),
        reason: "test",
      };
      const mockCarRent = { id: 1, ...mockCarRentDTO, endDate: null };
      (carRentRepository.findActiveByCarId as Mock).mockResolvedValue(
        mockCarRent,
      );

      const result = await carRentService.create(mockCarRentDTO);

      expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain("The car is already in use");
      expect(result.responseObject).toBeNull();
    });

    it("should return error when a driver has an active rent", async () => {
      const mockCarRentDTO: CreateCarRentDTO = {
        carId: 1,
        driverId: 1,
        startDate: new Date(),
        reason: "test",
      };
      const mockCarRent = { id: 1, ...mockCarRentDTO, endDate: null };
      (carRentRepository.findActiveByDriverId as Mock).mockResolvedValue(
        mockCarRent,
      );

      const result = await carRentService.create(mockCarRentDTO);

      expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(result.success).toBeFalsy();
      expect(result.responseObject).toBeNull();
    });

    it("should handle errors during creation and return an error response", async () => {
      const mockError = new Error("Database error");
      const mockCarRentDTO: CreateCarRentDTO = {
        carId: 1,
        driverId: 1,
        startDate: new Date(),
        reason: "test",
      };
      (carRentRepository.findActiveByCarId as Mock).mockResolvedValue(null);
      (carRentRepository.findActiveByDriverId as Mock).mockResolvedValue(null);
      (carRentRepository.create as Mock).mockRejectedValue(mockError);

      const result = await carRentService.create(mockCarRentDTO);

      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain("Error creating a car rent");
      expect(result.responseObject).toBeNull();
    });
  });
  describe("delete", () => {
    it("deletes a car rent for a valid ID", async () => {
      const testId = 1;
      (carRentRepository.delete as Mock).mockReturnValue(null);

      const result = await carRentService.delete(testId);

      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain("Car rent deleted");
      expect(result.responseObject).toBeNull();
    });

    it("handles errors for delete", async () => {
      const testId = 1;
      (carRentRepository.delete as Mock).mockRejectedValue(
        new Error("Database error"),
      );

      const result = await carRentService.delete(testId);

      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain(`Error deleting`);
      expect(result.responseObject).toBeNull();
    });
  });
  describe("delete", () => {
    it("deletes a car rent for a valid ID", async () => {
      const testId = 1;
      (carRentRepository.delete as Mock).mockReturnValue(null);

      const result = await carRentService.delete(testId);

      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain("Car rent deleted");
      expect(result.responseObject).toBeNull();
    });

    it("handles errors for delete", async () => {
      const testId = 1;
      (carRentRepository.delete as Mock).mockRejectedValue(
        new Error("Database error"),
      );

      const result = await carRentService.delete(testId);

      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.responseObject).toBeNull();
    });
  });
  // Add similar tests for findById, delete, create, and finishRent here
});
