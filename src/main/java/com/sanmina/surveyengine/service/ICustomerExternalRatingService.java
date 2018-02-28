package com.sanmina.surveyengine.service;

import com.sanmina.surveyengine.model.CustomerExternalRating;

import java.util.List;

public interface ICustomerExternalRatingService {
    List<CustomerExternalRating> getAll();
    CustomerExternalRating save(CustomerExternalRating customerContact);
    CustomerExternalRating findCustomerExternalRatingByCustomer(String customer);
    void deleteCustomerExternalRating(CustomerExternalRating customerContact);
}
