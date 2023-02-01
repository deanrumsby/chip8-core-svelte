import { writable } from "@deanrumsby/simple-store-svelte";

export function createStack() {
  type Stack = number[];

  const initialState: Stack = [];

  const store = writable<Stack>(initialState);
  const { subscribe } = store;

  function push(value: number) {
    store.update((prevState) => [...prevState, value]);
  }

  function pop() {
    const length = store.get().length;
    if (length === 0) {
      throw new Error('Invalid attempt to pop the stack - It is empty');
    }
    let value;
    store.update((prevState) => {
      const newState = [...prevState];
      value = newState.pop();
      return newState;
    });
    return value as unknown as number;
  }

  function reset() {
    store.set(initialState);
  }

  return { subscribe, push, pop, reset };
}

export const stack = createStack();