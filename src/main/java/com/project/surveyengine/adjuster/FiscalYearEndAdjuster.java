package com.project.surveyengine.adjuster;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.time.chrono.ChronoLocalDate;
import java.time.temporal.*;

/**
 * Created by project on 17/12/15.
 */
public class FiscalYearEndAdjuster implements TemporalAdjuster {
    @Override
    public Temporal adjustInto(Temporal temporal) {

        LocalDate fiscalYearEnd = LocalDate.from(temporal).withMonth(9).with(TemporalAdjusters.lastInMonth(DayOfWeek.SATURDAY));
        if (is53WeeksYear(fiscalYearEnd) || is53WeeksYear(fiscalYearEnd.minusYears(1))){
            fiscalYearEnd = fiscalYearEnd.with(TemporalAdjusters.next(DayOfWeek.SATURDAY));
        }
        System.out.println(fiscalYearEnd);

       if (fiscalYearEnd.isBefore(ChronoLocalDate.from(temporal))){
            fiscalYearEnd = LocalDate.from(temporal).plusYears(1).withMonth(9).with(TemporalAdjusters.lastInMonth(DayOfWeek.SATURDAY));

            if (is53WeeksYear(fiscalYearEnd) || is53WeeksYear(fiscalYearEnd.minusYears(1))){
                fiscalYearEnd = fiscalYearEnd.with(TemporalAdjusters.next(DayOfWeek.SATURDAY));
            }
        }

      return fiscalYearEnd;
    }

    public boolean is53WeeksYear(LocalDate date){
        DayOfWeek lastDayOfYear = date.with(TemporalAdjusters.lastDayOfYear()).getDayOfWeek();
        Boolean isLeapYear = date.isLeapYear();

        if (lastDayOfYear.equals(DayOfWeek.THURSDAY) || (isLeapYear && lastDayOfYear.equals(DayOfWeek.FRIDAY))) {
            return true;
        }

        return false;
    }

}
