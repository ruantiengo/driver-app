import { z } from "zod";

export type CreateCarDTO = {
    plate: string,
    color: string,
    brand: string
}