package com.sanmina.surveyengine.controller;

import com.google.gson.Gson;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.cmd.Query;
import com.sanmina.surveyengine.model.Customer;
import com.sanmina.surveyengine.model.CustomerContact;
import com.sanmina.surveyengine.model.PatsTable;
import com.sanmina.surveyengine.model.User;
import com.sanmina.surveyengine.service.impl.CustomerContactService;
import com.sanmina.surveyengine.service.impl.CustomerService;
import com.sanmina.surveyengine.service.impl.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Controller
public class CustomerContactController {
    @Autowired
    @Qualifier("userService")
    private UserService userService;

    @Autowired
    @Qualifier("customerContactService")
    private CustomerContactService customerContactService;

    @Autowired
    @Qualifier("customerService")
    private CustomerService customerService;

    @RequestMapping(value = "/admin/customer-contact", method = RequestMethod.GET)
    public String customerContactView(Model model){
        return "customer-contact";
    }

    @RequestMapping(value = "/admin/get/customer/contact/mapping", method = RequestMethod.GET)
    public void getRoles(HttpServletRequest request, HttpServletResponse response) throws IOException {
        //Get email from Session
        String emailUerLogged = (String) SecurityContextHolder.getContext().getAuthentication().getCredentials();

        PatsTable table = new PatsTable();

        //Get Users
        Query<CustomerContact> result = ObjectifyService.ofy().load().type(CustomerContact.class);

        //Set values
        table.setDataCustomerContact(result.list());
        table.setEmailUerLogged(emailUerLogged);

        String json = new Gson().toJson(table);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }

    @RequestMapping(value = "/admin/save/customer/contact/mapping", method = RequestMethod.POST)
    public void saveCustomerContactMap(HttpServletRequest request,
                              HttpServletResponse response,
                              String contactEmail,
                              String dataCustomersSelected) throws Exception {

        List<String> customersList = Arrays.asList(dataCustomersSelected.split(","));
        boolean mappingsSaved = true;
        String status = "";
        String listBadMappings = "";

        //Iterate each customer to save map
        for(String customerName : customersList) {

            CustomerContact newCustomerContact = new CustomerContact();
            CustomerContact customerContactRegistered = customerContactService.findByEmailCustomer(contactEmail, customerName);
            User registered = userService.findByEmail(contactEmail);

            if( customerContactRegistered == null ){
                //Add Customer to Customers Catalog
                Customer customer = customerService.getCustomerByName(customerName);
                if( customer == null ){

                    Customer newCustomer = new Customer();
                    List<User> userList = new ArrayList<>();
                    User user = userService.findByEmail(contactEmail);
                    userList.add(user);

                    newCustomer.setActive(true);
                    newCustomer.setName(customerName);
                    newCustomer.setContactList(userList);

                    customerService.save(newCustomer);
                }else{
                    List<User> userList = customer.getContactList();
                    userList.add(userService.findByEmail(contactEmail));
                    customer.setContactList(userList);

                    customerService.save(customer);
                }

                //New mapping (no existing contact registered)
                newCustomerContact.setContactEmail(contactEmail);
                newCustomerContact.setCustomerName(customerName);
                newCustomerContact.setContactRoles(registered.roles);
                newCustomerContact.setContactName(registered.name);

                customerContactService.save(newCustomerContact);

            }else {
                mappingsSaved = false;
                listBadMappings += customerName+ ". ";
            }
        }

        if( ! mappingsSaved ){
            status = "Contact already has a mapping with customer(s) "+ listBadMappings;
        }else{
            status = "Mapping correctly saved.";
        }

        String json = new Gson().toJson( status );
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }

    @RequestMapping(value = "/admin/edit/customer/contact/mapping", method = RequestMethod.POST)
    public void editCustomerContactMap(HttpServletRequest request,
                                       HttpServletResponse response,
                                       String contactEmail,
                                       String customerSelected,
                                       String customerPrevious) throws Exception {
        String status;
        CustomerContact customerContactRegistered = customerContactService.findByEmailCustomer(contactEmail, customerSelected);

        if( customerContactRegistered == null ){
            //Edit Contact / Customer map
            customerContactRegistered = customerContactService.findByEmailCustomer(contactEmail, customerPrevious);
            customerContactRegistered.setCustomerName(customerSelected);
            customerContactService.save(customerContactRegistered);

            //Changes in Customer Catalog
            CustomerContact customerWithMap = customerContactService.findByCustomer(customerPrevious);
            if( customerWithMap == null ){
                //Remove if previous Customer has not more mappings
                customerService.deleteCustomerByName(customerPrevious);
            }else{
                //Remove previous mapping
                Customer customerRemoveMap = customerService.getCustomerByName(customerPrevious);
                List<User> userList = customerRemoveMap.getContactList();
                userList.remove(userService.findByEmail(contactEmail));
                customerRemoveMap.setContactList(userList);

                customerService.save(customerRemoveMap);
            }

            //Add Customer to Customers Catalog
            Customer customer = customerService.getCustomerByName(customerSelected);
            if( customer != null ){
                List<User> userList = customer.getContactList();
                userList.add(userService.findByEmail(contactEmail));
                customer.setContactList(userList);

                customerService.save(customer);
            }else{
                Customer newEditCustomer = new Customer();
                User user = userService.findByEmail(contactEmail);
                List<User> userList = new ArrayList<>();
                userList.add(user);

                newEditCustomer.setActive(true);
                newEditCustomer.setName(customerSelected);
                newEditCustomer.setContactList(userList);

                customerService.save(newEditCustomer);
            }

            status = "Mapping correctly edited.";
        }else{
            status = "Contact already has a mapping with customer "+customerSelected;
        }

        String json = new Gson().toJson( status );
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }

    @RequestMapping(value = "/admin/delete/customer/contact/mapping", method = RequestMethod.POST)
    public void deleteUser(HttpServletRequest request,
                           HttpServletResponse response, String contactEmail, String customerName) throws Exception {

        String status;
        CustomerContact customerContact = customerContactService.findByEmailCustomer(contactEmail, customerName);
        customerContactService.deleteCustomerContactMap(customerContact);
        status = "Customer "+ customerName +" mapped with "+contactEmail+ " correctly deleted.";

        //Remove Customer from Customer Catalog if no has any mappings
        CustomerContact registeredCustomerContact = customerContactService.findByCustomer(customerName);
        if( registeredCustomerContact == null ){
            customerService.deleteCustomerByName(customerName);
        }

        String json = new Gson().toJson( status );
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }
}
