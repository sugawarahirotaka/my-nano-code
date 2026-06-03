import { describe, it, expect } from 'vitest';
import { add, divide, DivideResult } from './calculator';

describe('calculator', () => {
  describe('add', () => {
    it('should return sum of two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
      expect(add(10, 20)).toBe(30);
    });

    it('should handle negative numbers', () => {
      expect(add(-1, 1)).toBe(0);
      expect(add(-5, -10)).toBe(-15);
      expect(add(5, -3)).toBe(2);
    });

    it('should handle decimal numbers with floating-point precision', () => {
      expect(add(0.1, 0.2)).toBeCloseTo(0.3);
      expect(add(1.5, 2.5)).toBe(4);
    });

    it('should handle zero', () => {
      expect(add(0, 0)).toBe(0);
      expect(add(5, 0)).toBe(5);
      expect(add(0, -5)).toBe(-5);
    });

    it('should handle large numbers', () => {
      expect(add(1000000, 2000000)).toBe(3000000);
    });
  });

  describe('divide', () => {
    it('should return quotient for non-zero divisor', () => {
      const result1: DivideResult = divide(6, 3);
      expect(result1.success).toBe(true);
      if (result1.success) {
        expect(result1.value).toBe(2);
      }

      const result2: DivideResult = divide(10, 2);
      expect(result2.success).toBe(true);
      if (result2.success) {
        expect(result2.value).toBe(5);
      }
    });

    it('should handle negative numbers', () => {
      const result1: DivideResult = divide(-9, 3);
      expect(result1.success).toBe(true);
      if (result1.success) {
        expect(result1.value).toBe(-3);
      }

      const result2: DivideResult = divide(-10, -2);
      expect(result2.success).toBe(true);
      if (result2.success) {
        expect(result2.value).toBe(5);
      }

      const result3: DivideResult = divide(10, -2);
      expect(result3.success).toBe(true);
      if (result3.success) {
        expect(result3.value).toBe(-5);
      }
    });

    it('should handle decimal results', () => {
      const result1: DivideResult = divide(5, 2);
      expect(result1.success).toBe(true);
      if (result1.success) {
        expect(result1.value).toBe(2.5);
      }

      const result2: DivideResult = divide(1, 3);
      expect(result2.success).toBe(true);
      if (result2.success) {
        expect(result2.value).toBeCloseTo(0.333, 2);
      }
    });

    it('should handle division by one', () => {
      const result1: DivideResult = divide(42, 1);
      expect(result1.success).toBe(true);
      if (result1.success) {
        expect(result1.value).toBe(42);
      }

      const result2: DivideResult = divide(-42, 1);
      expect(result2.success).toBe(true);
      if (result2.success) {
        expect(result2.value).toBe(-42);
      }
    });

    it('should return error when dividing by zero', () => {
      const result1: DivideResult = divide(1, 0);
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe('Cannot divide by zero');
      }

      const result2: DivideResult = divide(0, 0);
      expect(result2.success).toBe(false);
      if (!result2.success) {
        expect(result2.error).toBe('Cannot divide by zero');
      }

      const result3: DivideResult = divide(-5, 0);
      expect(result3.success).toBe(false);
      if (!result3.success) {
        expect(result3.error).toBe('Cannot divide by zero');
      }
    });

    it('should handle zero as dividend', () => {
      const result1: DivideResult = divide(0, 5);
      expect(result1.success).toBe(true);
      if (result1.success) {
        expect(result1.value).toBe(0);
      }

      const result2: DivideResult = divide(0, -5);
      expect(result2.success).toBe(true);
      if (result2.success) {
        expect(result2.value).toBe(-0);
      }
    });
  });
});
