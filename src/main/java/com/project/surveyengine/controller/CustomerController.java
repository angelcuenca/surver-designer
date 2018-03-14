package com.project.surveyengine.controller;

import com.google.gson.Gson;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.cmd.Query;
import com.project.surveyengine.model.Customer;
import com.project.surveyengine.model.CustomerSTAR;
import com.project.surveyengine.model.PatsTable;
import com.project.surveyengine.service.ICustomerSTARService;
import com.project.surveyengine.service.ICustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Controller
public class CustomerController {

    @Autowired
    private ICustomerService customerService;

    @Autowired
    private ICustomerSTARService customerSTARService;

    @RequestMapping(value = "/customerSTAR", method = RequestMethod.POST)
    public void customerSTAR(HttpServletResponse response,
                             @RequestParam("Customer Name") String customerName,
                             @RequestParam("Customer Number") String customerCode,
                             @RequestParam("Master Customer Number") String masterCustomerCode,
                             @RequestParam("Master Customer Name") String masterCustomerName) throws IOException {

        System.out.println(customerName);

        CustomerSTAR customerSTAR = new CustomerSTAR();
        customerSTAR.setCode(customerCode);
        customerSTAR.setName(customerName);
        customerSTAR.setMasterCustomerCode(masterCustomerCode);
        customerSTAR.setMasterCustomerName(masterCustomerName);

        customerSTARService.save(customerSTAR);

        String json = new Gson().toJson("customer saved");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }

    @RequestMapping(value = "/admin/customers", method = RequestMethod.GET)
    public String customersView(Model model){
        return "customers";
    }

    @RequestMapping(value = "/admin/get-all-customers", method = RequestMethod.GET)
    public void getCustomers(HttpServletRequest request, HttpServletResponse response) throws IOException {
        //Get email from Session
        String emailUerLogged = (String) SecurityContextHolder.getContext().getAuthentication().getCredentials();
        PatsTable table = new PatsTable();

        //Get all Customer rows
        List<Customer> customerList = customerService.getAll();

        //Set values
        table.setDataCustomers(customerList);
        table.setEmailUerLogged(emailUerLogged);

        String json = new Gson().toJson(table);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }

    @RequestMapping(value = "/admin/get/customers-from-star", method = RequestMethod.GET)
    public void getCustomersFromStar(HttpServletRequest request, HttpServletResponse response) throws IOException {

        List<CustomerSTAR> customerSTARList = customerSTARService.getAll();

        String json = new Gson().toJson(customerSTARList);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }

    @RequestMapping(value = "/admin/update/customer", method = RequestMethod.GET)
    public void updateCustomer(HttpServletRequest request, HttpServletResponse response, @RequestParam("customerName") String customerName) throws IOException {

        PatsTable table = new PatsTable();

        //Change isActive for Customer Name
        Customer customerUpdated = customerService.getCustomerByName(customerName);
        if( customerUpdated.isActive() ){
            customerUpdated.setActive(false);
        }else{
            customerUpdated.setActive(true);
        }
        customerService.save(customerUpdated);

        //Get info updated
        Query<Customer> result = ObjectifyService.ofy().load().type(Customer.class);

        //Set values
        table.setDataCustomers(result.list());

        String json = new Gson().toJson(table);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }

    @RequestMapping(value = "/admin/remove/customer", method = RequestMethod.POST)
    public void deleteCustomer(HttpServletRequest request,
                           HttpServletResponse response, String customerName) throws Exception {

        customerService.deleteCustomerByName(customerName);

        String json = new Gson().toJson( "success" );
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }
}