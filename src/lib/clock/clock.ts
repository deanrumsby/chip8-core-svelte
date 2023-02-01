import { sleep } from "./utils";

const INSTRUCTIONS_PER_SECOND = 700;
const timePerInstruction = 1000 / INSTRUCTIONS_PER_SECOND;

export function createClock() {

  let count = 0;
  let startTime: number | null = null;

  function tick() {
    if (!startTime) {
      startTime = Date.now();
    }

    const currentTime = Date.now();
		count += 1;

		const expectedTime = startTime + Math.floor(count * timePerInstruction);
		const dt = expectedTime - currentTime;
		if (dt >= 5) {
			sleep(dt);
		}

    if (count === INSTRUCTIONS_PER_SECOND) {
      count = 0;
      startTime = Date.now();
    }
	}

  function reset() {
    count = 0;
    startTime = null;
  }

  return { tick, reset };
}

export const clock = createClock();
