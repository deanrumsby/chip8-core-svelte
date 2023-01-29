import { expect, test } from "vitest";
import Register from "./Register";

test('the correct value is set when we overflow a one byte register', () => {
  const register = new Register('V0', 1);
  register.value = 0xa1a;
  expect(register.value).toBe(0x1a);
});

test('the correct value is set when we overflow a two byte register', () => {
  const register = new Register('I', 2);
  register.value = 0x2e3d11;
  expect(register.value).toBe(0x3d11);
});

test('the overflow flag is set when we overflow a one byte register', () => {
  const register = new Register('V2', 1);
  register.value = 0xffff;
  expect(register.hasOverflown).toBeTruthy();
});

test('the overflow flag is not set when we do not overflow a one byte register', () => {
  const register = new Register('V2', 1);
  register.value = 0xa1;
  expect(register.hasOverflown).toBeFalsy();
});

test('the overflow flag is set when we overflow a two byte register', () => {
  const register = new Register('PC', 2);
  register.value = 0xfffff;
  expect(register.hasOverflown).toBeTruthy();
});

test('the overflow flag is not set when we do not overflow a one byte register', () => {
  const register = new Register('I', 2);
  register.value = 0xfff;
  expect(register.hasOverflown).toBeFalsy();
});