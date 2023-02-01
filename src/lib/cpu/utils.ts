export function createInstruction(opcode: number) {
  return {
    opcode: opcode.toString(16).toUpperCase(),
    type: opcode & 0b11110000_00000000,
    nnn: opcode & 0b00001111_11111111,
    nn: opcode & 0b00000000_11111111,
    n: opcode & 0b00000000_00001111,
    x: opcode & 0b00001111_00000000,
    y: opcode & 0b00000000_11110000,
  }
}