import { z } from "zod";

export const commonValidations = {
  id: z
    .string()
    .refine((data) => !isNaN(Number(data)), "ID must be a numeric value")
    .transform(Number)
    .refine((num) => num > 0, "ID must be a positive number"),
};

export const plateValidation = {
  plate: z.string().refine((data) => {
    const plateRegex = /^[A-Z]{3}-\d{4}$/;
    return plateRegex.test(data);
  }, "Plate is in a wrong format, it should be on format ABC-1234"),
};
