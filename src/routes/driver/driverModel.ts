import { commonValidations } from "@/common/utils/validations";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

const DriverSchema = z.object({
    id: z.number(),
    name: z.string(),
});

export const CreateDriverSchema = z.object({
    params: z.object({ id: commonValidations.id }),
});

export default DriverSchema;