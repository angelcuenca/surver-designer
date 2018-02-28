package com.sanmina.surveyengine.service;

import java.time.LocalDate;

public interface ITimelineService {
    LocalDate getSendSurveyDate();

    LocalDate getPreReportDate();

    LocalDate getExpirationDate();

    LocalDate getFinalReportDate();
}
