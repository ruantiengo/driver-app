import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Request, Response, Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
  handleServiceResponse,
  validateRequest,
} from "@/common/utils/httpHandlers";

import DriverSchema, {
  CreateDriverSchema,
  GetDriverSchema,
} from "./driverModel";
import { driverService } from "./driverService";

export const driverRegistry = new OpenAPIRegistry();

driverRegistry.register("driver", DriverSchema);

export const driverRouter: Router = (() => {
  const router = express.Router();

  driverRegistry.registerPath({
    method: "get",
    path: "/drivers",
    tags: ["Driver"],
    responses: createApiResponse(z.array(DriverSchema), "Success"),
  });

  router.get("/", async (req: Request, res: Response) => {
    const serviceResponse = await driverService.findAll();

    handleServiceResponse(serviceResponse, res);
  });

  driverRegistry.registerPath({
    method: "get",
    path: "/drivers/{id}",
    tags: ["Driver"],
    request: { params: GetDriverSchema.shape.params },
    responses: createApiResponse(DriverSchema, "Success"),
  });

  router.get(
    "/:id",
    validateRequest(GetDriverSchema),
    async (req: Request, res: Response) => {
      const id = parseInt(req.params.id as string, 10);
      const serviceResponse = await driverService.findById(id);
      handleServiceResponse(serviceResponse, res);
    },
  );

  driverRegistry.registerPath({
    method: "post",
    path: "/drivers",
    tags: ["Driver"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateDriverSchema,
            example: {
              name: "John Doe",
            },
          },
        },
      },
    },
    responses: createApiResponse(DriverSchema, "Success"),
  });

  router.post(
    "/",
    validateRequest(CreateDriverSchema),
    async (req: Request, res: Response) => {
      const driver = req.body;

      const serviceResponse = await driverService.create(driver);
      handleServiceResponse(serviceResponse, res);
    },
  );

  driverRegistry.registerPath({
    method: "delete",
    path: "/drivers/{id}",
    tags: ["Driver"],
    request: { params: GetDriverSchema.shape.params },
    responses: createApiResponse(DriverSchema, "Success"),
  });

  router.delete(
    "/:id",
    validateRequest(GetDriverSchema),
    async (req: Request, res: Response) => {
      const id = parseInt(req.params.id as string, 10);
      const serviceResponse = await driverService.delete(id);
      handleServiceResponse(serviceResponse, res);
    },
  );

  driverRegistry.registerPath({
    method: "post",
    path: "/drivers",
    tags: ["Driver"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateDriverSchema,
            example: {
              name: "John Doe",
            },
          },
        },
      },
    },
    responses: createApiResponse(DriverSchema, "Success"),
  });

  router.put(
    "/:id",
    validateRequest(CreateDriverSchema),
    async (req: Request, res: Response) => {
      const driver = req.body;
      const id = Number(req.params.id);
      const serviceResponse = await driverService.update(id, driver);
      handleServiceResponse(serviceResponse, res);
    },
  );
  return router;
})();
