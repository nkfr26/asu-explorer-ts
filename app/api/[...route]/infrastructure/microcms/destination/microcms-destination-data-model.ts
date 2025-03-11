import type { MicroCMSImage, MicroCMSListContent } from "microcms-js-sdk";

export type MicroCMSDestinationDataModel = {
  panorama: MicroCMSImage;
  coordinates: {
    longitude: number;
    latitude: number;
  };
} & MicroCMSListContent;
