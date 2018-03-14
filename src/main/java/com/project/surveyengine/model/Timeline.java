package com.project.surveyengine.model;

import com.project.surveyengine.adjuster.FiscalMonthStartAdjuster;
import com.project.surveyengine.adjuster.FiscalYearEndAdjuster;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;

/**
 * Created by arlette_parra on 17/12/11.
 */
public class Timeline{

    public int fiscalMonth;
    public int fiscalYear;
    public String sendSurvey;
    public String reminder;
    public String expiration;
    public String preReport;
    public String finalReport;

    public Timeline(LocalDate localDate){
        LocalDate fiscalMonthStart = localDate.with(new FiscalMonthStartAdjuster());

        this.fiscalMonth = fiscalMonthStart.plusWeeks(1).getMonthValue();
        this.fiscalYear = localDate.with(new FiscalYearEndAdjuster()).getYear();
        this.sendSurvey = fiscalMonthStart.toString();
        this.reminder = fiscalMonthStart.with(TemporalAdjusters.next(DayOfWeek.WEDNESDAY)).toString();
        this.preReport = fiscalMonthStart.with(TemporalAdjusters.next(DayOfWeek.THURSDAY)).toString();
        this.expiration = fiscalMonthStart.with(TemporalAdjusters.next(DayOfWeek.FRIDAY)).toString();
        this.finalReport = fiscalMonthStart.with(TemporalAdjusters.next(DayOfWeek.SUNDAY)).toString();
    }

    public void setSendSurvey(LocalDate sendSurvey) {
        this.sendSurvey = sendSurvey.toString();
    }

    public void setPreReport(LocalDate preReport) {
        this.preReport = preReport.toString();
    }

    public void setFinalReport(String finalReport) {
        this.finalReport = finalReport;
    }

    public void setExpiration(String expirationDate) {
        this.expiration = (expirationDate);
    }

    public String getSendSurvey() {
        return sendSurvey;
    }

    public int getFiscalMonth() {
        return fiscalMonth;
    }

    public int getFiscalYear() {
        return fiscalYear;
    }

    public String getReminder() {
        return reminder;
    }

    public String getExpiration() {
        return expiration;
    }


    public String getPreReport() {
        return preReport;
    }

    public String getFinalReport() {
        return finalReport;
    }
}
