import { useState } from "react";
import cn from "../../utils/classnames";
import Icon from "./components/icon";
import {
  getAllDatesInMonth,
  getStringFormattedDate,
  getDateStringWithFirstDate,
  getNormalizedCurrentDate,
  displayDate,
  getDatesInRange,
} from "../../utils/dates";
import { WEEK_LIST, DEFAULT_CLASSNAMES } from "./constants";

// Calendar Custom header
export type CalendarHeaderProps = {
  displayDate: string;
  selectedDate: string | string[] | null;
  handleMonthChange: (month: "+1" | "-1") => void;
  handleYearChange: (year: "+1" | "-1") => void;
  setNewDateForCalendar: (date: Date | string) => void;
};

// Props for overriding all design
export type OverrideDesignProps = {
  displayDate: string;
  displayRawData: string;
  selectedDate: string | string[] | null;
  allDatesInMonth: string[];
  dayList: Day[];
  handleMonthChange: (month: "+1" | "-1") => void;
  handleYearChange: (year: "+1" | "-1") => void;
  handleDateChange: (date: string) => void;
  setNewDateForCalendar: (date: Date | string) => void;

  getStyles: (date: string) => {
    isCurrentDate: boolean;
    isSelectedDate: boolean;
    isOffDay: boolean;
    isDisableDayOff: boolean;
    isExtraDayInGrid: boolean;
    isDisableDate: boolean;
  };
  [key: string]: unknown;
};

// Default props
export type CalendarProps = {
  value: string | null | string[];
  onChange: (value: string[]) => void;
  onYearChange?: (year: string) => void;
  onMonthChange?: (year: string) => void;
  minDate?: string;
  maxDate?: string;
  iconHeaderSize?: number;
  isHideHeader?: boolean;
  customHeader?: (props: CalendarHeaderProps) => JSX.Element;
  overrideDesign?: (props: OverrideDesignProps) => JSX.Element;
  isSelectMultipleDates?: boolean;
  isSelectDatesInRange?: boolean;
  dayOffList?: Day[];
  isDisableDayOff?: boolean;
  disableDateList?: string[];
  classNames?: ClassNames;
};

export default function PlainReactCalendar({
  value,
  onChange,
  onMonthChange,
  onYearChange,
  minDate,
  maxDate,
  iconHeaderSize,
  isHideHeader = false,
  customHeader,
  overrideDesign,
  isSelectMultipleDates = false,
  isSelectDatesInRange = false,
  dayOffList,
  isDisableDayOff = false,
  disableDateList,
  classNames,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(
    getDateStringWithFirstDate(getNormalizedCurrentDate(value))
  ); // Active Date not selected date

  const all_classnames = { ...DEFAULT_CLASSNAMES, ...classNames };

  const handleDateChange = (date: string) => {
    if (disableDateList?.includes(date)) {
      return;
    }

    if (
      isDisableDayOff &&
      dayOffList?.length &&
      dayOffList.includes(WEEK_LIST[new Date(date).getDay()])
    ) {
      return;
    }

    if (
      (maxDate && new Date(date) > new Date(maxDate)) ||
      (minDate && new Date(date) < new Date(minDate))
    ) {
      return;
    }

    if (isSelectMultipleDates && typeof value !== "string" && value !== null) {
      if (value.includes(date)) {
        // Remove if date exists in value (date list)
        onChange(value?.filter((oldDate) => oldDate !== date));
      } else {
        onChange([...value, date]);
      }

      return;
    }

    if (isSelectDatesInRange && typeof value !== "string" && value !== null) {
      if (!value.length) {
        onChange([date]);
        return;
      }

      if (value.length <= 2 && value.includes(date) && value !== null) {
        onChange(value.filter((oldDate) => oldDate !== date));
        return;
      }

      const oldDate = new Date(value[0]);
      const newDate = new Date(date);

      const startRangeDate = oldDate < newDate ? oldDate : newDate;
      const endRangeDate = oldDate > newDate ? oldDate : newDate;

      // Update date after filtering out disabled dates
      onChange(
        getDatesInRange(startRangeDate, endRangeDate).filter((date) => {
          if (disableDateList?.length && disableDateList.includes(date)) {
            return false;
          }

          if (
            isDisableDayOff &&
            dayOffList?.length &&
            dayOffList.includes(WEEK_LIST[new Date(date).getDay()])
          ) {
            return false;
          }

          return true;
        })
      );

      return;
    }

    onChange([date]);
    setCurrentDate(getDateStringWithFirstDate(date));
  };

  const handleYearChange = (year: "+1" | "-1") => {
    const currentDateArray = currentDate.split("-");

    if (year === "+1") {
      const newDate = `${Number(currentDateArray[0]) + 1}-${
        currentDateArray[1]
      }-01`;

      if (maxDate && new Date(newDate) > new Date(maxDate)) {
        return;
      }

      setCurrentDate(newDate);
      onYearChange ? onYearChange(newDate) : null;
    } else {
      const newDate = `${Number(currentDateArray[0]) - 1}-${
        currentDateArray[1]
      }-01`;

      if (minDate && new Date(newDate) < new Date(minDate)) {
        return;
      }

      setCurrentDate(newDate);
      onYearChange ? onYearChange(newDate) : null;
    }
  };

  const handleMonthChange = (month: "+1" | "-1") => {
    const newDate = new Date(currentDate);

    if (month === "+1") {
      newDate.setMonth(newDate.getMonth() + 1);

      if (maxDate && newDate > new Date(maxDate)) {
        return;
      }

      const newStringDate = getStringFormattedDate(newDate);
      setCurrentDate(newStringDate);
      onMonthChange ? onMonthChange(newStringDate) : null;
    } else {
      newDate.setMonth(newDate.getMonth() - 1);

      if (minDate && newDate < new Date(minDate)) {
        return;
      }

      const newStringDate = getStringFormattedDate(newDate);
      setCurrentDate(newStringDate);
      onMonthChange ? onMonthChange(newStringDate) : null;
    }
  };

  const setNewDateForCalendar = (date: Date | string) => {
    const newDate = new Date(date);

    if (maxDate && newDate > new Date(maxDate)) {
      return;
    }

    if (minDate && newDate < new Date(minDate)) {
      return;
    }

    newDate.setDate(1);

    const newStringDate = getStringFormattedDate(newDate);
    setCurrentDate(newStringDate);
    onMonthChange ? onMonthChange(newStringDate) : null;
  };

  const getStyles = (date: string) => {
    const styles = {
      isCurrentDate: date === getStringFormattedDate(new Date()),
      isSelectedDate:
        typeof value === "string" ? date === value : !!value?.includes(date),
      isOffDay: dayOffList
        ? !!dayOffList.includes(WEEK_LIST[new Date(date).getDay()])
        : false,
      isDisableDayOff:
        isDisableDayOff &&
        !!dayOffList?.includes(WEEK_LIST[new Date(date).getDay()]),
      isExtraDayInGrid: currentDate.split("-")[1] !== date.split("-")[1],
      isDisableDate: !!disableDateList?.includes(date),
    };

    return styles;
  };

  // If user sets override design props, It will pass the following props
  if (overrideDesign) {
    return overrideDesign({
      displayDate: displayDate(currentDate),
      displayRawData: currentDate,
      selectedDate: value,
      allDatesInMonth: getAllDatesInMonth(new Date(currentDate)),
      dayList: WEEK_LIST,
      handleMonthChange,
      handleYearChange,
      handleDateChange,
      setNewDateForCalendar,
      getStyles,

      // Other values
      minDate,
      maxDate,
      iconHeaderSize,
      isHideHeader,
      isSelectMultipleDates,
      isSelectDatesInRange,
      dayOffList,
      isDisableDayOff,
      disableDateList,
      classNames,
    });
  }

  return (
    <div
      className={cn("__prc_opt_main-container", all_classnames?.mainContainer)}
    >
      {!isHideHeader && !customHeader ? (
        <div className={cn("__prc_com_header", all_classnames.header)}>
          <p className={cn("__prc_remove-pm", all_classnames.currentDateText)}>
            {displayDate(currentDate)}
          </p>
          <div
            className={cn(
              "__prc_com_right-header-container",
              all_classnames.rightHeaderContainer
            )}
          >
            <div
              className={cn(
                "__prc_com_header_year_container",
                all_classnames.headerYearContainer
              )}
            >
              <div title="Previous year" onClick={() => handleYearChange("-1")}>
                <Icon
                  size={iconHeaderSize}
                  type="chevrons-left"
                  className={cn(
                    "_prc_com_header_icon",
                    all_classnames.headerIcon
                  )}
                />
              </div>
              <p
                className={cn("__prc_remove-pm", all_classnames.headerYearText)}
              >
                year
              </p>
              <div title="Next year" onClick={() => handleYearChange("+1")}>
                <Icon
                  size={iconHeaderSize}
                  type="chevrons-right"
                  className={cn(
                    "_prc_com_header_icon",
                    all_classnames.headerIcon
                  )}
                />
              </div>
            </div>

            <div
              className={cn(
                "__prc_com_header-month-container",
                all_classnames.headerMonthContainer
              )}
            >
              <div
                title="Previous month"
                onClick={() => handleMonthChange("-1")}
              >
                <Icon
                  size={iconHeaderSize}
                  type="chevron-left"
                  className={cn(
                    "_prc_com_header_icon",
                    all_classnames.headerIcon
                  )}
                />
              </div>
              <p
                className={cn(
                  "__prc_remove-pm",
                  all_classnames.headerMonthText
                )}
              >
                month
              </p>
              <div title="Next month" onClick={() => handleMonthChange("+1")}>
                <Icon
                  size={iconHeaderSize}
                  type="chevron-right"
                  className={cn(
                    "_prc_com_header_icon",
                    all_classnames.headerIcon
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {customHeader
        ? customHeader({
            displayDate: displayDate(currentDate),
            selectedDate: value,
            handleMonthChange,
            handleYearChange,
            setNewDateForCalendar,
          })
        : null}

      <div className={cn("__prc_com_cal-grid", all_classnames.calendarGrid)}>
        {WEEK_LIST.map((week, index) => (
          <p
            key={"day_text_" + index}
            className={cn(
              "__prc_remove-pm",
              "__prc_com_day-text",
              all_classnames.dayText
            )}
          >
            {week}
          </p>
        ))}

        {getAllDatesInMonth(new Date(currentDate)).map((date, index) => {
          const styles = getStyles(date);

          return (
            <p
              key={"date_" + date + " " + index}
              onClick={() => handleDateChange(date)}
              className={cn(
                "__prc_remove-pm",
                "__prc_com_date",
                all_classnames.date,
                {
                  [all_classnames.currentDate || ""]: styles.isCurrentDate,
                  [all_classnames.selectedDate || ""]: styles.isSelectedDate,
                  [all_classnames.offDay || ""]: styles.isOffDay,
                  [all_classnames.extraDateInGrid || ""]:
                    styles.isExtraDayInGrid,
                  [all_classnames.disableDate + " __prc_com_disable-date" ||
                  ""]: styles.isDisableDate,
                  [all_classnames.disableDayOff || ""]: styles.isDisableDayOff,
                }
              )}
            >
              {Number(date.split("-")[2]) || "1"}
            </p>
          );
        })}
      </div>
    </div>
  );
}
