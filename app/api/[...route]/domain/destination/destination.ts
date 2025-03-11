import { distance } from "@turf/distance";
import { point } from "@turf/helpers";
import { z } from "zod";
import { coordinatesSchema, type Coordinates } from "../coordinates";

export const destinationSchema = z
  .object({
    id: z.string(),
    panoramaUrl: z.string().url(),
    coordinates: coordinatesSchema,
  })
  .readonly();
export type Destination = z.infer<typeof destinationSchema>;

const NEAR_DESTINATION = 15;
export const isNearDestination = (destination: Destination, currentLocation: Coordinates) => {
  const [from, to] = [
    point([currentLocation.longitude, currentLocation.latitude]),
    point([destination.coordinates.longitude, destination.coordinates.latitude]),
  ];
  return distance(from, to, { units: "meters" }) < NEAR_DESTINATION;
};
