/// <reference types="vitest" />

import { afterEach, describe, expect, it, Mock, test, vi } from "vitest";
import * as helpers from "../src/_helpers.js";
import { convertToAd, convertToBs, getAdMonthRangeFromBsMonth, getDaysAdMonth, getDaysBsHalfYear, getDaysBsQuarter, getDaysBsYear, getBsMonthEndDate, getBsQuarterEndDate, getBsYearEndDate, getTodaysBsDate } from "../src/utils.js";


describe("getDaysAdMonth", () => {
	it("should return 29 days for February in a leap year", () => {
		expect(getDaysAdMonth(2000, 2)).toBe(29);
		expect(getDaysAdMonth(2004, 2)).toBe(29);
	});

	it("should throw an error for invalid month values", () => {
		expect(() => getDaysAdMonth(2024, 0)).toThrow(
			"Invalid month: Please provide a month between 1 and 12.",
		);
		expect(() => getDaysAdMonth(2024, 13)).toThrow(
			"Invalid month: Please provide a month between 1 and 12.",
		);
	});

	it("should return 28 days for February in a non-leap year", () => {
		expect(getDaysAdMonth(2001, 2)).toBe(28);
		expect(getDaysAdMonth(1900, 2)).toBe(28);
	});

	it("should return 31 days for January, March, May, July, August, October, and December", () => {
		[1, 3, 5, 7, 8, 10, 12].forEach((month) => {
			expect(getDaysAdMonth(2024, month)).toBe(31);
		});
	});

	it("should return 30 days for April, June, September, and November", () => {
		[4, 6, 9, 11].forEach((month) => {
			expect(getDaysAdMonth(2024, month)).toBe(30);
		});
	});
});

describe('getDaysBsQuarter', () => {
    it('should correctly return the total days for the first quarter of a valid year (2080)', () => {
        const days = getDaysBsQuarter(2080, 1);
        expect(days).toBe(31 + 32 + 31);
    });

    it('should correctly return the total days for the second quarter of a valid year (2080)', () => {
        const days = getDaysBsQuarter(2080, 2);
        expect(days).toBe(32 + 31 + 30);
    });

    it('should correctly return the total days for the fourth quarter of a valid year (2081)', () => {
        const days = getDaysBsQuarter(2081, 4);
        expect(days).toBe(30 + 29 + 31);
    });

    it('should throw an error for an invalid year out of range', () => {
        expect(() => getDaysBsQuarter(1999, 1)).toThrow(
            "Invalid year: Please provide a year between 2000 and 2099."
        );
    });

    it('should throw an error for an invalid quarter', () => {
        expect(() => getDaysBsQuarter(2080, 5)).toThrow(
            "Invalid quarter: Please provide a quarter between 1 and 4."
        );
    });

    it('should throw an error when the year is not found in DAYS_BS_MONTHS', () => {
        expect(() => getDaysBsQuarter(2101, 1)).toThrow(
            "Invalid year: Please provide a year between 2000 and 2099."
        );
    });
});

describe('getDaysBsHalfYear', () => {
	it('should correctly return the total days for the first half of a valid year', () => {
		const days = getDaysBsHalfYear(2080, 1);
		expect(days).toBe(187); // 31 + 32 + 31 + 32 + 31 + 30 = 187
	});

	it('should correctly return the total days for the second half of a valid year', () => {
		const days = getDaysBsHalfYear(2080, 2);
		expect(days).toBe(178); // 30 + 29 + 30 + 29 + 30 + 29 = 178
	});

	it('should throw an error for an invalid year out of range', () => {
		expect(() => getDaysBsHalfYear(1999, 1)).toThrow(
			"Invalid year: Please provide a year between 2000 and 2099."
		);
	});

	it('should throw an error for a half value other than 1 or 2', () => {
		expect(() => getDaysBsHalfYear(2080, 3)).toThrow(
			"Invalid half: Please provide a half of either 1 or 2."
		);
	});

	it('should throw an error when the year is not found in DAYS_BS_MONTHS', () => {
		expect(() => getDaysBsHalfYear(2101, 1)).toThrow(
			"Invalid year: Please provide a year between 2000 and 2099."
		);
	});
});

describe('getDaysBsYear', () => {
	it('should correctly return the total days for a valid year (2080)', () => {
		const days = getDaysBsYear(2080);
		expect(days).toBe(365); // 31+32+31+32+31+30+30+29+30+29+30+29 = 365
	});

	it('should correctly return the total days for a valid year (2081)', () => {
		const days = getDaysBsYear(2081);
		expect(days).toBe(366); // 31+32+31+32+31+31+30+29+30+29+30+30 = 366 (leap year)
	});

	it('should throw an error when the year is not found in DAYS_BS_MONTHS', () => {
		expect(() => getDaysBsYear(2101)).toThrow("Year not found in DAYS_BS_MONTHS.");
	});
});

describe('Date Conversion Tests', () => {
	// Test convertToBs function
	describe('convertToBs', () => {
        const testCases = [
            { adDate: '2024-11-04T14:12:38.258Z', expectedBsDate: '2081-07-19' },
            { adDate: '2024-11-04', expectedBsDate: '2081-07-19' },
            { adDate: '2004-12-08', expectedBsDate: '2061-08-23' },
            { adDate: '2012-09-02', expectedBsDate: '2069-05-17' },
            { adDate: '1987-02-06', expectedBsDate: '2043-10-23' },
            { adDate: '1943-04-20', expectedBsDate: '2000-01-07' },
            { adDate: '2031-10-16', expectedBsDate: '2088-06-29' },
            { adDate: '2003-09-18', expectedBsDate: '2060-06-01' },
            { adDate: '2024-11-19', expectedBsDate: '2081-08-04' },
          ];
        
          test.each(testCases)(
            'should correctly convert a valid AD date string $adDate to BS date $expectedBsDate',
            ({ adDate, expectedBsDate }) => {
              const bsDate = convertToBs(adDate);
              expect(bsDate).toBe(expectedBsDate);
            }
          );

		it('should correctly convert a valid Date object to BS date', () => {
			const bsDate = convertToBs(new Date('2024-11-04T14:12:38.258Z'));
			expect(bsDate).toBe('2081-07-19'); // Adjust based on actual BS date
		});

		it('should throw an error for an invalid date string', () => {
			expect(() => convertToBs('Invalid date')).toThrow(
				'Invalid date: Please provide a valid date.'
			);
		});

        it('should throw an error for an invalid date string', () => {
			expect(() => convertToBs('1943-01-01')).toThrow(
				'AD year goes beyond the available range.'
			);
		});


		it('should throw an error for an undefined date string', () => {
			expect(() => convertToBs('')).toThrow('Invalid date: Please provide a valid date.');
		});
	});

	// Test convertToAd function
	describe('convertToAd', () => {
		it('should correctly convert a valid BS date string to AD date', () => {
			const adDate = convertToAd('2081-07-19');
			expect(adDate).toBe('2024-11-04');
		});

        it('should correctly convert a valid BS date string to AD date', () => {
			const adDate = convertToAd('2011-09-06');
			expect(adDate).toBe('1954-12-21');
		});

        it('should correctly convert a valid BS date string to AD date', () => {
			const adDate = convertToAd('2018-11-23');
			expect(adDate).toBe('1962-03-06');
		});

        it('should correctly convert a valid BS date string to AD date', () => {
			const adDate = convertToAd('2027-07-07');
			expect(adDate).toBe('1970-10-23');
		});

		it('should throw an error for an invalid BS date string', () => {
			expect(() => convertToAd('Invalid date')).toThrow(
				'Invalid date: Please provide a valid date.'
			);
		});

		it('should throw an error for an undefined BS date string', () => {
			expect(() => convertToAd('')).toThrow('Invalid date: Please provide a valid date.');
		});
	});
});

describe('Nepali Calendar End Date Functions', () => {
    // Test for getBsMonthEndDate
    describe('getBsMonthEndDate', () => {
        it('should return the correct end date for a valid month', () => {
            const endDate = getBsMonthEndDate(2080, 2);
            expect(endDate).toBe('2080-02-32'); // Expected end date for month 2 in 2080
        });

        it('should throw an error for an invalid month', () => {
            expect(() => getBsMonthEndDate(2080, 13)).toThrow(
                "Invalid month: Please provide a month between 1 and 12."
            );
        });

        it('should throw an error when the year is not found in DAYS_BS_MONTHS', () => {
            expect(() => getBsMonthEndDate(2101, 1)).toThrow(
                "Year not found in DAYS_BS_MONTHS."
            );
        });
    });

    // Test for getBsQuarterEndDate
    describe('getBsQuarterEndDate', () => {
        it('should return the correct end date for the first quarter', () => {
            const endDate = getBsQuarterEndDate(2080, 1);
            expect(endDate).toBe('2080-03-31'); // Expected end date for the first quarter in 2080
        });

        it('should return the correct end date for the second quarter', () => {
            const endDate = getBsQuarterEndDate(2081, 2);
            expect(endDate).toBe('2081-06-30'); // Expected end date for the second quarter in 2081
        });

        it('should throw an error for an invalid quarter', () => {
            expect(() => getBsQuarterEndDate(2080, 5)).toThrow(
                "Invalid quarter: Please provide a quarter between 1 and 4."
            );
        });

        it('should throw an error when the year is not found in DAYS_BS_MONTHS', () => {
            expect(() => getBsQuarterEndDate(2101, 1)).toThrow(
                "Year not found in DAYS_BS_MONTHS."
            );
        });
    });

    // Test for getBsYearEndDate
    describe('getBsYearEndDate', () => {
        it('should return the correct end date for a valid year', () => {
            const endDate = getBsYearEndDate(2080);
            expect(endDate).toBe('2080-12-30'); // Expected end date for 2080
        });

        it('should throw an error when the year is not found in DAYS_BS_MONTHS', () => {
            expect(() => getBsYearEndDate(2101)).toThrow(
                "Year not found in DAYS_BS_MONTHS."
            );
        });
    });
});

describe('getTodaysBsDate', () => {
    it('should return the correct formatted BS date', () => {
		vi.spyOn(helpers, 'getTimeZone').mockImplementation(() => 'Asia/Kathmandu');

        const datePartsMock: any = [
            { type: 'year', value: '2024' },
            { type: 'month', value: '11' },
            { type: 'day', value: '07' },
        ];
        vi.spyOn(Intl.DateTimeFormat.prototype, 'formatToParts').mockReturnValue(datePartsMock);

        // Mock convertToBs to return a sample BS date for the mocked AD date
        (vi.fn() as Mock).mockReturnValue('2081-07-22');

        // Call getTodaysBsDate
        const result = getTodaysBsDate();

        // Assert that the result is the expected BS date
        expect(result).toBe('2081-07-22');

        // Clear the mocks after each test
        vi.restoreAllMocks();
    });
});