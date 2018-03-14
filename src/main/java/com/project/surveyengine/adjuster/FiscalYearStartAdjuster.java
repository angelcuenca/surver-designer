package com.project.surveyengine.adjuster;

import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.time.temporal.Temporal;
import java.time.temporal.TemporalAdjuster;

/**
 * Created by arlette_parra on 17/12/11.
 */
public class FiscalYearStartAdjuster implements TemporalAdjuster {
    @Override
    public Temporal adjustInto(Temporal temporal) {

        Month month = Month.from(temporal);
        Year year = Year.from(temporal);

        LocalDate fiscalYearStart = LocalDate.from(temporal).minusYears(1).with(new FiscalYearEndAdjuster()).plusDays(1);

        if (month.getValue() > 9 ){

            fiscalYearStart = fiscalYearStart.withMonth(1).with(new FiscalYearEndAdjuster()).plusDays(1);
        }

        return fiscalYearStart;
    }
}
