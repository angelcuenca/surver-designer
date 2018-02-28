package com.sanmina.surveyengine.controller;

import com.google.gson.Gson;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.cmd.Query;
import com.sanmina.surveyengine.model.Customer;
import com.sanmina.surveyengine.model.CustomerExternalRating;
import com.sanmina.surveyengine.service.impl.CustomerExternalRatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Controller
public class CustomerExternalRatingController {

    @Autowired
    private CustomerExternalRatingService customerExternalRatingService;

    @RequestMapping(value = "/admin/customer-external-rating", method = RequestMethod.GET)
    public String customerExternalRatingView(Model model){
        return "customerexternalrating";
    }

    @RequestMapping(value = "/admin/get/all/customer-external-rating", method = RequestMethod.GET)
    public void getAllCustomerExternalRating(HttpServletRequest request, HttpServletResponse response) throws IOException {

        //Get all Customer external rating
        List<CustomerExternalRating> customerExternalRatingList = customerExternalRatingService.getAll();

        String json = new Gson().toJson(customerExternalRatingList);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }

    @RequestMapping(value = "/admin/get/one/customer-external-rating", method = RequestMethod.POST)
    public void getOneCustomerExternalRating(HttpServletRequest request, HttpServletResponse response) throws IOException {

        String customer = request.getParameter("customer");

        //Get all Customer external rating
        CustomerExternalRating customerExternalRating = customerExternalRatingService.findCustomerExternalRatingByCustomer(customer);

        String json = new Gson().toJson(customerExternalRating);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }

    @RequestMapping(value = "/admin/save/customer-external-rating", method = RequestMethod.POST)
    public void saveCustomerExternalRating(HttpServletRequest request,
                                       HttpServletResponse response) throws Exception {
        String status = "";
        String month = request.getParameter("month");
        String year = request.getParameter("year");;
        String customer = request.getParameter("customer");
        String ratingType = request.getParameter("ratingType");
        String rating = request.getParameter("rating");;
        String ratingPeriod = request.getParameter("ratingPeriod");

        CustomerExternalRating customerExternalRating;
        customerExternalRating = customerExternalRatingService.findCustomerExternalRatingByCustomer(customer);

        if( customerExternalRating == null ){
            CustomerExternalRating newCustomerExternalRating = new CustomerExternalRating();

            newCustomerExternalRating.setCustomer(customer);
            newCustomerExternalRating.setMonth(month);
            newCustomerExternalRating.setRating(rating);
            newCustomerExternalRating.setRatingPeriod(ratingPeriod);
            newCustomerExternalRating.setYear(year);
            newCustomerExternalRating.setRatingType(ratingType);

            customerExternalRatingService.save(newCustomerExternalRating);
            status = "Customer External Rating correctly saved";
        }else {
            status = "Customer External Rating is already created.";
        }

        String json = new Gson().toJson( status );
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }

    @RequestMapping(value = "/admin/update/customer-external-rating", method = RequestMethod.POST)
    public void updateCustomerExternalRating(HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        String status = "";
        String month = request.getParameter("month");
        String year = request.getParameter("year");;
        String customer = request.getParameter("customer");
        String ratingType = request.getParameter("ratingType");
        String rating = request.getParameter("rating");;
        String ratingPeriod = request.getParameter("ratingPeriod");

        CustomerExternalRating customerExternalRating = customerExternalRatingService.findCustomerExternalRatingByCustomer(customer);

        customerExternalRating.setMonth(month);
        customerExternalRating.setRating(rating);
        customerExternalRating.setRatingPeriod(ratingPeriod);
        customerExternalRating.setYear(year);
        customerExternalRating.setRatingType(ratingType);

        customerExternalRatingService.save(customerExternalRating);
        status = "Customer External Rating for "+ customer +" correctly updated.";

        String json = new Gson().toJson( status );
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }

    @RequestMapping(value = "/admin/remove/customer-external-rating", method = RequestMethod.POST)
    public void deleteCustomerExternalRating(HttpServletRequest request,
                               HttpServletResponse response) throws Exception {

        String status = "";
        String customer = request.getParameter("customer");
        CustomerExternalRating customerExternalRating = customerExternalRatingService.findCustomerExternalRatingByCustomer(customer);
        customerExternalRatingService.deleteCustomerExternalRating(customerExternalRating);
        status = "Customer External Rating from "+ customer + " correctly deleted";

        String json = new Gson().toJson( status );
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }
}
