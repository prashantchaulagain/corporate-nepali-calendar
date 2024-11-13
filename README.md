**corporate-nepali-calendar**

# Date Conversion and Utility Functions

A JavaScript/TypeScript utility library for converting between Gregorian (AD) and Nepali (BS) dates, calculating date differences, and managing date ranges. This library provides functions to handle common date operations specifically tailored to the Nepali calendar (Bikram Sambat).

## **Installation**

Install the library via npm:

```bash
npm install corporate-nepali-calendar
```
 **Usage with Laravel or any other non-npm projects**
 
```bash
<script src="https://cdn.jsdelivr.net/npm/corporate-nepali-calendar/dist/corporate-nepali-calendar.min.js"></script>
```

Once the script is loaded, users can access your functions through the global variable CorporateNepaliCalendar.

```bash
<script>
  // Example usage
  const bsDate = CorporateNepaliCalendar.convertToBs("2024-11-07");
  console.log("BS Date:", bsDate);
</script>
```
 
## **Utility Functions**

### `getDaysAdMonth(year: number, month: number): number`

Returns the number of days in a specified Gregorian (AD) month.

- **Parameters**:
  - `year` - The AD year (e.g., `2024`).
  - `month` - The month number (`1-12`).

- **Returns**: The number of days in the specified month.

---

### `getDaysBsMonth(year: number, month: number): number`

Returns the number of days in a specified Nepali (BS) month in calendar year.

- **Parameters**:
  - `year` - The BS year (e.g., `2081`).
  - `month` - The month number (`1-12`).

- **Returns**: The number of days in the specified BS month.

---

### `getDaysBsQuarter(year: number, quarter: number): number`

Calculates the number of days in a specific BS quarter in calendar year.

- **Parameters**:
  - `year` - The BS year.
  - `quarter` - The quarter number (`1-4`).

- **Returns**: The number of days in the specified BS quarter.

---

### `getDaysBsHalfYear(year: number, half: number): number`

Returns the number of days in a specified BS half-year period in calendar year.

- **Parameters**:
  - `year` - The BS year.
  - `half` - The half of the year (`1` for the first half, `2` for the second half).

- **Returns**: The number of days in the specified half-year period.

---

### `getDaysBsYear(year: number): number`

Returns the total number of days in a given BS year in calendar year.

- **Parameters**:
  - `year` - The BS year.

- **Returns**: The total number of days in the specified BS year.

---

### `getBsMonthEndDate(year: number, month: number): string`

Returns the end date of a specified BS month in `YYYY-MM-DD` format.

- **Parameters**:
  - `year` - The BS year.
  - `month` - The BS month (`1-12`).

- **Returns**: The end date of the specified BS month as a string in `YYYY-MM-DD` format.

---

### `getBsQuarterEndDate(year: number, quarter: number): string`

Returns the end date of a specified BS quarter in `YYYY-MM-DD` format.

- **Parameters**:
  - `year` - The BS year.
  - `quarter` - The BS quarter (`1-4`).

- **Returns**: The end date of the specified BS quarter as a string in `YYYY-MM-DD` format.

---

### `getBsYearEndDate(year: number): string`

Returns the end date of a specified BS year in `YYYY-MM-DD` format.

- **Parameters**:
  - `year` - The BS year.

- **Returns**: The end date of the specified BS year as a string in `YYYY-MM-DD` format.

---

### `convertToBs(date: Date | string): string`

Converts a Gregorian (AD) date to a Nepali (BS) date.

- **Parameters**:
  - `date` - A `Date` object or a string in `YYYY-MM-DD` format.

- **Returns**: The corresponding BS date as a string in `YYYY-MM-DD` format.

---

### `convertToAd(bsDate: string): Date`

Converts a Nepali (BS) date to a Gregorian (AD) date.

- **Parameters**:
  - `bsDate` - A BS date string in `YYYY-MM-DD` format.

- **Returns**: A `Date` object representing the corresponding AD date.

---

### `getDifferenceDaysBsDates(startDate: string, endDate: string, includeStartEndDates: boolean = true): number`

Calculates the difference in days between two BS dates.

- **Parameters**:
  - `startDate` - The starting BS date in `YYYY-MM-DD` format.
  - `endDate` - The ending BS date in `YYYY-MM-DD` format.
  - `includeStartEndDates` - Optional. Whether to include both start and end dates in the count (default is `true`).

- **Returns**: The number of days between the two BS dates.

---

### `getAdMonthRangeFromBsMonth(year: number, month: number): { startDate: string, endDate: string }`

Calculates the Gregorian (AD) date range for a specified BS month.

- **Parameters**:
  - `year` - The BS year.
  - `month` - The BS month (`1-12`).

- **Returns**: An object with `startDate` and `endDate` in `YYYY-MM-DD` format representing the corresponding AD date range.

---

### `getTodaysBsDate(): string`

Returns today's date in the Nepali (BS) calendar.

- **Returns**: The current BS date as a string in `YYYY-MM-DD` format.

---

## **⭐️ Give a Star on GitHub!**

If you find this project helpful, please consider giving it a ⭐️ on [GitHub](https://github.com/prashantchaulagain/corporate-nepali-calendar). Your support helps others discover this library and motivates us to keep improving it.

[![GitHub Stars](https://img.shields.io/github/stars/your-github-repo-url?style=social)](https://github.com/prashantchaulagain/corporate-nepali-calendar)

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more information.

---

## **Contributing**

We welcome contributions! Please feel free to submit issues, suggest new features, or create pull requests to improve this library.
