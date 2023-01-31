import { expect, test } from "vitest";

import { registers } from "./registers";

test('can read a register', () => {
  const value = registers.read('PC');
  expect(value).toBe(0x0);
});

test('can set a register', () => {
  registers.set('PC', 0xfa);
  const value = registers.read('PC');
  expect(value).toBe(0xfa);
});

test('can clear the registers', () => {
  registers.set('PC', 0xfa);
  registers.clear();
  const value = registers.read('PC');
  expect(value).toBe(0x0);
});