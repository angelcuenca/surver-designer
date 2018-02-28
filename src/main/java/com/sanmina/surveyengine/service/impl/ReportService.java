package com.sanmina.surveyengine.service.impl;

import com.google.appengine.api.datastore.QueryResultIterator;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.cmd.Query;
import com.sanmina.surveyengine.enumerable.ResponseStatus;
import com.sanmina.surveyengine.model.*;
import com.sanmina.surveyengine.service.IReportService;
import com.sanmina.surveyengine.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by arlette_parra on 09/01/18.
 */
@Service
public class ReportService implements IReportService {
    @Autowired
    IUserService iUserService;

    @Autowired
    private CustomerExternalRatingService customerExternalRatingService;

    @Override
    public PatsTable getMonthlyOverviewPreReport (User contact, int month, int year) {

        Timeline timeline = new Timeline(LocalDate.now());
        List<GroupByCustomer> responsesByCustomer = new ArrayList<>();
        PatsTable table = new PatsTable();

        int fiscalMonth = month == -1 ? timeline.getFiscalMonth() : month;
        int fiscalYear = year == -1 ? timeline.getFiscalYear(): year;

        Query<Response> customerDistinct;
        List<ResponseStatus> responseStatusList = new ArrayList<>();
        responseStatusList.add(ResponseStatus.SUBMITTED);

        customerDistinct = ObjectifyService.ofy().load().type(Response.class)
                .project("customerCode").distinct(true)
                .filter("status IN", responseStatusList)
                .filter("recipient", contact.getEmail())
                .filter("fiscalMonth", fiscalMonth)
                .filter("fiscalYear", fiscalYear);

        QueryResultIterator<Response> queryResultIterator = customerDistinct.iterator();
        while (queryResultIterator.hasNext()) {
            Response responseItem = queryResultIterator.next();
            Query<Response> groupBy;
            CustomerExternalRating customerExternalRating = customerExternalRatingService.findCustomerExternalRatingByCustomer(responseItem.getCustomerCode());

            groupBy = ObjectifyService.ofy().load().type(Response.class)
                    .filter("customerCode", responseItem.getCustomerCode())
                    .filter("status IN", responseStatusList)
                    .filter("recipient", contact.getEmail())
                    .filter("fiscalMonth", fiscalMonth)
                    .filter("fiscalYear", fiscalYear);

            GroupByCustomer group = new GroupByCustomer(responseItem.getCustomerCode().toString(), groupBy.list(), customerExternalRating);
            responsesByCustomer.add(group);
        }

        table.setFiscalMonth(fiscalMonth);
        table.setFiscalYear(fiscalYear);
        table.setResponsesByCustomer(responsesByCustomer);

        return table;
    }

    @Override
    public PatsTable getMonthlyOverviewFinalReport (User contact, int month, int year, boolean accessAll) {

        Timeline timeline = new Timeline(LocalDate.now());
        List<GroupByCustomer> responsesByCustomer = new ArrayList<>();
        PatsTable table = new PatsTable();

        int fiscalMonth = month == -1 ? timeline.getFiscalMonth() : month;
        int fiscalYear = year == -1 ? timeline.getFiscalYear(): year;

        Query<Response> customerDistinct;
        List<ResponseStatus> responseStatusList = new ArrayList<>();
        responseStatusList.add(ResponseStatus.EXPIRED);
        responseStatusList.add(ResponseStatus.SUBMITTED);

        if (accessAll){
            customerDistinct = ObjectifyService.ofy().load().type(Response.class)
                    .project("customerCode").distinct(true)
                    .filter("status IN", responseStatusList)
                    .filter("fiscalMonth", fiscalMonth)
                    .filter("fiscalYear", fiscalYear);
        }else {
            customerDistinct = ObjectifyService.ofy().load().type(Response.class)
                    .project("customerCode").distinct(true)
                    .filter("status IN", responseStatusList)
                    .filter("recipient", contact.getEmail())
                    .filter("fiscalMonth", fiscalMonth)
                    .filter("fiscalYear", fiscalYear);
        }

        QueryResultIterator<Response> queryResultIterator = customerDistinct.iterator();
        while (queryResultIterator.hasNext()) {
            Response responseItem = queryResultIterator.next();
            Query<Response> groupBy;
            CustomerExternalRating customerExternalRating = customerExternalRatingService.findCustomerExternalRatingByCustomer(responseItem.getCustomerCode());

            if (accessAll){
                groupBy = ObjectifyService.ofy().load().type(Response.class)
                        .filter("customerCode", responseItem.getCustomerCode())
                        .filter("status IN", responseStatusList)
                        .filter("fiscalMonth", fiscalMonth)
                        .filter("fiscalYear", fiscalYear);
            }else {
                groupBy = ObjectifyService.ofy().load().type(Response.class).filter("customerCode", responseItem.getCustomerCode())
                        .filter("status IN", responseStatusList)
                        .filter("recipient", contact.getEmail())
                        .filter("fiscalMonth", fiscalMonth)
                        .filter("fiscalYear", fiscalYear);
            }

            GroupByCustomer group = new GroupByCustomer(responseItem.getCustomerCode().toString(), groupBy.list(), customerExternalRating);
            responsesByCustomer.add(group);
        }

        table.setFiscalMonth(fiscalMonth);
        table.setFiscalYear(fiscalYear);
        table.setResponsesByCustomer(responsesByCustomer);

        return table;
    }

    @Override
    public PatsTable getMonthlyOverviewDivisionalReport (int month, int year) {

        Timeline timeline = new Timeline(LocalDate.now());
        List<GroupByCustomer> responsesByCustomer = new ArrayList<>();
        PatsTable table = new PatsTable();

        int fiscalMonth = month == -1 ? timeline.getFiscalMonth() : month;
        int fiscalYear = year == -1 ? timeline.getFiscalYear(): year;

        Query<Response> customerDistinct;
        List<ResponseStatus> responseStatusList = new ArrayList<>();
        responseStatusList.add(ResponseStatus.EXPIRED);
        responseStatusList.add(ResponseStatus.SUBMITTED);

        customerDistinct = ObjectifyService.ofy().load().type(Response.class)
                .project("customerCode").distinct(true)
                .filter("status IN", responseStatusList)
                .filter("fiscalMonth", fiscalMonth)
                .filter("fiscalYear", fiscalYear);

        QueryResultIterator<Response> queryResultIterator = customerDistinct.iterator();
        while (queryResultIterator.hasNext()) {
            Response responseItem = queryResultIterator.next();
            Query<Response> groupBy;
            CustomerExternalRating customerExternalRating = customerExternalRatingService.findCustomerExternalRatingByCustomer(responseItem.getCustomerCode());

            groupBy = ObjectifyService.ofy().load().type(Response.class)
                    .filter("customerCode", responseItem.getCustomerCode())
                    .filter("status IN", responseStatusList)
                    .filter("fiscalMonth", fiscalMonth)
                    .filter("fiscalYear", fiscalYear);

            GroupByCustomer group = new GroupByCustomer(responseItem.getCustomerCode().toString(), groupBy.list(), customerExternalRating);
            responsesByCustomer.add(group);
        }

        table.setFiscalMonth(fiscalMonth);
        table.setFiscalYear(fiscalYear);
        table.setResponsesByCustomer(responsesByCustomer);

        return table;
    }

    @Override
    public PatsTable getThreeMonthReport (int month, int year) {

        Timeline timeline = new Timeline(LocalDate.now());
        List<GroupByCustomer> responsesByCustomer = new ArrayList<>();
        PatsTable table = new PatsTable();

        int fiscalMonth = month == -1 ? timeline.getFiscalMonth() : month;
        int fiscalYear = year == -1 ? timeline.getFiscalYear(): year;

        Query<Response> customerDistinct;
        List<ResponseStatus> responseStatusList = new ArrayList<>();
        responseStatusList.add(ResponseStatus.EXPIRED);
        responseStatusList.add(ResponseStatus.SUBMITTED);

        customerDistinct = ObjectifyService.ofy().load().type(Response.class)
                .project("customerCode", "fiscalMonth").distinct(true)
                .filter("status IN", responseStatusList)
                .filter("fiscalMonth >=", fiscalMonth - 2)
                .filter("fiscalMonth <=", fiscalMonth)
                .filter("fiscalYear", fiscalYear);

        QueryResultIterator<Response> queryResultIterator = customerDistinct.iterator();
        while (queryResultIterator.hasNext()) {
            Response responseItem = queryResultIterator.next();
            Query<Response> groupBy;
            CustomerExternalRating customerExternalRating = customerExternalRatingService.findCustomerExternalRatingByCustomer(responseItem.getCustomerCode());

            groupBy = ObjectifyService.ofy().load().type(Response.class)
                    .filter("customerCode", responseItem.getCustomerCode())
                    .filter("status IN", responseStatusList)
                    .filter("fiscalMonth >=", fiscalMonth - 2)
                    .filter("fiscalMonth <=", fiscalMonth)
                    .filter("fiscalYear", fiscalYear);

            GroupByCustomer group = new GroupByCustomer(responseItem.getCustomerCode().toString(), groupBy.list(), customerExternalRating);
            responsesByCustomer.add(group);
        }

        table.setFiscalMonth(fiscalMonth);
        table.setFiscalYear(fiscalYear);
        table.setResponsesByCustomer(responsesByCustomer);

        return table;
    }

    @Override
    public PatsTable getStoplightReport (int month, int year) {
        Timeline timeline = new Timeline(LocalDate.now());
        List<GroupByCustomer> responsesByCustomer = new ArrayList<>();
        PatsTable table = new PatsTable();

        int fiscalMonth = month == -1 ? timeline.getFiscalMonth() : month;
        int fiscalYear = year == -1 ? timeline.getFiscalYear(): year;

        Query<Response> customerDistinct;
        List<ResponseStatus> responseStatusList = new ArrayList<>();
        responseStatusList.add(ResponseStatus.EXPIRED);
        responseStatusList.add(ResponseStatus.SUBMITTED);

        customerDistinct = ObjectifyService.ofy().load().type(Response.class)
                .project("customerCode").distinct(true)
                .filter("status IN", responseStatusList)
                .filter("fiscalMonth", fiscalMonth)
                .filter("fiscalYear", fiscalYear);

        QueryResultIterator<Response> queryResultIterator = customerDistinct.iterator();
        while (queryResultIterator.hasNext()) {
            Response responseItem = queryResultIterator.next();
            Query<Response> groupBy;
            CustomerExternalRating customerExternalRating = customerExternalRatingService.findCustomerExternalRatingByCustomer(responseItem.getCustomerCode());

            groupBy = ObjectifyService.ofy().load().type(Response.class)
                    .filter("customerCode", responseItem.getCustomerCode())
                    .filter("status IN", responseStatusList)
                    .filter("fiscalMonth", fiscalMonth)
                    .filter("fiscalYear", fiscalYear);

            GroupByCustomer group = new GroupByCustomer(responseItem.getCustomerCode().toString(), groupBy.list(), customerExternalRating);
            responsesByCustomer.add(group);
        }

        table.setFiscalMonth(fiscalMonth);
        table.setFiscalYear(fiscalYear);
        table.setResponsesByCustomer(responsesByCustomer);

        return table;
    }

    @Override
    public PatsTable getMonthlyUnrecordedReport (int month, int year) {

        Timeline timeline = new Timeline(LocalDate.now());
        List<GroupByCustomer> responsesByCustomer = new ArrayList<>();
        PatsTable table = new PatsTable();

        int fiscalMonth = month == -1 ? timeline.getFiscalMonth() : month;
        int fiscalYear = year == -1 ? timeline.getFiscalYear(): year;

        Query<Response> customerDistinct;
        List<ResponseStatus> responseStatusList = new ArrayList<>();
        responseStatusList.add(ResponseStatus.AWAITING);
        responseStatusList.add(ResponseStatus.AWAITING_EXPIRED);

        customerDistinct = ObjectifyService.ofy().load().type(Response.class)
                .project("customerCode").distinct(true)
                .filter("status IN", responseStatusList)
                .filter("fiscalMonth", fiscalMonth)
                .filter("fiscalYear", fiscalYear);

        QueryResultIterator<Response> queryResultIterator = customerDistinct.iterator();
        while (queryResultIterator.hasNext()) {
            Response responseItem = queryResultIterator.next();
            Query<Response> groupBy;
            CustomerExternalRating customerExternalRating = customerExternalRatingService.findCustomerExternalRatingByCustomer(responseItem.getCustomerCode());

            groupBy = ObjectifyService.ofy().load().type(Response.class).filter("customerCode", responseItem.getCustomerCode())
                    .filter("status IN", responseStatusList)
                    .filter("fiscalMonth", fiscalMonth)
                    .filter("fiscalYear", fiscalYear);

            GroupByCustomer group = new GroupByCustomer(responseItem.getCustomerCode().toString(), groupBy.list(), customerExternalRating);
            responsesByCustomer.add(group);
        }

        table.setFiscalMonth(fiscalMonth);
        table.setFiscalYear(fiscalYear);
        table.setResponsesByCustomer(responsesByCustomer);

        return table;
    }

    @Override
    public PatsTable getYearlyOverviewReport (String  customer, int year) {

        Timeline timeline = new Timeline(LocalDate.now());
        List<GroupByMonth> responsesByMonth = new ArrayList<>();
        PatsTable table = new PatsTable();

        int fiscalYear = year == -1 ? timeline.getFiscalYear() : year;
        List<ResponseStatus> responseStatusList = new ArrayList<>();
        responseStatusList.add(ResponseStatus.EXPIRED);
        responseStatusList.add(ResponseStatus.SUBMITTED);

        for (int monthInt = 1; monthInt <= 12; monthInt++){
            Query<Response> groupBy;

            if (customer.equals("showAllCustomers")){
                groupBy = ObjectifyService.ofy().load().type(Response.class)
                        .filter("status IN", responseStatusList)
                        .filter("fiscalMonth", monthInt)
                        .filter("fiscalYear", fiscalYear);
            }else {
                groupBy = ObjectifyService.ofy().load().type(Response.class)
                        .filter("status IN", responseStatusList)
                        .filter("fiscalMonth", monthInt)
                        .filter("customerCode", customer)
                        .filter("fiscalYear", fiscalYear);
            }

            GroupByMonth group = new GroupByMonth(monthInt, groupBy.list());
            responsesByMonth.add(group);
        }

        table.setFiscalYear(fiscalYear);
        table.setResponseByMonth(responsesByMonth);

        return table;
    }

    @Override
    public PatsTable getMonthlyUploadedFilesReport (int month, int year) {
        Timeline timeline = new Timeline(LocalDate.now());
        List<GroupByCustomer> responsesByCustomer = new ArrayList<>();
        PatsTable table = new PatsTable();

        int fiscalMonth = month == -1 ? timeline.getFiscalMonth() : month;
        int fiscalYear = year == -1 ? timeline.getFiscalYear(): year;

        Query<Response> customerDistinct;
        List<ResponseStatus> responseStatusList = new ArrayList<>();
        responseStatusList.add(ResponseStatus.EXPIRED);
        responseStatusList.add(ResponseStatus.SUBMITTED);

        customerDistinct = ObjectifyService.ofy().load().type(Response.class)
                .project("customerCode").distinct(true)
                .filter("status IN", responseStatusList)
                .filter("answers.type", "FILE")
                .filter("fiscalMonth", fiscalMonth)
                .filter("fiscalYear", fiscalYear);

        QueryResultIterator<Response> queryResultIterator = customerDistinct.iterator();
        while (queryResultIterator.hasNext()) {
            Response responseItem = queryResultIterator.next();
            Query<Response> groupBy;
            CustomerExternalRating customerExternalRating = customerExternalRatingService.findCustomerExternalRatingByCustomer(responseItem.getCustomerCode());

            groupBy = ObjectifyService.ofy().load().type(Response.class)
                    .filter("customerCode", responseItem.getCustomerCode())
                    .filter("status IN", responseStatusList)
                    .filter("answers.type", "FILE")
                    .filter("answers.answer >"," ")
                    .filter("fiscalMonth", fiscalMonth)
                    .filter("fiscalYear", fiscalYear);

            GroupByCustomer group = new GroupByCustomer(responseItem.getCustomerCode().toString(), groupBy.list(), customerExternalRating);
            responsesByCustomer.add(group);
        }

        table.setFiscalMonth(fiscalMonth);
        table.setFiscalYear(fiscalYear);
        table.setResponsesByCustomer(responsesByCustomer);

        return table;
    }

    @Override
    public List<GroupByMonth> getResponsesByMonth(String customer, int month, int year) {

        Timeline timeline = new Timeline(LocalDate.now());
        List<GroupByMonth> responsesByMonth = new ArrayList<>();

        int fiscalYear = year == -1 ? timeline.getFiscalYear() : year;
        int fiscalMonth = month == -1 ? timeline.getFiscalMonth() : month;

        Query<Response> groupBy;
        List<ResponseStatus> responseStatusList = new ArrayList<>();
        responseStatusList.add(ResponseStatus.EXPIRED);
        responseStatusList.add(ResponseStatus.SUBMITTED);

        if (customer.equals("showAllCustomers")){
            groupBy = ObjectifyService.ofy().load().type(Response.class)
                    .filter("fiscalMonth", fiscalMonth)
                    .filter("fiscalYear", fiscalYear)
                    .filter("status IN", responseStatusList);
        }else {
            groupBy = ObjectifyService.ofy().load().type(Response.class)
                    .filter("customerCode", customer)
                    .filter("fiscalMonth", fiscalMonth)
                    .filter("fiscalYear", fiscalYear)
                    .filter("status IN", responseStatusList);
        }

        GroupByMonth group = new GroupByMonth(fiscalMonth, groupBy.list());
        responsesByMonth.add(group);

        return responsesByMonth;
    }

    @Override
    public List<Integer> getResponsesYearList() {
        Query<Response> yearsDistinct = ObjectifyService.ofy().load().type(Response.class)
                .project("fiscalYear").distinct(true);

        List<Integer> years = new ArrayList<>();
        QueryResultIterator<Response> queryResultIterator = yearsDistinct.iterator();
        while (queryResultIterator.hasNext()) {
            Response responseItem = queryResultIterator.next();
            years.add(responseItem.getFiscalYear());
        }
        return years;
    }

}
