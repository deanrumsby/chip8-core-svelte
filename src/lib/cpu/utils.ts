const BITS_IN_BYTE = 8;
const DECIMAL_BASE = 10;

export function createInstruction(opcode: number) {
  return {
    opcode: opcode.toString(16).toUpperCase(),
    type: opcode & 0b11110000_00000000,
    nnn: opcode & 0b00001111_11111111,
    nn: opcode & 0b00000000_11111111,
    n: opcode & 0b00000000_00001111,
    x: opcode & 0b00001111_00000000,
    y: opcode & 0b00000000_11110000,
  };
}

export function convertToTwoByteWord(firstByte: number, secondByte: number) {
  return ((firstByte << BITS_IN_BYTE) + secondByte);
}

export function createDecimalBuffer(byte: number) {
  const units = byte % DECIMAL_BASE;
  const tens = Math.floor(byte / DECIMAL_BASE) % DECIMAL_BASE;
  const hundreds = Math.floor(byte / DECIMAL_BASE ** 2) % DECIMAL_BASE;
  return [hundreds, tens, units];
}