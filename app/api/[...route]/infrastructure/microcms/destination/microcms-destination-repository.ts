import { client } from "@/lib/microcms";
import { type Destination, destinationSchema } from "../../../domain/destination/destination";
import type { DestinationRepository } from "../../../domain/destination/destination-repository";
import type { MicroCMSDestinationDataModel } from "./microcms-destination-data-model";

export const microcmsDestinationRepository: DestinationRepository = {
  findAll: async (): Promise<Destination[]> => {
    const destinations = await client.getList<MicroCMSDestinationDataModel>({
      endpoint: "destinations",
    });
    return destinations.contents.map((content) => destinationSchema.parse(toModel(content)));
  },
};

const toModel = (from: MicroCMSDestinationDataModel): Destination => {
  return {
    id: from.id,
    panoramaUrl: from.panorama.url,
    coordinates: {
      longitude: from.coordinates.longitude,
      latitude: from.coordinates.latitude,
    },
  };
};
