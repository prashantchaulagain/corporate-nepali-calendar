import { isLeapYear, daysInMonth } from "../src/utils.js";
import { describe, it, expect } from "vitest";

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

describe("daysInMonth", () => {
	it("should return 29 days for February in a leap year", () => {
		expect(daysInMonth(2000, 2)).toBe(29);
		expect(daysInMonth(2004, 2)).toBe(29);
	});

	it("should throw an error for invalid month values", () => {
		expect(() => daysInMonth(2024, 0)).toThrow(
			"Invalid month: Please provide a month between 1 and 12.",
		);
		expect(() => daysInMonth(2024, 13)).toThrow(
			"Invalid month: Please provide a month between 1 and 12.",
		);
	});

	it("should return 28 days for February in a non-leap year", () => {
		expect(daysInMonth(2001, 2)).toBe(28);
		expect(daysInMonth(1900, 2)).toBe(28);
	});

	it("should return 31 days for January, March, May, July, August, October, and December", () => {
		[1, 3, 5, 7, 8, 10, 12].forEach((month) => {
			expect(daysInMonth(2024, month)).toBe(31);
		});
	});

	it("should return 30 days for April, June, September, and November", () => {
		[4, 6, 9, 11].forEach((month) => {
			expect(daysInMonth(2024, month)).toBe(30);
		});
	});
});
