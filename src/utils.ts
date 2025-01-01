import {
	adToBsDateConversion,
	bsToAdDateConversion,
	dateDifference,
	daysInAdMonth,
	formatDate,
	getDaysArray,
	getDivisionFactor,
	getPeriod,
	getTimeZone,
	isValidBSDate,
	nextPeriod,
	parseBSDate,
	validateMonth,
	validateYear,
} from "./_helpers.js";
import type {
	AccountingYearType,
	AdMonthRange,
	BSDate,
	GlobalConfig,
	PaymentFrequency,
} from "./types.js";

// Default configuration
export const globalConfig: GlobalConfig = {
	accountingYearType: "calendar",
	calendarSystem: "bs",
};

export const setGlobalConfig = (config: Partial<GlobalConfig>) => {
	if (config.accountingYearType) {
		if (!["financial", "calendar"].includes(config.accountingYearType)) {
			throw new Error(
				"Invalid accountingYearType. Use 'financial' or 'calendar'.",
			);
		}
		globalConfig.accountingYearType = config.accountingYearType;
	}

	if (config.calendarSystem) {
		if (!["AD", "BS"].includes(config.calendarSystem)) {
			throw new Error("Invalid calendarSystem. Use 'AD' or 'BS'.");
		}
		globalConfig.calendarSystem = config.calendarSystem;
	}
};

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

export const getDaysBsMonth = (
	year: number,
	month: number,
	accountingYearType?: AccountingYearType,
): number => {
	validateYear(year);
	validateMonth(month);
	const accountingYear = accountingYearType || globalConfig.accountingYearType;

	const daysInEachMonth: number[] = getDaysArray(year, accountingYear);
	const days = daysInEachMonth[month - 1] || 30;

	return days;
};

export const getDaysBsQuarter = (
	year: number,
	quarter: number,
	accountingYearType?: AccountingYearType,
): number => {
	validateYear(year);
	const accountingYear = accountingYearType || globalConfig.accountingYearType;

	if (quarter < 1 || quarter > 4) {
		throw new Error(
			"Invalid quarter: Please provide a quarter between 1 and 4.",
		);
	}

	const daysInEachMonth: number[] = getDaysArray(year, accountingYear);

	// Calculate the starting index for the quarter
	const startIndex = (quarter - 1) * 3;

	// Sum the days for the three months in the given quarter
	const quarterDays = daysInEachMonth
		.slice(startIndex, startIndex + 3)
		.reduce((total, days) => total + days, 0);

	return quarterDays;
};

export const getDaysBsHalfYear = (
	year: number,
	half: number,
	accountingYearType?: AccountingYearType,
): number => {
	validateYear(year);
	const accountingYear = accountingYearType || globalConfig.accountingYearType;

	if (half !== 1 && half !== 2) {
		throw new Error("Invalid half: Please provide a half of either 1 or 2.");
	}

	const daysInEachMonth: number[] = getDaysArray(year, accountingYear);

	// Calculate the starting index for the half-year
	const startIndex = (half - 1) * 6;

	const halfYearDays = daysInEachMonth
		.slice(startIndex, startIndex + 6)
		.reduce((total, days) => total + days, 0);

	return halfYearDays;
};

export const getDaysBsYear = (
	year: number,
	accountingYearType?: AccountingYearType,
): number => {
	validateYear(year);
	const accountingYear = accountingYearType || globalConfig.accountingYearType;

	const daysInEachMonth: number[] = getDaysArray(year, accountingYear);

	const yearDays = daysInEachMonth.reduce((total, days) => total + days, 0);

	return yearDays;
};

export const getBsMonthEndDate = (
	year: number,
	month: number,
	accountingYearType?: AccountingYearType,
): string => {
	validateYear(year);
	validateMonth(month);
	const accountingYear = accountingYearType || globalConfig.accountingYearType;

	const daysInEachMonth: number[] = getDaysArray(year, accountingYear);

	const days = daysInEachMonth[month - 1] || 30;

	const endDate = formatDate({ year: year, month: month, day: days });

	return endDate;
};

export const getBsQuarterEndDate = (
	year: number,
	quarter: number,
	accountingYearType?: AccountingYearType,
): string => {
	validateYear(year);
	const accountingYear = accountingYearType || globalConfig.accountingYearType;

	const daysInEachMonth: number[] = getDaysArray(year, accountingYear);

	if (quarter < 1 || quarter > 4) {
		throw new Error(
			"Invalid quarter: Please provide a quarter between 1 and 4.",
		);
	}

	const days = daysInEachMonth[quarter * 3 - 1] || 30;
	let adjustedYear = year;
	let adjustedMonth = quarter * 3;

	if (accountingYear === "financial") {
		adjustedYear = quarter === 4 ? year + 1 : year;
		adjustedMonth = ((quarter % 4) + 1) * 3;
	}

	const endDate = formatDate({
		year: adjustedYear,
		month: adjustedMonth,
		day: days,
	});

	return endDate;
};

export const getBsHalfYearEndDate = (
	year: number,
	half: number,
	accountingYearType?: AccountingYearType,
): string => {
	validateYear(year);
	const accountingYear = accountingYearType || globalConfig.accountingYearType;

	const daysInEachMonth: number[] = getDaysArray(year, accountingYear);

	if (half !== 1 && half !== 2) {
		throw new Error("Invalid half: Please provide a half of either 1 or 2.");
	}

	const days = daysInEachMonth[half * 6 - 1] || 30;

	let adjustedYear = year;
	let adjustedMonth = half * 6;
	if (accountingYear === "financial") {
		adjustedMonth = adjustedMonth + 3;
		adjustedYear = adjustedMonth > 12 ? year + 1 : year;
		adjustedMonth = adjustedMonth % 12;
	}

	const endDate = formatDate({
		year: adjustedYear,
		month: adjustedMonth,
		day: days,
	});

	return endDate;
};

export const getBsYearEndDate = (
	year: number,
	accountingYearType?: AccountingYearType,
): string => {
	validateYear(year);
	const accountingYear = accountingYearType || globalConfig.accountingYearType;

	const daysInEachMonth: number[] = getDaysArray(year, accountingYear);

	const days = daysInEachMonth[11] || 30;

	const endDate = formatDate({ year: year, month: 12, day: days });

	return endDate;
};

export const convertToBs = (date: string | Date): BSDate => {
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
	return formatDate({ year: bsYear, month: bsMonth, day: bsDay }) as BSDate;
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
	endDate,
	includeEndDate = false,
}: {
	startDate: string;
	endDate: string;
	includeEndDate?: boolean;
}): number => {
	const start = new Date(convertToAd(startDate));
	const end = new Date(convertToAd(endDate));
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

export const getTodaysBsDate = (): BSDate => {
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

export const getPeriodEndDatesBs = ({
	startDate,
	endDate,
	periodType,
	yearType = "calendar",
}: {
	startDate: string;
	endDate: string;
	periodType: PaymentFrequency;
	yearType?: AccountingYearType;
}) => {
	const periodEndFunction =
		periodType === "quarter" ? getBsQuarterEndDate : getBsHalfYearEndDate;

	// Initialize the array of end dates
	const endDates = [startDate];
	let currentPeriod = getPeriod({
		dateString: startDate,
		periodType,
		yearType,
	});
	let i = 0;

	// Loop through periods, adding their end dates to the array
	while (true) {
		const periodEndDate = periodEndFunction(
			currentPeriod.year,
			currentPeriod.quarter ?? currentPeriod.halfYear,
			yearType,
		);

		// Check if the next period has crossed the endDate
		if (periodEndDate > endDate) {
			// Add the endDate itself if it's not included yet
			if (!endDates.includes(endDate)) {
				endDates.push(endDate);
			}
			break;
		}
		endDates.push(periodEndDate);

		const nextPeriodData = nextPeriod({
			dateString: periodEndDate,
			periodType,
			yearType,
		});

		const nextPeriodEndDate = periodEndFunction(
			nextPeriodData.year,
			nextPeriodData.quarter ?? nextPeriodData.halfYear,
			yearType,
		);

		// If the next period end date crosses the end date, stop iteration
		if (nextPeriodEndDate > endDate) {
			endDates.push(endDate);
			break;
		}
		currentPeriod = nextPeriodData;
		i++;
	}

	return endDates;
};

export const getPeriodEndDatesAd = ({
	startDate,
	endDate,
	periodType,
	yearType = "calendar",
}: {
	startDate: string;
	endDate: string;
	periodType: PaymentFrequency;
	yearType?: AccountingYearType;
}) => {
	const bsDatesArray = getPeriodEndDatesBs({
		startDate,
		endDate,
		periodType,
		yearType,
	});
	const adDates = bsDatesArray.map((date: string) => convertToAd(date));

	return adDates;
};
