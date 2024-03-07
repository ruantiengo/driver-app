import { StatusCodes } from "http-status-codes";

import { ServiceResponse } from "@/common/models/serviceResponse";

import { driverRepository } from "../driverRepository";
import { driverService } from "../driverService";
import { CreateDriverDTO } from "../dto/create-driver-dto";

describe("driverService", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("findAll", () => {
    it("should return all drivers when drivers are found", async () => {
      const mockDrivers = [{ id: 1, name: "John Doe" }];
      vi.spyOn(driverRepository, "findAll").mockResolvedValue(mockDrivers);

      const result = await driverService.findAll();

      expect(result).toBeInstanceOf(ServiceResponse);
      expect(result.statusCode).toBe(StatusCodes.OK);
      expect(result.message).toBe("Drivers found");
      expect(result.responseObject).toEqual(mockDrivers);
      expect(result.statusCode).toBe(StatusCodes.OK);
    });

    it("should return an error response when no drivers are found", async () => {
      vi.spyOn(driverRepository, "findAll").mockRejectedValue(
        new Error("Database error"),
      );

      const result = await driverService.findAll();

      expect(result).toBeInstanceOf(ServiceResponse);
      expect(result.message).toBe("Error finding all drivers: Database error");
      expect(result.responseObject).toBeNull();
      expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe("findById", () => {
    it("should return the driver when a driver is found", async () => {
      const mockDriver = { id: 1, name: "John Doe" };
      vi.spyOn(driverRepository, "findById").mockResolvedValue(mockDriver);

      const result = await driverService.findById(1);

      expect(result).toBeInstanceOf(ServiceResponse);
      expect(result.message).toBe("Driver found");
      expect(result.responseObject).toEqual(mockDriver);
      expect(result.statusCode).toBe(StatusCodes.OK);
    });

    it("should return an error response when no driver is found", async () => {
      vi.spyOn(driverRepository, "findById").mockResolvedValue(null);

      const result = await driverService.findById(1);

      expect(result).toBeInstanceOf(ServiceResponse);
      expect(result.message).toBe("Driver not found");
      expect(result.responseObject).toBeNull();
      expect(result.statusCode).toBe(StatusCodes.NOT_FOUND);
    });

    it("should return an error response when an error occurs", async () => {
      const errorMessage = "Error finding driver with id 1";
      vi.spyOn(driverRepository, "findById").mockRejectedValue(
        new Error(errorMessage),
      );

      const result = await driverService.findById(1);

      expect(result).toBeInstanceOf(ServiceResponse);
      expect(result.message).toContain(errorMessage);
      expect(result.responseObject).toBeNull();
      expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe("create", () => {
    it("should create a new driver", async () => {
      const mockDriverDTO: CreateDriverDTO = { name: "John Doe" };
      const mockDriver = { id: 1, name: "John Doe" };
      vi.spyOn(driverRepository, "create").mockResolvedValue(mockDriver);

      const result = await driverService.create(mockDriverDTO);

      expect(result).toBeInstanceOf(ServiceResponse);
      expect(result.message).toBe("Driver created");
      expect(result.responseObject).toEqual(mockDriver);
      expect(result.statusCode).toBe(StatusCodes.OK);
    });

    it("should return an error response when an error occurs", async () => {
      const mockDriverDTO: CreateDriverDTO = { name: "John Doe" };
      const errorMessage = "Error creating a driver";
      vi.spyOn(driverRepository, "create").mockRejectedValue(
        new Error(errorMessage),
      );

      const result = await driverService.create(mockDriverDTO);

      expect(result).toBeInstanceOf(ServiceResponse);
      expect(result.message).toContain(errorMessage);
      expect(result.responseObject).toBeNull();
      expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe("delete", () => {
    it("should delete the driver", async () => {
      vi.spyOn(driverRepository, "delete").mockResolvedValue();

      const result = await driverService.delete(1);

      expect(result).toBeInstanceOf(ServiceResponse);
      expect(result.message).toContain("Driver deleted");
      expect(result.responseObject).toBeNull();
      expect(result.statusCode).toBe(StatusCodes.OK);
    });

    it("should return an error response when an error occurs", async () => {
      const errorMessage = "Error deleting a driver";
      vi.spyOn(driverRepository, "delete").mockRejectedValue(
        new Error(errorMessage),
      );

      const result = await driverService.delete(1);

      expect(result).toBeInstanceOf(ServiceResponse);
      expect(result.message).toContain(errorMessage);
      expect(result.responseObject).toBeNull();
      expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });
});
