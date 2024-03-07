import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations, plateValidation } from "@/common/utils/validations";

extendZodWithOpenApi(z);

export type Car = z.infer<typeof CarSchema>;
export const CarSchema = z.object({
  id: z.number(),
  plate: z.string(),
  color: z.string(),
  brand: z.string(),
});

export const CreateCarSchema = z.object({
  body: z.object({
    plate: plateValidation.plate,
    color: z.string(),
    brand: z.string(),
  }),
});

export const UpdateCarSchema = z.object({
  body: z.object({
    plate: plateValidation.plate,
    color: z.string(),
    brand: z.string(),
  }),
});

export const FilterCarSchema = z.object({
  params: z.object({
    color: z.string().nullable(),
    brand: z.string().nullable(),
  }),
});

export const GetCarSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
