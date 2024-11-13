// types.ts
export type YearlyBsDays = Record<number, number[]>;

export type DateResult = {
	bsYear: number;
	bsMonth: number;
	bsDay: number;
};

export type AdDateResult = {
	adYear: number;
	adMonth: number;
	adDay: number;
};

export type FormatDateParams = {
	year: number;
	month: number;
	day: number;
	format?: string;
};

export type DateDifference = {
	days: number;
	weeks?: number;
	months?: number;
};

export type AdMonthRange = {
	monthStartDate: string;
	monthEndDate: string;
};
