import { writable } from "@deanrumsby/simple-store-svelte";

import { keyMap } from "./keyMap";

type KeyState = ('keyup' | 'keydown' | null);

const KEY_COUNT = 16;

const initialState: KeyState[] = new Array(KEY_COUNT).fill(null); 

export function createKeyboard() {
  const store = writable<KeyState[]>(initialState);

  function read(key: number) {
    return store.get()[key];
  }

  function getFirstKeyUp() {
    const state = store.get();
    return state.indexOf('keyup');
  }

  function onKeyDown(keyCode: string) {
    const key = keyMap[keyCode];
    if (key !== undefined) {
      store.update((prevState) => {
        const newState = [...prevState];
        newState[key] = 'keydown';
        return newState;
      });
    }
  }

  function onKeyUp(keyCode: string) {
    const key = keyMap[keyCode];
    if (key !== undefined) {
      store.update((prevState) => {
        const newState = [...prevState];
        newState[key] = 'keyup';
        return newState;
      });
    }
  }

  function removeKeyUpState() {
    store.update((prevState) => {
      return prevState.map((state) => (state === 'keyup') ? null : state);
    });
  }

  return { read, getFirstKeyUp, onKeyDown, onKeyUp, removeKeyUpState };
}

export const keyboard = createKeyboard();
