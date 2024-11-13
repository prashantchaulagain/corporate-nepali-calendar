import {
	adToBsDateConversion,
	bsToAdDateConversion,
	dateDifference,
	daysInAdMonth,
	formatDate,
	getTimeZone,
} from "./_helpers.js";
import { DAYS_BS_MONTHS } from "./constants.js";
import type { AdMonthRange } from "./types.js";

export const getDaysAdMonth = (year: number, month: number): number => {
	if (month < 1 || month > 12) {
		throw new Error("Invalid month: Please provide a month between 1 and 12.");
	}

	const days = daysInAdMonth(year, month);
	if (days === undefined) {
		throw new Error("Unexpected error: Month index out of bounds.");
	}

	return days;
};

export const getDaysBsMonth = (year: number, month: number): number => {
	if (year < 2000 || year > 2099) {
		throw new Error(
			"Invalid year: Please provide a year between 2000 and 2099.",
		);
	}

	if (month < 1 || month > 12) {
		throw new Error("Invalid month: Please provide a month between 1 and 12.");
	}

	const daysInEachMonth: number[] | undefined = DAYS_BS_MONTHS[year];

	// Check if the year is found in DAYS_BS_MONTHS
	if (!daysInEachMonth) {
		throw new Error("Year not found in DAYS_BS_MONTHS.");
	}

	const days = daysInEachMonth[month - 1];
	if (days === undefined) {
		throw new Error("Unexpected error: Month index out of bounds.");
	}

	return days;
};

export const getDaysBsQuarter = (year: number, quarter: number): number => {
	if (year < 2000 || year > 2099) {
		throw new Error(
			"Invalid year: Please provide a year between 2000 and 2099.",
		);
	}

	if (quarter < 1 || quarter > 4) {
		throw new Error(
			"Invalid quarter: Please provide a quarter between 1 and 4.",
		);
	}

	const daysInEachMonth: number[] | undefined = DAYS_BS_MONTHS[year];

	// Check if the year is found in DAYS_BS_MONTHS
	if (!daysInEachMonth) {
		throw new Error("Year not found in DAYS_BS_MONTHS.");
	}

	// Calculate the starting index for the quarter
	const startIndex = (quarter - 1) * 3;

	// Sum the days for the three months in the given quarter
	const quarterDays = daysInEachMonth
		.slice(startIndex, startIndex + 3)
		.reduce((total, days) => total + days, 0);

	return quarterDays;
};

export const getDaysBsHalfYear = (year: number, half: number): number => {
	if (year < 2000 || year > 2099) {
		throw new Error(
			"Invalid year: Please provide a year between 2000 and 2099.",
		);
	}

	if (half !== 1 && half !== 2) {
		throw new Error("Invalid half: Please provide a half of either 1 or 2.");
	}

	const daysInEachMonth: number[] | undefined = DAYS_BS_MONTHS[year];

	// Check if the year is found in DAYS_BS_MONTHS
	if (!daysInEachMonth) {
		throw new Error("Year not found in DAYS_BS_MONTHS.");
	}

	const startIndex = (half - 1) * 6;

	const halfYearDays = daysInEachMonth
		.slice(startIndex, startIndex + 6)
		.reduce((total, days) => total + days, 0);

	return halfYearDays;
};

export const getDaysBsYear = (year: number): number => {
	const daysInEachMonth: number[] | undefined = DAYS_BS_MONTHS[year];

	// Check if the year is found in DAYS_BS_MONTHS
	if (!daysInEachMonth) {
		throw new Error("Year not found in DAYS_BS_MONTHS.");
	}

	const yearDays = daysInEachMonth.reduce((total, days) => total + days, 0);

	return yearDays;
};

export const getBsMonthEndDate = (year: number, month: number): string => {
	const daysInEachMonth: number[] | undefined = DAYS_BS_MONTHS[year];

	if (month < 1 || month > 12) {
		throw new Error("Invalid month: Please provide a month between 1 and 12.");
	}

	// Check if the year is found in DAYS_BS_MONTHS
	if (!daysInEachMonth) {
		throw new Error("Year not found in DAYS_BS_MONTHS.");
	}
	const days = daysInEachMonth[month - 1];

	if (days === undefined) {
		throw new Error("Unexpected error: Month index out of bounds.");
	}

	const endDate = formatDate({ year: year, month: month, day: days });

	return endDate;
};

export const getBsQuarterEndDate = (year: number, quarter: number): string => {
	const daysInEachMonth: number[] | undefined = DAYS_BS_MONTHS[year];

	// Check if the year is found in DAYS_BS_MONTHS
	if (!daysInEachMonth) {
		throw new Error("Year not found in DAYS_BS_MONTHS.");
	}

	if (quarter < 1 || quarter > 4) {
		throw new Error(
			"Invalid quarter: Please provide a quarter between 1 and 4.",
		);
	}

	const days = daysInEachMonth[quarter * 3 - 1];

	if (days === undefined) {
		throw new Error("Unexpected error: Month index out of bounds.");
	}

	const endDate = formatDate({ year: year, month: quarter * 3, day: days });

	return endDate;
};

export const getBsYearEndDate = (year: number): string => {
	const daysInEachMonth: number[] | undefined = DAYS_BS_MONTHS[year];

	// Check if the year is found in DAYS_BS_MONTHS
	if (!daysInEachMonth) {
		throw new Error("Year not found in DAYS_BS_MONTHS.");
	}

	const days = daysInEachMonth[11];

	if (days === undefined) {
		throw new Error("Unexpected error: Month index out of bounds.");
	}

	const endDate = formatDate({ year: year, month: 12, day: days });

	return endDate;
};

export const convertToBs = (date: string | Date): string => {
	// Ensure the input is a valid date and convert to 'YYYY-MM-DD' format
	const dateString = (date instanceof Date ? date.toISOString() : date).split(
		"T",
	)[0];

	if (!dateString) {
		throw new Error("Invalid date: Please provide a valid date.");
	}

	// Split the date part into year, month, and day
	const [adYear, adMonth, adDay] = dateString.split("-").map(Number);

	// Validate if the year, month, and day are valid numbers
	if (!adYear || !adMonth || !adDay) {
		throw new Error("Invalid date: Please provide a valid date.");
	}

	// Call the adToBsDateConversion function to get the BS date
	const { bsYear, bsMonth, bsDay } = adToBsDateConversion(
		adYear,
		adMonth,
		adDay,
	);

	// Return the formatted BS date using the formatDate function
	return formatDate({ year: bsYear, month: bsMonth, day: bsDay });
};

export const convertToAd = (date: string | Date): string => {
	// Ensure the input is a valid date and convert to 'YYYY-MM-DD' format
	const dateString = (date instanceof Date ? date.toISOString() : date)?.split(
		"T",
	)[0];

	// Check if dateString is valid
	if (!dateString) {
		throw new Error("Invalid date: Please provide a valid date.");
	}

	const [bsYear, bsMonth, bsDay] = dateString.split("-").map(Number);

	if (!bsYear || !bsMonth || !bsDay) {
		throw new Error("Invalid date: Please provide a valid date.");
	}

	const { adYear, adMonth, adDay } = bsToAdDateConversion(
		bsYear,
		bsMonth,
		bsDay,
	);

	return formatDate({ year: adYear, month: adMonth, day: adDay });
};

export const getDaysDifferenceBsDates = ({
	startDate,
	EndDate,
	includeEndDate = false,
}: {
	startDate: string;
	EndDate: string;
	includeEndDate?: boolean;
}): number => {
	const start = new Date(convertToAd(startDate));
	const end = new Date(convertToAd(EndDate));
	const daysDifference = dateDifference(start, end);
	let days = daysDifference.days;
	if (includeEndDate) {
		days += 1;
	}
	return days;
};

export const getAdMonthRangeFromBsMonth = (
	year: number,
	month: number,
): AdMonthRange => {
	if (month < 1 || month > 12) {
		throw new Error("Invalid month: Please provide a month between 1 and 12.");
	}

	const endDateBs = getBsMonthEndDate(year, month);
	const endDateAd = convertToAd(endDateBs);
	return {
		monthStartDate: convertToAd(
			formatDate({ year: year, month: month, day: 1 }),
		),
		monthEndDate: endDateAd,
	};
};

export const getTodaysBsDate = (): string => {
	const timeZone = getTimeZone();
	const formatter = new Intl.DateTimeFormat("en-GB", {
		timeZone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

	const parts = formatter.formatToParts(new Date());

	const year = parts.find((part) => part.type === "year")?.value;
	const month = parts.find((part) => part.type === "month")?.value;
	const day = parts.find((part) => part.type === "day")?.value;

	const formattedDate = `${year}-${month}-${day}`;
	const todayBs = convertToBs(formattedDate);
	return todayBs;
};
