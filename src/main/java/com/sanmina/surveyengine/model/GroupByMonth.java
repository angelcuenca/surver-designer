package com.sanmina.surveyengine.model;

import java.util.List;

/**
 * Created by arlette_parra on 17/11/30.
 */
public class GroupByMonth {
    public int month;
    public List<Response> responses;

    public GroupByMonth(int month, List<Response> responses) {
        this.month = month;
        this.responses = responses;
    }

    public void setCustomer(int month) {
        this.month = month;
    }

    public void setResponses(List<Response> responses) {
        this.responses = responses;
    }
}
