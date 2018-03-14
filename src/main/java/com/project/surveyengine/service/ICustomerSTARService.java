package com.project.surveyengine.service;

import com.project.surveyengine.model.CustomerSTAR;
import java.util.List;

public interface ICustomerSTARService {

    public List<CustomerSTAR> getAll();

    public Long save(CustomerSTAR customerSTAR);

}
