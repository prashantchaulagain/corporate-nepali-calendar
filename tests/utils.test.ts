/// <reference types="vitest" />

import { afterEach, describe, expect, it, Mock, test, vi } from "vitest";
import * as helpers from "../src/_helpers.js";
import { convertToAd, convertToBs, getAdMonthRangeFromBsMonth, getDaysAdMonth, getDaysBsHalfYear, getDaysBsQuarter, getDaysBsYear, getBsMonthEndDate, getBsQuarterEndDate, getBsYearEndDate, getTodaysBsDate, getPeriodEndDatesAd, getPeriodEndDatesBs, getDaysDifferenceBsDates } from "../src/utils.js";


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

    it('should correctly return the total days for the fourth quarter of a valid financial year (2081) (FY2081-2082)', () => {
        const days = getDaysBsQuarter(2081, 4, "financial");
        expect(days).toBe(31 + 31 + 32);
    });

    it('should throw an error for an invalid year out of range', () => {
        expect(() => getDaysBsQuarter(1991, 1)).toThrow(
            "Invalid year: Please provide a year between 1992 and 2100."
        );
    });

    it('should throw an error for an invalid quarter', () => {
        expect(() => getDaysBsQuarter(2080, 5)).toThrow(
            "Invalid quarter: Please provide a quarter between 1 and 4."
        );
    });

    it('should throw an error when the year is not found in DAYS_BS_MONTHS', () => {
        expect(() => getDaysBsQuarter(2101, 1)).toThrow(
            "Invalid year: Please provide a year between 1992 and 2100."
        );
    });
});

describe('getDaysBsHalfYear', () => {
    it('should correctly return the total days for the first half of a valid year', () => {
        const days = getDaysBsHalfYear(2080, 1);
        expect(days).toBe(187); // 31 + 32 + 31 + 32 + 31 + 30 = 187
    });

    it('should correctly return the total days for the first half of a valid financial year 2080 (FY2080-2081)', () => {
        const days = getDaysBsHalfYear(2080, 1, "financial");
        expect(days).toBe(182); // [32, 31, 30, 30, 30, 29]
    });

    it('should correctly return the total days for the second half of a valid financial year 2080 (FY2080-2081)', () => {
        const days = getDaysBsHalfYear(2080, 2, "financial");
        expect(days).toBe(183); // [32, 31, 30, 30, 30, 29]
    });

    it('should correctly return the total days for the second half of a valid year', () => {
        const days = getDaysBsHalfYear(2080, 2);
        expect(days).toBe(178); // 30 + 29 + 30 + 29 + 30 + 29 = 178
    });

    it('should throw an error for an invalid year out of range', () => {
        expect(() => getDaysBsHalfYear(1991, 1)).toThrow(
            "Invalid year: Please provide a year between 1992 and 2100."
        );
    });

    it('should throw an error for a half value other than 1 or 2', () => {
        expect(() => getDaysBsHalfYear(2080, 3)).toThrow(
            "Invalid half: Please provide a half of either 1 or 2."
        );
    });

    it('should throw an error when the year is not found in DAYS_BS_MONTHS', () => {
        expect(() => getDaysBsHalfYear(2101, 1)).toThrow(
            "Invalid year: Please provide a year between 1992 and 2100."
        );
    });
});

describe('getDaysBsYear', () => {
    it('should correctly return the total days for a valid year (2080)', () => {
        const days = getDaysBsYear(2080);
        expect(days).toBe(365); // 31+32+31+32+31+30+30+29+30+29+30+29 = 365
    });

    it('should correctly return the total days for a valid financial year (2081) i.e. FY2081-2082', () => {
        const days = getDaysBsYear(2081, "financial");
        expect(days).toBe(366);
    });

    it('should correctly return the total days for a valid year (2081)', () => {
        const days = getDaysBsYear(2081);
        expect(days).toBe(366); // 31+32+31+32+31+31+30+29+30+29+30+30 = 366 (leap year)
    });

    it('should throw an error when the year is not found in DAYS_BS_MONTHS', () => {
        expect(() => getDaysBsYear(2101)).toThrow("Invalid year: Please provide a year between 1992 and 2100.");
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
            expect(() => convertToBs('1933-01-01')).toThrow(
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
                "Invalid year: Please provide a year between 1992 and 2100."
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
                "Invalid year: Please provide a year between 1992 and 2100."
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
                "Invalid year: Please provide a year between 1992 and 2100."
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


describe('getPeriodEndDatesBs', () => {
    it('should return correct end dates for quarter periods in financial year', () => {
        const result = getPeriodEndDatesBs({
            startDate: '2079-02-05',
            endDate: '2081-02-04',
            periodType: 'quarter',
            yearType: 'financial',
        });
        const expected = [
            '2079-02-05', '2079-03-32', '2079-06-31', '2079-09-30',
            '2079-12-30', '2080-03-31', '2080-06-30', '2080-09-29',
            '2080-12-30', '2081-02-04',
        ];
        expect(result).toEqual(expected);
    });

    it('should return correct end dates for quarter periods in calendar year', () => {
        const result = getPeriodEndDatesBs({
            startDate: '2079-02-05',
            endDate: '2081-02-04',
            periodType: 'quarter',
            yearType: 'calendar',
        });
        const expected = [
            '2079-02-05', '2079-03-32', '2079-06-31', '2079-09-30',
            '2079-12-30', '2080-03-31', '2080-06-30', '2080-09-29',
            '2080-12-30', '2081-02-04',
        ];
        expect(result).toEqual(expected);
    });

    it('should return correct end dates for half-year periods in calendar year', () => {
        const result = getPeriodEndDatesBs({
            startDate: '2077-12-23',
            endDate: '2087-12-22',
            periodType: 'half-year',
            yearType: 'calendar',
        });
        const expected = [
            '2077-12-23', '2077-12-31', '2078-06-31', '2078-12-30', '2079-06-31',
            '2079-12-30', '2080-06-30', '2080-12-30', '2081-06-30', '2081-12-31',
            '2082-06-30', '2082-12-30', '2083-06-30', '2083-12-30', '2084-06-30',
            '2084-12-30', '2085-06-31', '2085-12-30', '2086-06-30', '2086-12-30',
            '2087-06-31', '2087-12-22',
        ];
        expect(result).toEqual(expected);
    });

    it('should return correct end dates for half-year periods in financial year', () => {
        const result = getPeriodEndDatesBs({
            startDate: '2077-12-23',
            endDate: '2087-12-22',
            periodType: 'half-year',
            yearType: 'financial',
        });
        const expected = [
            "2077-12-23", "2078-03-31", "2078-09-30", "2079-03-32", "2079-09-30", "2080-03-31", "2080-09-29",
            "2081-03-31", "2081-09-29", "2082-03-32", "2082-09-29", "2083-03-32", "2083-09-29", "2084-03-32",
            "2084-09-29", "2085-03-31", "2085-09-29", "2086-03-31", "2086-09-29", "2087-03-32", "2087-09-30",
            "2087-12-22"
        ];
        expect(result).toEqual(expected);
    });
});

describe('getPeriodEndDatesAd', () => {
    it('should return correct AD dates for quarter periods in financial year', () => {
        const result = getPeriodEndDatesAd({
            startDate: '2079-02-05',
            endDate: '2081-02-04',
            periodType: 'quarter',
            yearType: 'financial',
        });
        const expected = [
            '2022-05-19', '2022-07-16', '2022-10-17', '2023-01-14',
            '2023-04-13', '2023-07-16', '2023-10-17', '2024-01-14',
            '2024-04-12', '2024-05-17',
        ];
        expect(result).toEqual(expected);
    });

    it('should return correct AD dates for quarter periods in calendar year', () => {
        const result = getPeriodEndDatesAd({
            startDate: '2079-02-05',
            endDate: '2081-02-04',
            periodType: 'quarter',
            yearType: 'calendar',
        });
        const expected = [
            '2022-05-19', '2022-07-16', '2022-10-17', '2023-01-14',
            '2023-04-13', '2023-07-16', '2023-10-17', '2024-01-14',
            '2024-04-12', '2024-05-17',
        ];
        expect(result).toEqual(expected);
    });

    it('should return correct AD dates for half-year periods in calendar year', () => {
        const result = getPeriodEndDatesAd({
            startDate: '2077-12-23',
            endDate: '2087-12-22',
            periodType: 'half-year',
            yearType: 'calendar',
        });
        const expected = [
            '2021-04-05', '2021-04-13', '2021-10-17', '2022-04-13', '2022-10-17',
            '2023-04-13', '2023-10-17', '2024-04-12', '2024-10-16', '2025-04-13',
            '2025-10-16', '2026-04-13', '2026-10-16', '2027-04-13', '2027-10-16',
            '2028-04-12', '2028-10-16', '2029-04-13', '2029-10-16', '2030-04-13',
            '2030-10-17', '2031-04-07',
        ];
        expect(result).toEqual(expected);
    });

    it('should return correct AD dates for half-year periods in financial year', () => {
        const result = getPeriodEndDatesAd({
            startDate: '2077-12-23',
            endDate: '2087-12-22',
            periodType: 'half-year',
            yearType: 'financial',
        });
        const expected = [
            "2021-04-05", "2021-07-15", "2022-01-14", "2022-07-16", "2023-01-14", "2023-07-16", "2024-01-14",
            "2024-07-15", "2025-01-13", "2025-07-16", "2026-01-13", "2026-07-16", "2027-01-13", "2027-07-16",
            "2028-01-13", "2028-07-15", "2029-01-13", "2029-07-15", "2030-01-13", "2030-07-16", "2031-01-15",
            "2031-04-07"
        ];
        expect(result).toEqual(expected);
    });
});

describe('getDaysDifferenceBsDates', () => {
    it('should return correct day difference including the end date', () => {
      const result = getDaysDifferenceBsDates({
        startDate: '2078-03-31',
        endDate: '2077-12-23',
        includeEndDate: true,
      });
      const expected = 102;
      expect(result).toBe(expected);
    });

    it('should return correct day difference including the end date', () => {
        const result = getDaysDifferenceBsDates({
            startDate: '2079-06-31',
            endDate: '2079-03-32',
            includeEndDate: true
        });
        const expected = 94;
        expect(result).toBe(expected);
      });
  
    it('should return correct day difference excluding the end date', () => {
      const result = getDaysDifferenceBsDates({
        startDate: '2078-03-31',
        endDate: '2077-12-23',
        includeEndDate: false,
      });
      const expected = 101;
      expect(result).toBe(expected);
    });
  });