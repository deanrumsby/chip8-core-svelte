import { createInstruction, convertToTwoByteWord, createDecimalBuffer } from "./utils";
import { registers } from "../registers";
import { memory } from "../memory";
import { frame } from '../frame';
import { stack } from '../stack';
import { clock } from '../clock';
import { keyboard } from '../io';
import { determineFontOffset, FONT_MASK } from '../font';

interface Instruction {
  opcode: string,
  type: number,
  nnn: number,
  nn: number,
  n: number,
  x: number,
  y: number,
}

const OPCODE_SIZE_BYTES = 2;
const MAXIMUM_8BIT_VALUE = 0b11111111;
const MAXIMUM_16BIT_VALUE = 0b11111111_11111111;
const LSB_MASK = 0b00000001;
const MSB_MASK = 0b10000000;
const MSB_SHIFT = 7;
const MAXIMUM_ADDRESS_VALUE = 0x0fff;

export function createCpu() {

  const inCosmacMode = true;

  function step() {
		const opcode = fetch();
		const instruction = decode(opcode);
		execute(instruction);
	}

	function fetch() {
		const offset = registers.read('PC');
		const [firstByte, secondByte] = memory.read(offset, OPCODE_SIZE_BYTES);
		const opcode = convertToTwoByteWord(firstByte, secondByte);
		return opcode;
	}

	function decode(opcode: number): Instruction {
		return createInstruction(opcode);
	}

	function execute(instruction: Instruction) {
		const { type, x, y, nnn, nn, n } = instruction;
		let hasJumped = false;

		switch (type) {
			case 0x0:
				switch (nnn) {
					case 0x0e0: {
						frame.reset();
						break;
					}
					case 0x0ee: {
						const returnAddress = stack.pop();
						registers.set('PC', returnAddress);
						hasJumped = true;
						break;
					}
					default:
						break;
				}
				break;

			case 0x1: {
				registers.set('PC', nnn);
				hasJumped = true;
				break;
			}

			case 0x2: {
				const nextAddress = registers.read('PC') + OPCODE_SIZE_BYTES;
				stack.push(nextAddress);
				registers.set('PC', nnn);
				hasJumped = true;
				break;
			}

			case 0x3: {
				const valueVX = registers.read(x);
				if (valueVX === nn) {
					registers.increment('PC', OPCODE_SIZE_BYTES);
				}
				break;
			}

			case 0x4: {
				const valueVX = registers.read(x);
				if (valueVX !== nn) {
					registers.increment('PC', OPCODE_SIZE_BYTES);
				}
				break;
			}

			case 0x5: {
				const valueVX = registers.read(x);
				const valueVY = registers.read(y);
				if (valueVX === valueVY) {
					registers.increment('PC', OPCODE_SIZE_BYTES);
				}
				break;
			}

			case 0x6: {
				registers.set(x, nn);
				break;
			}

			case 0x7: {
				const valueVX = registers.read(x);
				const result = valueVX + nn;
				registers.set(x, result & MAXIMUM_8BIT_VALUE);
				break;
			}

			case 0x8: {
				switch (n) {
					case 0x0: {
						const valueVY = registers.read(y);
						registers.set(x, valueVY);
						break;
					}

					case 0x1: {
						const valueVX = registers.read(x);
						const valueVY = registers.read(y);
						registers.set(x, valueVX | valueVY);
						break;
					}

					case 0x2: {
						const valueVX = registers.read(x);
						const valueVY = registers.read(y);
						registers.set(x, valueVX & valueVY);
						break;
					}

					case 0x3: {
						const valueVX = registers.read(x);
						const valueVY = registers.read(y);
						registers.set(x, valueVX ^ valueVY);
						break;
					}

					case 0x4: {
						const valueVX = registers.read(x);
						const valueVY = registers.read(y);
						const result = valueVX + valueVY;
						registers.set(x, result & MAXIMUM_8BIT_VALUE);
						registers.set('VF', result > MAXIMUM_8BIT_VALUE ? 1 : 0);
						break;
					}

					case 0x5: {
						const valueVX = registers.read(x);
						const valueVY = registers.read(y);
						const result = valueVX - valueVY;
						registers.set(x, result & MAXIMUM_8BIT_VALUE);
						registers.set('VF', result > 0 ? 1 : 0);
						break;
					}

					case 0x6: {
						const currentValue = inCosmacMode ? registers.read(y) : registers.read(x);
						const shiftedBit = currentValue & LSB_MASK;
						registers.set(x, currentValue >>> 1);
						registers.set('VF', shiftedBit);
						break;
					}

					case 0x7: {
						const valueVX = registers.read(x);
						const valueVY = registers.read(y);
						const result = valueVY - valueVX;
						registers.set(x, result & MAXIMUM_8BIT_VALUE);
						registers.set('VF', result > 0 ? 1 : 0);
						break;
					}

					case 0xe: {
						const currentValue = inCosmacMode ? registers.read(y) : registers.read(x);
						const shiftedBit = (currentValue & MSB_MASK) >>> MSB_SHIFT;
						registers.set(x, (currentValue << 1) & MAXIMUM_8BIT_VALUE);
						registers.set('VF', shiftedBit);
						break;
					}

					default:
						throwInvalidInstructionError(instruction);
						break;
				}
				break;
			}

			case 0x9: {
				const valueVX = registers.read(x);
				const valueVY = registers.read(y);
				if (valueVX !== valueVY) {
					registers.increment('PC', OPCODE_SIZE_BYTES);
				}
				break;
			}

			case 0xa: {
				registers.set('I', nnn);
				break;
			}

			case 0xb: {
				const valueV0 = registers.read('V0');
				const valueVX = registers.read(x);
				registers.set('PC', inCosmacMode ? nnn + valueV0 : nnn + valueVX);
				hasJumped = true;
				break;
			}

			case 0xc: {
				const rand = Math.floor(Math.random() * MAXIMUM_8BIT_VALUE);
				registers.set(x, nn & rand);
				break;
			}

			case 0xd: {
				const spriteAddress = registers.read('I');
				const spriteBuffer = memory.read(spriteAddress, n);
				const startX = registers.read(x);
				const startY = registers.read(y);
				const hasCollision = frame.draw(spriteBuffer, startX, startY);
				registers.set('VF', hasCollision ? 0x1 : 0x0);
				break;
			}

			case 0xe: {
				switch (nn) {
					case 0x9e: {
						const valueVX = registers.read(x);
						if (keyboard.read(valueVX) === 'keydown') {
							registers.increment('PC', OPCODE_SIZE_BYTES);
						}
						break;
					}

					case 0xa1: {
						const valueVX = registers.read(x);
						if (keyboard.read(valueVX) !== 'keydown') {
							registers.increment('PC', OPCODE_SIZE_BYTES);
						}
						break;
					}

					default:
						throwInvalidInstructionError(instruction);
				}
				break;
			}

			case 0xf: {
				switch (nn) {
					case 0x07: {
						const valueDT = registers.read('DT');
						registers.set(x, valueDT);
						break;
					}

					case 0x15: {
						const valueVX = registers.read(x);
						registers.set('DT', valueVX);
						break;
					}

					case 0x18: {
						const valueVX = registers.read(x);
						registers.set('ST', valueVX);
						break;
					}

					case 0x1e: {
						const valueI = registers.read('I');
						const valueX = registers.read(x);
						const result = valueI + valueX;
						registers.set('I', result & MAXIMUM_16BIT_VALUE);
						registers.set('VF', inCosmacMode || result <= MAXIMUM_ADDRESS_VALUE ? 0 : 1);
						break;
					}

					case 0x0a: {
						const keyUp = keyboard.getFirstKeyUp();
						if (keyUp >= 0) {
							registers.set(x, keyUp);
							break;
						}
						registers.decrement('PC', OPCODE_SIZE_BYTES);
						break;
					}

					case 0x29: {
						const valueX = registers.read(x);
						const fontCharOffset = determineFontOffset(valueX & FONT_MASK);
						registers.set('I', fontCharOffset);
						break;
					}

					case 0x33: {
						const valueVX = registers.read(x);
						const offset = registers.read('I');
						const buffer = createDecimalBuffer(valueVX);
						memory.write(offset, buffer);
						break;
					}

					case 0x55: {
						const offset = registers.read('I');
						const buffer = [];
						for (let i = 0; i <= x; i += 1) {
							const value = registers.read(i);
							buffer.push(value);
						}
						memory.write(offset, buffer);
						break;
					}

					case 0x65: {
						const offset = registers.read('I');
						const buffer = memory.read(offset, x + 1);
						buffer.forEach((byte, i) => registers.set(i, byte));
						break;
					}

					default: {
						throwInvalidInstructionError(instruction);
					}
				}
				break;
			}
		}

		if (!hasJumped) {
			registers.increment('PC', OPCODE_SIZE_BYTES);
		}

		keyboard.removeKeyUpState();
	}

	function throwInvalidInstructionError(instruction: Instruction) {
		throw new Error(`Invalid instruction provided: ${instruction.opcode}`);
	}

  return { step };
}

export const cpu = createCpu();