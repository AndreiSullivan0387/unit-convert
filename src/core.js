const LENGTH = {
  metre: { symbol: 'm', factor: 1 },
  kilometer: { symbol: 'km', factor: 1000 },
  centimeter: { symbol: 'cm', factor: 0.01 },
  millimeter: { symbol: 'mm', factor: 0.001 },
  mile: { symbol: 'mi', factor: 1609.344 },
  yard: { symbol: 'yd', factor: 0.9144 },
  foot: { symbol: 'ft', factor: 0.3048 },
  inch: { symbol: 'in', factor: 0.0254 },
};

const MASS = {
  kilogram: { symbol: 'kg', factor: 1 },
  gram: { symbol: 'g', factor: 0.001 },
  milligram: { symbol: 'mg', factor: 0.000001 },
  pound: { symbol: 'lb', factor: 0.45359237 },
  ounce: { symbol: 'oz', factor: 0.028349523125 },
  tonne: { symbol: 't', factor: 1000 },
};

/**
 * Convert a temperature value between Celsius, Fahrenheit and Kelvin.
 * The formulas use exact rational arithmetic where possible, but return a
 * floating point result because temperatures are continuous values and the
 * caller may pass fractional degrees. Kelvin is never negative for physical
 * temperatures; this function does not enforce that constraint because it
 * is a pure conversion utility and negative Kelvin can be useful in some
 * scientific computations.
 *
 * @param {number} value
 * @param {'C'|'F'|'K'} from
 * @param {'C'|'F'|'K'} to
 * @returns {number}
 */
export function convertTemperature(value, from, to) {
  if (from === to) {
    return value;
  }
  if (from === 'C' && to === 'F') {
    return (value * 9) / 5 + 32;
  }
  if (from === 'F' && to === 'C') {
    return ((value - 32) * 5) / 9;
  }
  if (from === 'C' && to === 'K') {
    return value + 273.15;
  }
  if (from === 'K' && to === 'C') {
    return value - 273.15;
  }
  if (from === 'F' && to === 'K') {
    return ((value - 32) * 5) / 9 + 273.15;
  }
  if (from === 'K' && to === 'F') {
    return ((value - 273.15) * 9) / 5 + 32;
  }
  throw new Error(`Unsupported temperature unit: ${from} to ${to}`);
}

/**
 * Convert a value from one unit to another within the same dimension.
 * Units are identified by their full lowercase names as defined in the
 * LENGTH and MASS tables. The function uses factors relative to the base
 * unit (metre or kilogram), multiplying first and then dividing to avoid
 * unnecessary rounding when converting between non-base units.
 *
 * @param {number} value
 * @param {keyof typeof LENGTH | keyof typeof MASS} from
 * @param {keyof typeof LENGTH | keyof typeof MASS} to
 * @returns {number}
 */
export function convert(value, from, to) {
  if (from in LENGTH && to in LENGTH) {
    return (value * LENGTH[from].factor) / LENGTH[to].factor;
  }
  if (from in MASS && to in MASS) {
    return (value * MASS[from].factor) / MASS[to].factor;
  }
  throw new Error(`Cannot convert from '${from}' to '${to}': units are not in the same dimension or are unsupported`);
}

export { LENGTH, MASS };
