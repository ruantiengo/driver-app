import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Request, Response, Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
  handleServiceResponse,
  validateRequest,
} from "@/common/utils/httpHandlers";

import {
  CarRentSchema,
  CreateCarRentSchema,
  GetCarRentSchema,
} from "./carRentModel";
import { carRentService } from "./carRentService";

export const carRentRegistry = new OpenAPIRegistry();

carRentRegistry.register("carRent", CarRentSchema);

export const carRentRouter: Router = (() => {
  const router = express.Router();

  carRentRegistry.registerPath({
    method: "get",
    path: "/carRents",
    tags: ["CarRent"],
    responses: createApiResponse(z.array(CarRentSchema), "Success"),
  });

  router.get("/", async (req: Request, res: Response) => {
    const serviceResponse = await carRentService.findAll();
    handleServiceResponse(serviceResponse, res);
  });

  carRentRegistry.registerPath({
    method: "get",
    path: "/carRents/{id}",
    tags: ["CarRent"],
    request: { params: GetCarRentSchema.shape.params },
    responses: createApiResponse(CarRentSchema, "Success"),
  });

  router.get(
    "/:id",
    validateRequest(GetCarRentSchema),
    async (req: Request, res: Response) => {
      const id = parseInt(req.params.id as string, 10);
      const serviceResponse = await carRentService.findById(id);
      handleServiceResponse(serviceResponse, res);
    },
  );

  carRentRegistry.registerPath({
    method: "post",
    path: "/carRents",
    tags: ["CarRent"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateCarRentSchema,
          },
        },
      },
    },
    responses: createApiResponse(CarRentSchema, "Success"),
  });

  router.post(
    "/",
    validateRequest(CreateCarRentSchema),
    async (req: Request, res: Response) => {
      const carRent = req.body;
      const serviceResponse = await carRentService.create(carRent);
      handleServiceResponse(serviceResponse, res);
    },
  );

  carRentRegistry.registerPath({
    method: "delete",
    path: "/carRents/{id}",
    tags: ["CarRent"],
    request: { params: GetCarRentSchema.shape.params },
    responses: createApiResponse(CarRentSchema, "Success"),
  });

  router.delete(
    "/:id",
    validateRequest(GetCarRentSchema),
    async (req: Request, res: Response) => {
      const id = parseInt(req.params.id as string, 10);
      const serviceResponse = await carRentService.delete(id);
      handleServiceResponse(serviceResponse, res);
    },
  );

  carRentRegistry.registerPath({
    method: "put",
    path: "/carRents/{id}/finish",
    tags: ["CarRent"],
    request: { params: GetCarRentSchema.shape.params },
    responses: createApiResponse(CarRentSchema, "Success"),
  });

  router.put(
    "/:id/finish",
    validateRequest(GetCarRentSchema),
    async (req: Request, res: Response) => {
      const id = parseInt(req.params.id as string, 10);
      const serviceResponse = await carRentService.finishRent(id);
      handleServiceResponse(serviceResponse, res);
    },
  );

  return router;
})();
