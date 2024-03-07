import { Driver } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { Mock } from "vitest";

import {
  ResponseStatus,
  ServiceResponse,
} from "@/common/models/serviceResponse";
import { app } from "@/server";

import { driverService } from "../driverService";

vi.mock("../driverService");

describe("Driver Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all drivers", async () => {
    const mockDrivers = [{ id: 1, name: "John Doe" }];
    (driverService.findAll as Mock).mockResolvedValue(
      new ServiceResponse<Driver[]>(
        ResponseStatus.Success,
        "Drivers found",
        mockDrivers,
        StatusCodes.OK,
      ),
    );

    const response = await request(app).get("/drivers");
    const responseBody: ServiceResponse<Driver[]> = response.body;

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(responseBody.message).toContain("Drivers found");
    expect(responseBody.responseObject.length).toEqual(mockDrivers.length);
    expect(driverService.findAll).toBeCalledTimes(1);
  });

  it("should return a driver by ID", async () => {
    const mockDriver = { id: 1, name: "John Doe" };
    (driverService.findById as Mock).mockResolvedValue(
      new ServiceResponse<Driver>(
        ResponseStatus.Success,
        "Driver found",
        mockDriver,
        StatusCodes.OK,
      ),
    );

    const response = await request(app).get("/drivers/1");
    const responseBody: ServiceResponse<Driver> = response.body;

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(responseBody.message).toContain("Driver found");
    expect(driverService.findById).toHaveBeenCalledTimes(1);
    expect(driverService.findById).toHaveBeenCalledWith(1);
  });

  it("should create a new driver", async () => {
    const mockDriver = { name: "John Doe" };
    (driverService.create as Mock).mockResolvedValue(
      new ServiceResponse<Driver>(
        ResponseStatus.Success,
        "Driver created",
        { ...mockDriver, id: 1 },
        StatusCodes.OK,
      ),
    );

    const response = await request(app).post("/drivers").send(mockDriver);
    const responseBody: ServiceResponse<Driver[]> = response.body;

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(responseBody.message).toContain("Driver created");
    expect(driverService.create).toBeCalledTimes(1);
  });

  it("should delete a driver by ID", async () => {
    const mockDriver = { id: 1, name: "John Doe" };
    (driverService.delete as Mock).mockResolvedValue(
      new ServiceResponse<Driver>(
        ResponseStatus.Success,
        "Driver deleted",
        { ...mockDriver, id: 1 },
        StatusCodes.OK,
      ),
    );

    const response = await request(app).delete("/drivers/1");
    const responseBody: ServiceResponse<Driver[]> = response.body;

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(responseBody.message).toContain("Driver deleted");
    expect(driverService.delete).toBeCalledTimes(1);
  });
});
