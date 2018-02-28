package com.sanmina.surveyengine.service;

import com.sanmina.surveyengine.model.CustomerContact;

import java.util.List;

public interface ICustomerContactService {
    List<CustomerContact> getAll();
    CustomerContact save(CustomerContact customerContact);
    CustomerContact findByEmailCustomer(String emailContact, String customerName);
    void deleteCustomerContactMap(CustomerContact customerContact);
    CustomerContact findByCustomer(String customerName);
    List<CustomerContact> getAllMapsByUserEmail(String contactEmail);
}