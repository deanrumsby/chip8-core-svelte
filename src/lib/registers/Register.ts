class Register {

  #name: string;
  #sizeInBytes: number;
  #maximumValue: number;

  #value = 0;
  #hasOverflown = false;

  constructor(name: string, sizeInBytes: number) {
    this.#name = name;
    this.#sizeInBytes = sizeInBytes;
    this.#maximumValue = this.#calculateMaximumValue(sizeInBytes);
  }

  get name() {
    return this.#name;
  }

  get sizeInBytes() {
    return this.#sizeInBytes;
  }

  get maximumValue() {
    return this.#maximumValue;
  }

  get value() {
    return this.#value;
  }

  set value(value: number) {
    this.#value = value & this.#maximumValue;
    this.#hasOverflown = value > this.#maximumValue;
  }

  get hasOverflown() {
    return this.#hasOverflown;
  }

  #calculateMaximumValue(sizeInBytes: number) {
    return (0x100 ** sizeInBytes) - 1;
  }
}

export default Register;