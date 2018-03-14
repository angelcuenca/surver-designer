package com.project.surveyengine.service.impl;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import com.project.surveyengine.model.Customer;
import com.project.surveyengine.model.User;
import com.project.surveyengine.service.ICustomerService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CustomerService implements ICustomerService {

    ObjectifyService objectifyService;

    @Override
    public List<Customer> getAll() {
        return objectifyService.ofy().load().type(Customer.class).list();
    }

    @Override
    public List<Customer> getAllActiveCustomer(){
        return objectifyService.ofy().load().type(Customer.class).filter("isActive",true).list();
    }

    @Override
    public List<User> getContactsByCustomerName(String customerName) {
        Customer customer =  this.getCustomerByName(customerName);
        return  customer.getContactList();
    }

    @Override
    public Customer getCustomerByName(String name) {
        Customer c = objectifyService.ofy().load().type(Customer.class).filter("customerName",name).first().now();
        return c;
    }

    @Override
    public Long save(Customer customer) {
        Key<Customer> generatedKey = objectifyService.ofy().save().entity(customer).now();
        return generatedKey.getId();
    }

    @Override
    public void deleteCustomerByName(String customerName) {
        objectifyService.ofy().delete().entity(this.getCustomerByName(customerName)).now();
    }
}
