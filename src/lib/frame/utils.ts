const BITMASKS = [
  0b00000001, 0b00000010, 0b00000100, 0b00001000, 0b00010000, 0b00100000, 0b01000000, 0b10000000
];

export function convertByteToFrameValues(byte: number) {
    return BITMASKS.map((mask) => (byte & mask) ? 1 : 0);
}

export function determineStartingCoordinates(x: number, y: number) {
  return [x % 64, y % 32];
}

export function convertCoordinatesToOffset(x: number, y: number) {
  return x + y * 64;
}