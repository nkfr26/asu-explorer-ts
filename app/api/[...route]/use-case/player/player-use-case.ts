import type { Coordinates } from "../../domain/coordinates";
import { isNearDestination } from "../../domain/destination/destination";
import type { DestinationRepository } from "../../domain/destination/destination-repository";
import {
  type DestinationNumber,
  type SaveData,
  advance,
  createInitialSaveData,
  updateHasArrivedAtDestination,
} from "../../domain/save-data/save-data";

export const playerUseCase = (destinationRepository: DestinationRepository) => ({
  newGame: async (): Promise<SaveData> => {
    const destinations = await destinationRepository.findAll();
    return createInitialSaveData(destinations.length);
  },
  getPanoramaUrl: async (destinationNumber: DestinationNumber): Promise<string> => {
    const destinations = await destinationRepository.findAll();
    return destinations[destinationNumber].panoramaUrl;
  },
  answer: async (saveData: SaveData, currentLocation: Coordinates): Promise<SaveData> => {
    const destinations = await destinationRepository.findAll();
    const destinationNumber = saveData.destinationNumbers[saveData.currentIndex];

    const destination = destinations[destinationNumber];
    if (isNearDestination(destination, currentLocation)) {
      return updateHasArrivedAtDestination(saveData, true);
    }
    return updateHasArrivedAtDestination(saveData, false);
  },
});
