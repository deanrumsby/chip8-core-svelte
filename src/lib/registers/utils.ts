export function calculateMaximumRegisterValue(sizeInBytes: number) {
  return (0x100 ** sizeInBytes) - 1;
}