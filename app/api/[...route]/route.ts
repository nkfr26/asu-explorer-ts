import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import { handle } from "hono/vercel";
import { coordinatesSchema } from "./domain/coordinates";
import { di } from "./domain/di-container";
import { type SaveData, saveDataSchema } from "./domain/save-data/save-data";

export const runtime = "edge";

const app = new Hono<{ Variables: { saveData: SaveData } }>().basePath("/api");

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}
const COOKIE_KEY = "token";
const JWT_SECRET = process.env.JWT_SECRET;

app.use(async (c, next) => {
  const token = getCookie(c, COOKIE_KEY);
  try {
    if (!token) {
      throw new Error();
    }
    c.set("saveData", saveDataSchema.parse(await verify(token, JWT_SECRET)));
  } catch {
    const initialSaveData = await di.playerUseCase.newGame();
    setCookie(c, COOKIE_KEY, await sign(initialSaveData, JWT_SECRET));
    c.set("saveData", initialSaveData);
  }
  await next();
});

const route = app
  .get("/load", async (c) => {
    const saveData = c.get("saveData");
    const panoramaUrl = await di.playerUseCase.getPanoramaUrl(
      saveData.destinationNumbers[saveData.currentIndex],
    );
    return c.json({ saveData, panoramaUrl });
  })
  .post("/answer", zValidator("json", coordinatesSchema), async (c) => {
    const saveData = c.get("saveData");
    const currentLocation = c.req.valid("json");
    const returnedSaveData = await di.playerUseCase.answer(saveData, currentLocation);
    setCookie(c, COOKIE_KEY, await sign(returnedSaveData, JWT_SECRET));
    return c.json({
      hasArrivedAtDestination: returnedSaveData.hasArrivedAtDestination,
    });
  })
  .post("/next", async (c) => {
    const saveData = c.get("saveData");
    const returnedSaveData = di.playerUseCase.next(saveData);
    setCookie(c, COOKIE_KEY, await sign(returnedSaveData, JWT_SECRET));
    return c.json({
      hasCleared: returnedSaveData.hasCleared,
    });
  })
  .delete("/reset", (c) => {
    deleteCookie(c, COOKIE_KEY);
    return c.body(null, 204);
  });

export type AppType = typeof route;

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);
