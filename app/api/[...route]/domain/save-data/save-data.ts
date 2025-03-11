import { z } from "zod";

const destinationNumberSchema = z.number().brand();
export type DestinationNumber = z.infer<typeof destinationNumberSchema>;

export const saveDataSchema = z
  .object({
    destinationNumbers: z.array(destinationNumberSchema).readonly(),
    currentIndex: z.number(),
    hasArrivedAtDestination: z.boolean(),
    hasCleared: z.boolean(),
  })
  .readonly();
export type SaveData = z.infer<typeof saveDataSchema>;

const NUMBER_OF_QUESTIONS = 3;
export const createInitialSaveData = (numberOfDestinations: number): SaveData => {
  const destinationNumbers = new Set<number>();
  while (destinationNumbers.size < NUMBER_OF_QUESTIONS) {
    destinationNumbers.add(Math.floor(Math.random() * numberOfDestinations));
  }
  return saveDataSchema.parse({
    destinationNumbers: [...destinationNumbers],
    currentIndex: 0,
    hasArrivedAtDestination: false,
    hasCleared: false,
  });
};

export const updateHasArrivedAtDestination = (saveData: SaveData, value: boolean): SaveData => {
  return {
    ...saveData,
    hasArrivedAtDestination: value,
  };
};
