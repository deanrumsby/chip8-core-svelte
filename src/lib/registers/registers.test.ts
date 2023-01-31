import { expect, test } from "vitest";

import { createRegisters } from "./registers";

test('can read a register', () => {
  const registers = createRegisters();
  const value = registers.read('PC');
  expect(value).toBe(0x0);
});

test('can set a register', () => {
  const registers = createRegisters();
  registers.set('PC', 0xfa);
  const value = registers.read('PC');
  expect(value).toBe(0xfa);
});

test('can reset the registers', () => {
  const registers = createRegisters();
  registers.set('PC', 0xfa);
  registers.reset();
  const value = registers.read('PC');
  expect(value).toBe(0x0);
});