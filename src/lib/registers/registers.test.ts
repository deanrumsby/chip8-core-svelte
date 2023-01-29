import { expect, test } from "vitest";

import { registers, type Registers } from "./registers";

test('can read a register', () => {
  let $registers: Registers = {};
  registers.subscribe((state) => $registers = state);
  expect($registers['PC'].value).toBe(0x0);
});

test('can set a register', () => {
  let $registers: Registers = {};
  registers.subscribe((state) => $registers = state);
  registers.set('PC', 0xfa);
  expect($registers['PC'].value).toBe(0xfa);
});

test('can clear the registers', () => {
  let $registers: Registers = {};
  registers.subscribe((state) => $registers = state);
  registers.set('PC', 0xfa);
  registers.clear();
  expect($registers['PC'].value).toBe(0x0);
});