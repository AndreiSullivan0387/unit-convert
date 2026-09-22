import test from 'node:test';
import assert from 'node:assert/strict';
import { convert, convertTemperature, LENGTH, MASS } from '../src/index.js';

test('length conversions', () => {
  assert.equal(convert(1, 'kilometer', 'metre'), 1000);
  assert.equal(convert(100, 'centimeter', 'metre'), 1);
  assert.equal(convert(1, 'mile', 'foot'), 5280);
  assert.ok(Math.abs(convert(12, 'inch', 'foot') - 1) < 1e-12);
});

test('mass conversions', () => {
  assert.equal(convert(1, 'kilogram', 'gram'), 1000);
  assert.equal(convert(1, 'pound', 'ounce'), 16);
  assert.equal(convert(1, 'tonne', 'kilogram'), 1000);
  assert.ok(Math.abs(convert(500, 'milligram', 'gram') - 0.5) < 1e-12);
});

test('conversion between same unit returns original value', () => {
  assert.equal(convert(42, 'metre', 'metre'), 42);
  assert.equal(convert(7, 'pound', 'pound'), 7);
});

test('unsupported dimension throws', () => {
  assert.throws(() => convert(1, 'metre', 'kilogram'), /not in the same dimension/);
  assert.throws(() => convert(1, 'gram', 'foot'), /not in the same dimension/);
});

test('unknown unit throws', () => {
  assert.throws(() => convert(1, 'metre', 'lightyear'), /not in the same dimension/);
  assert.throws(() => convert(1, 'stone', 'kilogram'), /not in the same dimension/);
});

test('temperature conversions', () => {
  assert.equal(convertTemperature(0, 'C', 'F'), 32);
  assert.equal(convertTemperature(100, 'C', 'F'), 212);
  assert.equal(convertTemperature(32, 'F', 'C'), 0);
  assert.equal(convertTemperature(0, 'C', 'K'), 273.15);
  assert.equal(convertTemperature(0, 'K', 'C'), -273.15);
  assert.equal(convertTemperature(32, 'F', 'K'), 273.15);
  assert.equal(convertTemperature(273.15, 'K', 'F'), 32);
});

test('temperature same unit returns original value', () => {
  assert.equal(convertTemperature(100, 'C', 'C'), 100);
  assert.equal(convertTemperature(50, 'F', 'F'), 50);
  assert.equal(convertTemperature(300, 'K', 'K'), 300);
});

test('temperature invalid unit throws', () => {
  assert.throws(() => convertTemperature(20, 'C', 'R'), /Unsupported temperature unit/);
  assert.throws(() => convertTemperature(20, 'X', 'C'), /Unsupported temperature unit/);
});

test('float conversions are deterministic and approximate', () => {
  const result = convert(1, 'foot', 'metre');
  assert.ok(Math.abs(result - 0.3048) < 1e-12);
});

test('LENGTH and MASS tables contain expected base units', () => {
  assert.ok('metre' in LENGTH);
  assert.ok('kilogram' in MASS);
});
