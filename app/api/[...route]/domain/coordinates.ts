import { z } from "zod";

export const coordinatesSchema = z
  .object({
    longitude: z.number().min(-180).max(180),
    latitude: z.number().min(-90).max(90),
  })
  .readonly();
export type Coordinates = z.infer<typeof coordinatesSchema>;
