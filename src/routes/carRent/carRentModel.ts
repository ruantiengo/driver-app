import { z } from "zod";

import { commonValidations } from "@/common/utils/validations";

export type CarRent = z.infer<typeof CarRentSchema>;
export const CarRentSchema = z.object({
  id: z.number(),
  startDate: z.date(),
  endDate: z.date().nullable(),
  carId: z.number(),
  driverId: z.number(),
  reason: z.string(),
});

export const CreateCarRentSchema = z.object({
  body: z.object({
    startDate: z.coerce.date(),
    carId: z.number(),
    driverId: z.number(),
    reason: z.string(),
  }),
});

export const GetCarRentSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
