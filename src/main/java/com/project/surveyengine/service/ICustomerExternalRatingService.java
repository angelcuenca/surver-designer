package com.project.surveyengine.service;

import com.project.surveyengine.model.CustomerExternalRating;

import java.util.List;

public interface ICustomerExternalRatingService {
    List<CustomerExternalRating> getAll();
    CustomerExternalRating save(CustomerExternalRating customerContact);
    CustomerExternalRating findCustomerExternalRatingByCustomer(String customer);
    void deleteCustomerExternalRating(CustomerExternalRating customerContact);
}
