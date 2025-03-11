import { microcmsDestinationRepository } from "../infrastructure/microcms/destination/microcms-destination-repository";
import { playerUseCase } from "../use-case/player/player-use-case";

const destinationRepository = microcmsDestinationRepository;

export const di = {
  destinationRepository: destinationRepository,
  playerUseCase: playerUseCase(destinationRepository),
};
