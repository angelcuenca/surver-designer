package com.sanmina.surveyengine.service.impl;

import com.sanmina.surveyengine.service.ITimelineService;
import de.xn__ho_hia.utils.fiscal_year.FiscalDate;
import de.xn__ho_hia.utils.fiscal_year.FiscalYearFactory;
import de.xn__ho_hia.utils.fiscal_year.FiscalYears;

import java.time.LocalDate;
import java.util.Calendar;

public class TimelineService implements ITimelineService {

    private LocalDate localDate;
    FiscalYearFactory factory = FiscalYears.lateFiscalYear(10);

    @Override
    public LocalDate getSendSurveyDate(){
        localDate = LocalDate.now().withDayOfMonth(1);
        FiscalDate fiscalDate = factory.createFromCalendarDate(localDate).plusMonths(1);
        return fiscalDate.asLocalDate();
    }


    @Override
    public LocalDate getExpirationDate(){
        LocalDate expirationDate = LocalDate.now();
        return expirationDate;
    }

    @Override
    public LocalDate getPreReportDate(){
        localDate = LocalDate.now().withDayOfMonth(5);
        FiscalDate fiscalDate = factory.createFromCalendarDate(localDate).plusMonths(1);

        return fiscalDate.asLocalDate();
    }

    @Override
    public LocalDate getFinalReportDate(){
        LocalDate finalReportDate = LocalDate.now();

        return finalReportDate;
    }

}
