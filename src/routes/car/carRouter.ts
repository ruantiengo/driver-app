import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';
import { CarSchema, CreateCarSchema, FilterCarSchema, GetCarSchema } from './carModel';

import { carService } from './carService';

export const carRegistry = new OpenAPIRegistry();

carRegistry.register('car', CarSchema);

export const carRouter: Router = (() => {
  const router = express.Router();

  carRegistry.registerPath({
    method: 'get',
    path: '/cars',
    tags: ['Car'],
    request: {
      query: FilterCarSchema.shape.params
    },
    responses: createApiResponse(z.array(CarSchema), 'Success'),
  });
  
  router.get('/', async (req: Request, res: Response) => {
    const query = req.query
    console.log({query});
    
    const serviceResponse = await carService.findAll(query);
    console.log(serviceResponse);
    
    handleServiceResponse(serviceResponse, res);
  });

  carRegistry.registerPath({
    method: 'get',
    path: '/cars/{id}',
    tags: ['Car'],
    request: { params: GetCarSchema.shape.params },
    responses: createApiResponse(CarSchema, 'Success'),
  });

  router.get('/:id', validateRequest(GetCarSchema), async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const serviceResponse = await carService.findById(id);
    handleServiceResponse(serviceResponse, res);
  });

  carRegistry.registerPath({
    method: 'post',
    path: '/cars',
    tags: ['Car'],
    request: { body: {
      content: {
        "application/json": {
          schema: CreateCarSchema,
          example: {
            plate: "ABC-1234",
            color: "Blue",
            brand: "Mercedes"
          }
        }
      }
    }},
    responses: createApiResponse(CarSchema, 'Success'),
  });

  router.post("/",validateRequest(CreateCarSchema), async (req: Request, res: Response) => {
    const car = req.body
    const serviceResponse = await carService.create(car);
    handleServiceResponse(serviceResponse, res);
  });

  carRegistry.registerPath({
    method: 'delete',
    path: '/cars/{id}',
    tags: ['Car'],
    request: { params: GetCarSchema.shape.params },
    responses: createApiResponse(CarSchema, 'Success'),
  });

  router.delete('/:id', validateRequest(GetCarSchema), async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const serviceResponse = await carService.delete(id);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
