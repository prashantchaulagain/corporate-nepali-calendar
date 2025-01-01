import { describe, expect, it } from "vitest";
import { adToBsDateConversion, bsToAdDateConversion, formatDate, isLeapYear } from "../src/_helpers";

describe("isLeapYear", () => {
	it("should return true for leap years", () => {
		expect(isLeapYear(2000)).toBe(true); // Divisible by 400
		expect(isLeapYear(2004)).toBe(true); // Divisible by 4, not by 100
	});

	it("should return false for non-leap years", () => {
		expect(isLeapYear(1900)).toBe(false); // Divisible by 100, not by 400
		expect(isLeapYear(2001)).toBe(false); // Not divisible by 4
	});
});

describe('Date Conversion Tests', () => {
	// Test adToBsDateConversion function
	describe('adToBsDateConversion', () => {
		it('should correctly convert AD to BS', () => {
			const result = adToBsDateConversion(2024, 1, 2);
			expect(result).toEqual({ bsYear: 2080, bsMonth: 9, bsDay: 17 }); // Example result, adjust based on actual logic
		});
	});

	// Test bsToAdDateConversion function
	describe('bsToAdDateConversion', () => {
		it('should correctly convert BS to AD', () => {
			const result = bsToAdDateConversion(2080, 9, 17);
			expect(result).toEqual({ adYear: 2024, adMonth: 1, adDay: 2 }); // Example result, adjust based on actual logic
		});

		it('should throw an error if BS date is out of bounds', () => {
			expect(() => bsToAdDateConversion(2101, 1, 1)).toThrow(
				'BS year exceeds the available range (1992-2100).'
			);
		});
	});
});

describe('formatDate', () => {
	it('should return the correct date in YYYY-MM-DD format', () => {
		const result = formatDate({ year: 2024, month: 1, day: 2, format: 'YYYY-MM-DD' });
		expect(result).toBe('2024-01-02');
	});

	it('should return the correct date in MM/DD/YYYY format', () => {
		const result = formatDate({ year: 2024, month: 1, day: 2, format: 'MM/DD/YYYY' });
		expect(result).toBe('01/02/2024');
	});

	it('should work correctly for double-digit months and days', () => {
		const result = formatDate({ year: 2024, month: 11, day: 22, format: 'YYYY-MM-DD' });
		expect(result).toBe('2024-11-22');
	});

	it('should work for custom formats', () => {
		const result = formatDate({ year: 2024, month: 11, day: 22, format: 'DD-MM-YYYY' });
		expect(result).toBe('22-11-2024');
	});

	it('should use the default format if no format is provided', () => {
		const result = formatDate({ year: 2024, month: 1, day: 2 });
		expect(result).toBe('2024-01-02');
	});
});