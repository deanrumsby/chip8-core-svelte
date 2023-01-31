import { test, expect } from "vitest";

import { createMemory } from "./memory";

test('can read memory', () => {
  const memory = createMemory();
  const buffer = memory.read(0x200, 2);
  expect(buffer).toEqual([0x0, 0x0]);
});

test('if we write to memory, we can read it afterwards', () => {
  const memory = createMemory();
  const data = [0x20, 0x4f, 0x01];
  memory.write(0x50, data);
  const buffer = memory.read(0x50, 3);
  expect(buffer).toEqual(data);
});