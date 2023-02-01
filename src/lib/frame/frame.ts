import { writable } from "@deanrumsby/simple-store-svelte";

import { 
  convertByteToFrameValues, 
  determineStartingCoordinates,
  convertCoordinatesToOffset 
} from "./utils";

const PIXEL_COUNT = 64 * 32;

export function createFrame() {
  type Frame = (0 | 1)[];

  const initialState: Frame = new Array(PIXEL_COUNT).fill(0);

  const store = writable<Frame>(initialState);
  const { subscribe } = store;

  function draw(sprite: number[], startX: number, startY: number) {
    let hasCollision = false;
    const [trueStartX, trueStartY] = determineStartingCoordinates(startX, startY);
    const frameRowValues = sprite.map((byte) => convertByteToFrameValues(byte));

    store.update((prevState) => {
      const newState: Frame = [...prevState];
      frameRowValues.forEach((row, rowIndex) => {
        row.forEach((pixelValue, pixelIndex) => {
          const [pixelX, pixelY] = [trueStartX + pixelIndex, trueStartY + rowIndex]; 
          const offset = convertCoordinatesToOffset(pixelX, pixelY);
          newState[offset] = (pixelValue ^ prevState[offset]) as (0 | 1);
          if (pixelValue & prevState[offset]) {
            hasCollision = true;
          }
        });
      });
      return newState;
    });
    return hasCollision;
  }

  function reset() {
    store.set(initialState);
  }

  return { subscribe, draw, reset };
}

export const frame = createFrame();