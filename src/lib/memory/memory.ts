import { writable } from "@deanrumsby/simple-store-svelte";

type Memory = number[];

const MEMORY_SIZE_BYTES = 4096;

const initialState: Memory = new Array(MEMORY_SIZE_BYTES).fill(0x0);

export function createMemory() {
  const store = writable<Memory>(initialState);
  const { subscribe } = store;

  function read(offset: number, byteCount: number) {
    const memory = store.get();
    const buffer = memory.slice(offset, offset + byteCount);
    return buffer;
  }

  function write(offset: number, buffer: number[]) {
    store.update((prevState) => {
			const newState = [...prevState];
			buffer.forEach((byte, index) => {
				newState[offset + index] = byte;
			});
			return newState;
		});
  }

  function reset() {
    store.set(initialState);
  }

  return { subscribe, read, write, reset }
}

export const memory = createMemory();
