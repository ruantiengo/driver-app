import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";

import { carRegistry } from "@/routes/car/carRouter";
import { carRentRegistry } from "@/routes/carRent/carRentRouter";
import { driverRegistry } from "@/routes/driver/driverRouter";
import { healthCheckRegistry } from "@/routes/healthCheck/healthCheckRouter";

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([
    healthCheckRegistry,
    carRegistry,
    driverRegistry,
    carRentRegistry,
  ]);
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Swagger API",
    },
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: "/swagger.json",
    },
  });
}
