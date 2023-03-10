import { writable } from "@deanrumsby/simple-store-svelte";

import { calculateMaximumRegisterValue } from "./utils";

interface Register {
  name: string,
  value: number,
  sizeInBytes: number,
  hasOverflown: boolean,
}

export interface Registers{
  [name: string | number]: Register;
}

const initialState: Registers = {
  I: { name: 'I', value: 0x0, sizeInBytes: 2, hasOverflown: false },
  PC: { name: 'PC', value: 0x0, sizeInBytes: 2 , hasOverflown: false },
  SP: { name: 'SP', value: 0x0, sizeInBytes: 1, hasOverflown: false },
  DT: { name: 'DT', value: 0x0, sizeInBytes: 1, hasOverflown: false },
  ST: { name: 'ST', value: 0x0, sizeInBytes: 1, hasOverflown: false },
  0x0: { name: 'V0', value: 0x0, sizeInBytes: 1, hasOverflown: false },
  0x1: { name: 'V1', value: 0x0, sizeInBytes: 1, hasOverflown: false },
  0x2: { name: 'V2', value: 0x0, sizeInBytes: 1, hasOverflown: false },
  0x3: { name: 'V3', value: 0x0, sizeInBytes: 1, hasOverflown: false },
  0x4: { name: 'V4', value: 0x0, sizeInBytes: 1, hasOverflown: false },
  0x5: { name: 'V5', value: 0x0, sizeInBytes: 1, hasOverflown: false },
  0x6: { name: 'V6', value: 0x0, sizeInBytes: 1, hasOverflown: false },
  0x7: { name: 'V7', value: 0x0, sizeInBytes: 1, hasOverflown: false },
  0x8: { name: 'V8', value: 0x0, sizeInBytes: 1, hasOverflown: false },
  0x9: { name: 'V9', value: 0x0, sizeInBytes: 1, hasOverflown: false },
  0xa: { name: 'VA', value: 0x0, sizeInBytes: 1, hasOverflown: false },
  0xb: { name: 'VB', value: 0x0, sizeInBytes: 1, hasOverflown: false },
  0xc: { name: 'VC', value: 0x0, sizeInBytes: 1, hasOverflown: false },
  0xd: { name: 'VD', value: 0x0, sizeInBytes: 1, hasOverflown: false },
  0xe: { name: 'VE', value: 0x0, sizeInBytes: 1, hasOverflown: false },
  0xf: { name: 'VF', value: 0x0, sizeInBytes: 1, hasOverflown: false }, 
}

export function createRegisters() {
  const store = writable<Registers>(initialState);
  const { subscribe } = store;

  function read(name: string | number) {
    const registers = store.get();
    return registers[name].value;
  }

  function set(name: string | number, value: number) {
    store.update((prevState) => {
      const register = prevState[name];
      const maximumValue = calculateMaximumRegisterValue(register.sizeInBytes);
      const newValue = value & maximumValue;
      const newHasOverflown = (newValue !== value);
      const newRegister = { ...register, value: newValue, hasOverflown: newHasOverflown };
      return { ...prevState, [name]: newRegister };
    });
  }

  function increment(name: string, amount: number) {
    store.update((prevState) => {
      const register = prevState[name];
      const maximumValue = calculateMaximumRegisterValue(register.sizeInBytes);
      const newValue = (register.value + amount) & maximumValue;
      const newHasOverflown = (newValue !== register.value + amount);
      const newRegister = { ...register, value: newValue, hasOverflown: newHasOverflown };
      return { ...prevState, [name]: newRegister };
    });
  }

  function decrement(name: string, amount: number) {
    increment(name, -amount);
  }

  function reset() {
    store.set(initialState);
  }

  return { subscribe, read, set, increment, decrement, reset };
}

export const registers = createRegisters();
