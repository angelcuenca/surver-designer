package com.sanmina.surveyengine.service;

import com.sanmina.surveyengine.model.CustomerSTAR;
import java.util.List;

public interface ICustomerSTARService {

    public List<CustomerSTAR> getAll();

    public Long save(CustomerSTAR customerSTAR);

}
