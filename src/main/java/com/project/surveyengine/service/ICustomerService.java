package com.project.surveyengine.service;

import com.project.surveyengine.model.Customer;
import com.project.surveyengine.model.User;

import java.util.List;

public interface ICustomerService {

    List<Customer> getAll();

    List<User> getContactsByCustomerName(String customerName);

    Customer getCustomerByName(String name);

    Long save(Customer customer);

    void deleteCustomerByName(String customerName);

    List<Customer> getAllActiveCustomer();
}
