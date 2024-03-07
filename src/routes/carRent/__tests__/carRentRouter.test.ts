import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { Mock } from "vitest";

import {
  ResponseStatus,
  ServiceResponse,
} from "@/common/models/serviceResponse";
import { app } from "@/server";

import { carRentService } from "../carRentService";

vi.mock("../carRentService");

describe("Car Rent Routes", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("GET / - should return all car rents", async () => {
    const mockCarRents = [
      { id: 1, carId: 1, driverId: 1, startDate: new Date(), endDate: null },
    ];
    (carRentService.findAll as Mock).mockResolvedValue(
      new ServiceResponse(
        ResponseStatus.Success,
        "Car rents found",
        mockCarRents,
        StatusCodes.OK,
      ),
    );

    const res = await request(app).get("/carRents");
    const responseBody = res.body;

    expect(res.statusCode).toEqual(StatusCodes.OK);

    expect(responseBody.message).toContain("Car rents found");
    expect(responseBody.responseObject.length).toEqual(mockCarRents.length);
    expect(carRentService.findAll).toBeCalledTimes(1);
  });

  it("GET /:id - should return a car rent by id", async () => {
    const id = 1;
    const mockCarRent = {
      id,
      carId: 1,
      driverId: 1,
      startDate: new Date(),
      endDate: null,
    };
    (carRentService.findById as Mock).mockResolvedValue({
      statusCode: StatusCodes.OK,
      success: true,
      message: "Car rent found",
      responseObject: mockCarRent,
    });

    const res = await request(app).get(`/carRents/${id}`);
    const responseBody = res.body;
    expect(responseBody.statusCode).toEqual(StatusCodes.OK);
    expect(responseBody.responseObject.id).toBe(mockCarRent.id);
    expect(responseBody.responseObject.carId).toBe(mockCarRent.carId);
    expect(responseBody.responseObject.driverId).toBe(mockCarRent.driverId);
  });

  it("POST / - should create a car rent", async () => {
    const carRent = {
      carId: 1,
      driverId: 1,
      startDate: "2023-09-07T07:19:51.128Z",
      reason: "Test reason",
    };
    (carRentService.create as Mock).mockResolvedValue({
      statusCode: StatusCodes.OK,
      success: true,
      message: "Car rent created",
      responseObject: carRent,
    });

    const res = await request(app).post("/carRents").send(carRent);
    const responseObject = res.body;
    expect(responseObject.statusCode).toEqual(StatusCodes.OK);
  });

  it("DELETE /:id - should delete a car rent by id", async () => {
    const id = 1;
    (carRentService.delete as Mock).mockResolvedValue({
      statusCode: StatusCodes.OK,
      success: true,
      message: "Car rent deleted",
      responseObject: null,
    });

    const res = await request(app).delete(`/carRents/${id}`);
    const body = res.body;
    expect(body.statusCode).toEqual(StatusCodes.OK);
    expect(body.responseObject).toBeNull();
  });

  it("PUT /:id/finish - should finish a car  expect(responseObject.body).toEqual(carRent);rent by id", async () => {
    const id = 1;
    (carRentService.finishRent as Mock).mockResolvedValue({
      statusCode: StatusCodes.OK,
      success: true,
      message: "Car rent finished",
      responseObject: null,
    });

    const res = await request(app).put(`/carRents/${id}/finish`);
    const body = res.body;
    expect(body.statusCode).toEqual(StatusCodes.OK);
    expect(body.responseObject).toBeNull();
  });
});
