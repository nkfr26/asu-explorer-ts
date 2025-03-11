import { z } from "zod";

const NUMBER_OF_QUESTIONS = 3;

const destinationNumberSchema = z.number().brand();
export type DestinationNumber = z.infer<typeof destinationNumberSchema>;

export const saveDataSchema = z
  .object({
    destinationNumbers: z.array(destinationNumberSchema).readonly(),
    currentIndex: z
      .number()
      .min(0)
      .max(NUMBER_OF_QUESTIONS - 1),
    hasArrivedAtDestination: z.boolean(),
    hasCleared: z.boolean(),
  })
  .readonly();
export type SaveData = z.infer<typeof saveDataSchema>;

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

export const advance = (saveData: SaveData): SaveData => {
  if (saveData.currentIndex === NUMBER_OF_QUESTIONS - 1) {
    return {
      ...saveData,
      hasArrivedAtDestination: false,
      hasCleared: true,
    };
  }
  return {
    ...saveData,
    currentIndex: saveData.currentIndex + 1,
    hasArrivedAtDestination: false,
  };
};
