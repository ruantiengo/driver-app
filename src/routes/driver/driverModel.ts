import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/validations";

extendZodWithOpenApi(z);

export type Driver = z.infer<typeof DriverSchema>;
const DriverSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const GetDriverSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const CreateDriverSchema = z.object({
  body: z.object({ name: z.string() }),
});

export default DriverSchema;
