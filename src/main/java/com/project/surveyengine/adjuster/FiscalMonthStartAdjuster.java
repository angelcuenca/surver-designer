package com.project.surveyengine.adjuster;

import java.time.*;
import java.time.temporal.*;

/**
 * Created by project on 17/12/11.
 */
public class FiscalMonthStartAdjuster implements TemporalAdjuster {
    @Override
    public Temporal adjustInto(Temporal temporal) {

        LocalDate fiscalYearStart = LocalDate.from(temporal).with(new FiscalYearStartAdjuster());

        System.out.println("Fiscal year start: " + fiscalYearStart);

        long weekCounter = ChronoUnit.WEEKS.between(fiscalYearStart, temporal.with(TemporalAdjusters.nextOrSame(DayOfWeek.SATURDAY))) + 1;
        System.out.println("Week counter: " + weekCounter);

        long quarter = weekCounter % 13 > 0 ? (weekCounter / 13) + 1 : weekCounter / 13;
        System.out.println("Quarter: " + quarter);

        long fiscalWeekNumber = weekCounter % 13 == 0 ? weekCounter : weekCounter % 13 ;
        System.out.println("Fiscal week number: " + fiscalWeekNumber);

        long diff = ((fiscalWeekNumber + 3 ) / 4 * 4) - fiscalWeekNumber + 1;

        diff = 5 - diff ;

        if (fiscalWeekNumber == 13){
            diff = 5 ;
        }

        LocalDate fiscalMonthStart = fiscalYearStart.plusWeeks(weekCounter - diff).with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

        if(fiscalWeekNumber == 1 || fiscalWeekNumber == 5 || fiscalWeekNumber == 9){
            LocalDate temp =  fiscalYearStart.plusWeeks(weekCounter).with(TemporalAdjusters.previous(DayOfWeek.SUNDAY));
            if (temp.isEqual(LocalDate.from(temporal))){
                fiscalMonthStart = temp;
            }
        }

        System.out.println("diff: " + diff);

        System.out.println("Fiscal month start: " + fiscalMonthStart);

        return fiscalMonthStart;
    }
}
