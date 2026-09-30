# Unit Convert

Unit Convert is a zero-dependency JavaScript library for converting values between common units of length, mass, and temperature.

## Usage

```js
import { convert, convertTemperature } from 'unit-convert';

convert(1, 'kilometer', 'metre'); // 1000
convert(2, 'pound', 'ounce');     // 32
convertTemperature(100, 'C', 'F'); // 212
```

Length units: metre, kilometer, centimeter, millimeter, mile, yard, foot, inch.
Mass units: kilogram, gram, milligram, pound, ounce, tonne.
Temperature units: C (Celsius), F (Fahrenheit), K (Kelvin).

The package exports `convert`, `convertTemperature`, `LENGTH`, and `MASS`. The `LENGTH` and `MASS` exports are plain objects mapping unit names to `{ symbol, factor }`.

## Why this library exists

Unit conversion is a small problem that repeatedly appears in applications dealing with measurements. Most existing libraries pull in a large dependency tree or support hundreds of units that a typical project never needs. This library deliberately implements only a small, fixed set of units. The trade-off is that unsupported units cause an immediate error rather than a silent approximation. The conversion factors are stored relative to a base unit (metre and kilogram), which keeps the internal logic uniform and makes adding a new unit a one-line change.

## Edge cases

Conversions between different dimensions throw an error, so `convert(1, 'metre', 'kilogram')` fails loudly. Temperature conversions accept any numeric value, including negative Kelvin, because the library is a pure converter and does not model physical validity. Floating-point results are exact only when the factors allow it; for example, converting feet to metres returns a number very close to 0.3048 but should not be compared with `==`.

## Design notes

The window stores values eagerly rather than keeping running aggregates. Running
sums drift with floating point over long streams, and recomputing from a small
buffer is cheap enough that the drift is not worth the speed.

## Performance

The window keeps a bounded buffer, so `push` is constant time and memory does not
grow with the length of the stream. `peak` and `trough` are linear in the window
size, which is the trade that keeps `push` cheap.

