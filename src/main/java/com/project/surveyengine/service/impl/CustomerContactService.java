package com.project.surveyengine.service.impl;

import com.googlecode.objectify.ObjectifyService;
import com.project.surveyengine.model.CustomerContact;
import com.project.surveyengine.service.ICustomerContactService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Qualifier("customerContactService")
public class CustomerContactService implements ICustomerContactService {

    ObjectifyService objectifyService;

    @Override
    public List<CustomerContact> getAll() {
        return objectifyService.ofy().load().type(CustomerContact.class).list();
    }

    @Override
    public List<CustomerContact> getAllMapsByUserEmail(String contactEmail) {
        return objectifyService.ofy().load().type(CustomerContact.class).filter("contactEmail",contactEmail).list();
    }

    @Override
    public CustomerContact save(CustomerContact customerContact) {
        objectifyService.ofy().save().entity(customerContact).now();
        return customerContact;
    }

    @Override
    public CustomerContact findByEmailCustomer(String contactEmail, String customerName) {
        CustomerContact customerContact = objectifyService.ofy().load().type(CustomerContact.class).filter("contactEmail", contactEmail).filter("customerName", customerName).first().now();
        return customerContact;
    }

    @Override
    public CustomerContact findByCustomer(String customerName) {
        CustomerContact customerContact = objectifyService.ofy().load().type(CustomerContact.class).filter("customerName", customerName).first().now();
        return customerContact;
    }

    @Override
    public void deleteCustomerContactMap(CustomerContact customerContact) {
        objectifyService.ofy().delete().entity(customerContact).now();
    }
}
