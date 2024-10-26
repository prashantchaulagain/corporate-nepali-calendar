export const isLeapYear = (year: number): boolean => {
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const daysInMonth = (year: number, month: number): number => {
	if (month < 1 || month > 12) {
		throw new Error("Invalid month: Please provide a month between 1 and 12.");
	}

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
