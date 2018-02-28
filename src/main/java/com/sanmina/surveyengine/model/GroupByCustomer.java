package com.sanmina.surveyengine.model;

import java.util.List;

/**
 * Created by arlette_parra on 17/11/30.
 */
public class GroupByCustomer {
    public String customer;
    public List<Response> responses;
    public CustomerExternalRating customerExternalRating;

    public GroupByCustomer(String customer, List<Response> responses, CustomerExternalRating customerExternalRating) {
        this.customer = customer;
        this.responses = responses;
        this.customerExternalRating = customerExternalRating;
    }

    public void setCustomer(String customer) {
        this.customer = customer;
    }

    public void setResponses(List<Response> responses) {
        this.responses = responses;
    }
}
