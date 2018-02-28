package com.sanmina.surveyengine.service;

import com.sanmina.surveyengine.model.GroupByMonth;
import com.sanmina.surveyengine.model.PatsTable;
import com.sanmina.surveyengine.model.User;
import java.util.List;

/**
 * Created by arlette_parra on 09/01/18.
 */
public interface IReportService {
    PatsTable getMonthlyOverviewPreReport (User contact, int month, int year);
    PatsTable getMonthlyOverviewFinalReport (User contact, int month, int year, boolean accessAll);
    PatsTable getMonthlyOverviewDivisionalReport (int month, int year);
    PatsTable getThreeMonthReport (int month, int year);
    PatsTable getStoplightReport (int month, int year);
    PatsTable getMonthlyUnrecordedReport (int month, int year);
    PatsTable getYearlyOverviewReport(String customer, int year);
    PatsTable getMonthlyUploadedFilesReport (int month, int year);
    List<GroupByMonth> getResponsesByMonth(String customer, int month, int year);
    List<Integer> getResponsesYearList();
}
