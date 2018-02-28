package com.sanmina.surveyengine.service.impl;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import com.sanmina.surveyengine.model.CustomerSTAR;
import com.sanmina.surveyengine.service.ICustomerSTARService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerSTARService implements ICustomerSTARService {

    ObjectifyService objectifyService;

    @Override
    public List<CustomerSTAR> getAll() {
        return objectifyService.ofy().load().type(CustomerSTAR.class).list();
    }

    @Override
    public Long save(CustomerSTAR customerSTAR) {
        Key<CustomerSTAR> generatedKey = objectifyService.ofy().save().entity(customerSTAR).now();
        return generatedKey.getId();
    }

}
