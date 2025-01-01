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
	AccountingYearType,
	AdDateResult,
	BSDate,
	DateDifference,
	DateResult,
	FormatDateParams,
	PaymentFrequency,
} from "./types.js";

const bsDays = DAYS_BS_MONTHS;
const bsStartYear = BS_START_YEAR;
const bsStartMonth = BS_START_MONTH;
const bsStartDay = BS_START_DATE;
const adStartYear = AD_START_YEAR;
const adStartMonth = AD_START_MONTH;
const adStartDate = AD_START_DATE;

export const isValidBSDate = (bsDate: BSDate): boolean => {
	const bsDateRegex =
		/^(19[0-9]{2}|20[0-9]{2}|21[0-9]{2]|2200)-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

	if (!bsDateRegex.test(bsDate)) {
		return false;
	}

	const { year, month, day } = parseBSDate(bsDate);

	if (!bsDays[year]) {
		return false;
	}

	const maxDays = bsDays[year][month - 1] || 30;

	return day <= maxDays;
};

export const parseBSDate = (
	bsDate: BSDate,
): { year: number; month: number; day: number } => {
	const [year, month, day] = bsDate.split("-").map(Number) as [
		number,
		number,
		number,
	];

	return { year, month, day };
};

export const isLeapYear = (year: number): boolean => {
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const getTimeZone = (): string => {
	const envTZ = process?.env?.TZ; // Check environment variable
	const intlTZ = Intl?.DateTimeFormat().resolvedOptions().timeZone; // Check Intl API

	// Ensure fallback to 'Asia/Kathmandu'
	return envTZ || intlTZ || "Asia/Kathmandu";
};

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
		throw new Error("Please enter BS year from 1992 to 2100.");
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
		throw new Error("BS year exceeds the available range (1992-2100).");
	}

	// Adjust BS date based on total days
	while (totalDays >= (bsDays[bsYear]?.[bsMonth - 1] ?? 0)) {
		totalDays -= bsDays[bsYear]?.[bsMonth - 1] ?? 0;
		bsMonth++;
		if (bsMonth > 12) {
			bsMonth = 1;
			bsYear++;
			if (bsDays[bsYear] === undefined) {
				throw new Error("BS year exceeds the available range (1992-2100).");
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
				throw new Error("BS year exceeds the available range (1992-2100).");
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
	if (bsYear < 1992 || bsYear > 2100) {
		throw new Error("BS year exceeds the available range (1992-2100).");
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

export const validateYear = (year: number): void => {
	if (year < 1992 || year > 2100) {
		throw new Error(
			"Invalid year: Please provide a year between 1992 and 2100.",
		);
	}
};

export const validateMonth = (month: number): void => {
	if (month < 1 || month > 12) {
		throw new Error("Invalid month: Please provide a month between 1 and 12.");
	}
};

export const getDaysArray = (
	year: number,
	accountingYearType: AccountingYearType,
): number[] => {
	let daysInEachMonth: number[];

	if (accountingYearType === "calendar") {
		daysInEachMonth = DAYS_BS_MONTHS[year] || [];
	} else if (accountingYearType === "financial") {
		daysInEachMonth = [
			...(DAYS_BS_MONTHS[year]?.slice(3) || []),
			...(DAYS_BS_MONTHS[year + 1]?.slice(0, 3) || []),
		];
	} else {
		throw new Error(`Invalid accountingYearType: ${accountingYearType}`);
	}

	return daysInEachMonth;
};

export const getDivisionFactor = (paymentFrequency: PaymentFrequency) => {
	return paymentFrequency === "month"
		? 1
		: paymentFrequency === "quarter"
			? 3
			: paymentFrequency === "half-year"
				? 6
				: 12;
};

export const getPeriod = ({
	dateString,
	periodType = "quarter",
	yearType = "calendar",
}: {
	dateString: string;
	periodType: PaymentFrequency;
	yearType: AccountingYearType;
}) => {
	// Parse the date string into year, month, and day
	const [year, month] = dateString.split("-").map(Number) as [number, number];

	if (yearType === "financial") {
		// Adjust for financial year starting in April
		const adjustedYear = month < 4 ? year - 1 : year;
		const adjustedMonth = ((month + 9) % 12) + 1; // Adjust month for financial year

		if (periodType === "quarter") {
			const quarter = Math.ceil(adjustedMonth / 3);
			return { year: adjustedYear, quarter };
		}
		if (periodType === "half-year") {
			const halfYear = Math.ceil(adjustedMonth / 6);
			return { year: adjustedYear, halfYear };
		}
	}

	// Default to calendar year
	if (periodType === "quarter") {
		const quarter = Math.ceil(month / 3);
		return { year, quarter };
	}
	if (periodType === "half-year") {
		const halfYear = Math.ceil(month / 6);
		return { year, halfYear };
	}

	throw new Error('Invalid periodType. Use "quarter" or "half-year".');
};

export const nextPeriod = ({
	dateString,
	periodType = "quarter",
	yearType = "calendar",
}: {
	dateString: string;
	periodType: PaymentFrequency;
	yearType: AccountingYearType;
}) => {
	// Parse the date string into year and month
	const [year, month] = dateString.split("-").map(Number) as [number, number];

	if (yearType === "financial") {
		if (periodType === "quarter") {
			let adjustedYear = month < 4 ? year - 1 : year;
			//2078-03-31 Financial year end -> 2078-09-30
			const adjustedMonth = month < 4 ? month + 9 : month - 3; // Adjust month for financial year

			const nextQuarter = Math.ceil((adjustedMonth + 3) / 3);
			if (nextQuarter > 4) adjustedYear++; // Move to next year if it exceeds Q4
			return { year: adjustedYear, quarter: ((nextQuarter - 1) % 4) + 1 };
		}
		if (periodType === "half-year") {
			return { year: year, halfYear: month === 3 ? 1 : 2 };
		}
	}

	// Default to calendar year
	if (periodType === "quarter") {
		const nextQuarter = Math.ceil((month + 3) / 3);
		const nextYear = nextQuarter > 4 ? year + 1 : year;
		return { year: nextYear, quarter: ((nextQuarter - 1) % 4) + 1 };
	}
	if (periodType === "half-year") {
		const nextHalfYear = Math.ceil((month + 6) / 6);
		const nextYear = nextHalfYear > 2 ? year + 1 : year;
		return { year: nextYear, halfYear: ((nextHalfYear - 1) % 2) + 1 };
	}

	throw new Error('Invalid periodType. Use "quarter" or "half-year".');
};
