export function getAllDatesInMonth(currentDate: Date) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const datesList = [];
  const firstDateInMonth = new Date(Date.UTC(year, month, 1));
  const lastDateInMonth = new Date(Date.UTC(year, month, daysInMonth));

  // Add extra date for the next month if grid does not full at the end.
  for (let i = firstDateInMonth.getDay() - 1; i >= 0; i--) {
    const prevDate = new Date(year, month, -i + 1);
    const dateString = prevDate.toISOString().slice(0, 10);
    datesList.push(dateString);
  }

  // Fill in all days of the current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(Date.UTC(year, month, day));

    const dateString = date.toISOString().slice(0, 10);
    datesList.push(dateString);
  }

  // Fill in succeeding days of the week if the month doesn't end on Saturday
  for (let i = 0; i < 6 - lastDateInMonth.getDay(); i++) {
    const date = new Date(Date.UTC(year, month + 1, i + 1));

    const dateString = date.toISOString().slice(0, 10);
    datesList.push(dateString);
  }

  return datesList;
}

export function getStringFormattedDate(currentDate: Date): string {
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getDateStringWithFirstDate(date: string) {
  const dateArray = date.split("-");
  return `${dateArray[0]}-${dateArray[1]}-01`;
}

export function getNormalizedCurrentDate(value: string | string[] | null) {
  const date = new Date();

  if (!value || !value?.length) {
    return getDateStringWithFirstDate(getStringFormattedDate(date));
  }

  if (typeof value === "string") {
    return getDateStringWithFirstDate(value);
  }

  return getDateStringWithFirstDate(value[0]);
}

export function displayDate(date: string) {
  // It returns date like July 2023, August 2023

  const currentDate_obj = new Date(date);
  return `${currentDate_obj.toLocaleString("default", {
    month: "long",
  })} ${currentDate_obj.getFullYear()}`;
}

export function getDatesInOneMonthRange(dates: Date[]) {
  const startRangeDate = dates[0] < dates[1] ? dates[0] : dates[1];
  const endRangeDate = dates[0] > dates[1] ? dates[0] : dates[1];

  const datesList = [];

  for (
    let day = startRangeDate.getDate();
    day <= endRangeDate.getDate();
    day++
  ) {
    const date = new Date(
      Date.UTC(startRangeDate.getFullYear(), startRangeDate.getMonth(), day)
    );

    const dateString = date.toISOString().slice(0, 10);
    datesList.push(dateString);
  }

  return datesList;
}

export function getDatesInRange(startDate: Date, endDate: Date) {
  const datesList: string[] = [];

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().slice(0, 10);
    datesList.push(dateString);

    currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  }

  return datesList;
}
