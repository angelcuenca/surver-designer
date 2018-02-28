package com.sanmina.surveyengine.service.impl;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import com.sanmina.surveyengine.model.CustomerExternalRating;
import com.sanmina.surveyengine.service.ICustomerExternalRatingService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Qualifier("customerExternalRatingService")
public class CustomerExternalRatingService implements ICustomerExternalRatingService{
    ObjectifyService objectifyService;

    @Override
    public List<CustomerExternalRating> getAll() {
        return objectifyService.ofy().load().type(CustomerExternalRating.class).list();
    }

    @Override
    public CustomerExternalRating save(CustomerExternalRating customerContact) {
        objectifyService.ofy().save().entity(customerContact).now();
        return customerContact;
    }

    @Override
    public CustomerExternalRating findCustomerExternalRatingByCustomer(String customer) {
        return objectifyService.ofy().load().type(CustomerExternalRating.class).filter("customer", customer).first().now();
    }

    @Override
    public void deleteCustomerExternalRating(CustomerExternalRating customerContact) {
        objectifyService.ofy().delete().entity(customerContact).now();
    }
}
