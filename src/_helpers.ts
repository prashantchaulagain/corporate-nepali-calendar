import {
	AD_START_DATE,
	AD_START_MONTH,
	AD_START_YEAR,
	BS_START_DATE,
	BS_START_MONTH,
	BS_START_YEAR,
	DAYS_BS_MONTHS,
} from "./constants.js";
import type {
	AdDateResult,
	DateDifference,
	DateResult,
	FormatDateParams,
} from "./types.js";

const bsDays = DAYS_BS_MONTHS;
const bsStartYear = BS_START_YEAR;
const bsStartMonth = BS_START_MONTH;
const bsStartDay = BS_START_DATE;
const adStartYear = AD_START_YEAR;
const adStartMonth = AD_START_MONTH;
const adStartDate = AD_START_DATE;

export const isLeapYear = (year: number): boolean => {
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const getTimeZone = () =>
	process?.env?.TZ || Intl.DateTimeFormat().resolvedOptions().timeZone;

export const daysInAdMonth = (year: number, month: number): number => {
	const daysInEachMonth: number[] = [
		31,
		isLeapYear(year) ? 29 : 28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31,
	];

	const days = daysInEachMonth[month - 1];
	if (days === undefined) {
		throw new Error("Unexpected error: Month index out of bounds.");
	}
	return days;
};
export const calculateTotalDaysFromBs = (
	bsYear: number,
	bsMonth: number,
	bsDay: number,
): number => {
	if (bsDays[bsYear] === undefined) {
		throw new Error("Please enter BS year from 2000 to 2099.");
	}

	let totalDays = 0;
	for (let year = bsStartYear; year < bsYear; year++) {
		const daysInYear = bsDays[year];

		// If daysInYear is undefined, terminate the loop
		if (!daysInYear) {
			console.warn(`Terminating loop due to missing data for BS year ${year}.`);
			break;
		}

		totalDays += daysInYear.reduce(
			(sum: number, days: number) => sum + days,
			0,
		);
	}

	for (let month = 0; month < bsMonth - 1; month++) {
		totalDays += bsDays[bsYear][month] || 0;
	}

	// Add the days of the current month
	totalDays += bsDay - 1;

	return totalDays;
};

export const calculateTotalDaysFromAd = (
	adYear: number,
	adMonth: number,
	adDay: number,
): number => {
	let totalDays = -90;

	for (let year = adStartYear; year < adYear; year++) {
		totalDays += isLeapYear(year) ? 366 : 365;
	}

	for (let month = 1; month < adMonth; month++) {
		totalDays += daysInAdMonth(adYear, month);
	}

	totalDays += adDay - adStartDate;

	return totalDays;
};

export const adToBsDateConversion = (
	adYear: number,
	adMonth: number,
	adDay: number,
): DateResult => {
	const totalAdDays = calculateTotalDaysFromAd(adYear, adMonth, adDay);
	let totalDays = totalAdDays;

	let bsYear = bsStartYear;
	let bsMonth = bsStartMonth;
	let bsDay = bsStartDay;

	if (adStartYear >= adYear) {
		if (
			adStartMonth > adMonth ||
			(adStartMonth === adMonth && adStartDate > adDay)
		) {
			throw new Error("AD year goes beyond the available range.");
		}
	}

	if (bsDays[bsYear] === undefined) {
		throw new Error("BS year exceeds the available range (2000-2099).");
	}

	// Adjust BS date based on total days
	while (totalDays >= (bsDays[bsYear]?.[bsMonth - 1] ?? 0)) {
		totalDays -= bsDays[bsYear]?.[bsMonth - 1] ?? 0;
		bsMonth++;
		if (bsMonth > 12) {
			bsMonth = 1;
			bsYear++;
			if (bsDays[bsYear] === undefined) {
				throw new Error("BS year exceeds the available range (2000-2099).");
			}
		}
	}

	bsDay += totalDays;

	// Handle overflow for days
	if (bsDay > (bsDays[bsYear]?.[bsMonth - 1] ?? 0)) {
		bsDay -= bsDays[bsYear]?.[bsMonth - 1] ?? 0;
		bsMonth++;
		if (bsMonth > 12) {
			bsMonth = 1;
			bsYear++;
			if (bsDays[bsYear] === undefined) {
				throw new Error("BS year exceeds the available range (2000-2099).");
			}
		}
	}

	return { bsYear, bsMonth, bsDay };
};

export const bsToAdDateConversion = (
	bsYear: number,
	bsMonth: number,
	bsDay: number,
): AdDateResult => {
	// Check if the BS year is within the valid range
	if (bsYear <= 2000 || bsYear >= 2099) {
		throw new Error("BS year exceeds the available range (2000-2099).");
	}
	const totalBsDays = calculateTotalDaysFromBs(bsYear, bsMonth, bsDay);
	let totalDays = totalBsDays;

	let adYear = adStartYear;

	let adMonth = adStartMonth;
	let adDay = adStartDate;

	// Adjust AD date based on total days
	while (totalDays > 0) {
		const daysInMonthV = daysInAdMonth(adYear, adMonth);
		if (totalDays < daysInMonthV) {
			adDay += totalDays;
			if (adDay > daysInMonthV) {
				adMonth += 1;
				adDay -= daysInMonthV;
			}
			if (adMonth > 12) {
				adMonth = 1;
				adYear++;
			}
			totalDays = 0;
		} else {
			totalDays -= daysInMonthV;
			adMonth++;
			if (adMonth > 12) {
				adMonth = 1;
				adYear++;
			}
		}
	}

	return { adYear, adMonth, adDay };
};

export const formatDate = ({
	year,
	month,
	day,
	format = "YYYY-MM-DD",
}: FormatDateParams): string => {
	const paddedMonth = month.toString().padStart(2, "0");
	const paddedDay = day.toString().padStart(2, "0");

	return format
		.replace("YYYY", year.toString())
		.replace("MM", paddedMonth)
		.replace("DD", paddedDay);
};

export const dateDifference = (
	date1: Date,
	date2: Date,
	unit: "days" | "weeks" | "months" = "days",
): DateDifference => {
	const differenceInMs = Math.abs(date1.getTime() - date2.getTime());
	const totalDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

	switch (unit) {
		case "days":
			return { days: totalDays };

		case "weeks": {
			const weeks = Math.floor(totalDays / 7);
			const remainingDays = totalDays % 7;
			return { weeks, days: remainingDays };
		}

		case "months": {
			const months = Math.floor(totalDays / 30.44); // Approximate month length
			const remainingDays = Math.floor(totalDays % 30.44);
			return { months, days: remainingDays };
		}

		default:
			throw new Error("Invalid unit");
	}
};
