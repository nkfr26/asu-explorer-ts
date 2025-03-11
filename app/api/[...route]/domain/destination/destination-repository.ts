import type { Destination } from "./destination";

export type DestinationRepository = {
  findAll(): Promise<Destination[]>;
};
