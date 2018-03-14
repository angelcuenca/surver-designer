package com.project.surveyengine.model;

import java.util.List;

/*
* In honor of the New England Patriots
* November 2017 (Patriots vs Raiders)
* Because Pats paginates the four quarters
*
**/

public class PatsTable {

    public String emailUerLogged;
    public int fiscalMonth;
    public int fiscalYear;
    public String customer;
    public List<Integer> yearList;
    public List<GroupByCustomer> responsesByCustomer;
    public List<GroupByMonth> responseByMonth;
    public List<Response> dataResponses;
    public List<Survey> dataSurveys;
    public List<User> dataUsers;
    public List<Customer> dataCustomers;
    public List<CustomerContact> dataCustomerContact;

    public void setEmailUerLogged(String emailUerLogged) {
        this.emailUerLogged = emailUerLogged;
    }

    public void setDataCustomers(List<Customer> dataCustomers) {
        this.dataCustomers = dataCustomers;
    }

    public void setResponsesByCustomer(List<GroupByCustomer> responsesByCustomer) {
        this.responsesByCustomer = responsesByCustomer;
    }

    public void setResponseByMonth(List<GroupByMonth> responseByMonth) {
        this.responseByMonth = responseByMonth;
    }

    public void setDataResponses(List<Response> dataResponses) {
        this.dataResponses = dataResponses;
    }

    public void setDataSurveys(List<Survey> dataSurveys){
        this.dataSurveys = dataSurveys;
    }

    public void setDataUsers(List<User> dataUsers){
        this.dataUsers = dataUsers;
    }

    public List<CustomerContact> getDataCustomerContact() {
        return dataCustomerContact;
    }

    public void setDataCustomerContact(List<CustomerContact> dataCustomerContact) {
        this.dataCustomerContact = dataCustomerContact;
    }

    public void setYearList(List<Integer> yearList) {
        this.yearList = yearList;
    }

    public void setCustomer(String customer) {
        this.customer = customer;
    }

    public void setFiscalYear(int fiscalYear) {
        this.fiscalYear = fiscalYear;
    }

    public void setFiscalMonth(int fiscalMonth) {
        this.fiscalMonth = fiscalMonth;
    }
}
