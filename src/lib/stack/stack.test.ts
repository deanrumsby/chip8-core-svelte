import { expect, test } from 'vitest';

import { createStack } from './stack';

test('can push a value to the stack and pop it off', () => {
  const stack = createStack();
  stack.push(0x2);
  const value = stack.pop();
  expect(value).toBe(0x2);
});

test('the stack acts as a first-in-last-out structure', () => {
  const stack = createStack();
  const pops = [];
  stack.push(0x5);
  stack.push(0xa);
  stack.push(0x2);
  pops.push(stack.pop());
  pops.push(stack.pop());
  pops.push(stack.pop());
  expect(pops).toEqual([0x2, 0xa, 0x5]);
});

test('we can reset the stack', () => {
  const stack = createStack();
  stack.push(0x5);
  stack.reset();
  expect(() => stack.pop()).toThrow();
});