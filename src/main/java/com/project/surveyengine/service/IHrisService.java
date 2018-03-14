package com.project.surveyengine.service;


import com.project.surveyengine.model.HrisUser;

import java.util.List;

/**
 * Created by ulises_mancilla on 09/12/2014.
 */
public interface IHrisService {
    // HTTP POST request
    List<HrisUser> getUser(String employeeNumber, String userName, String name, String mail) throws Exception;
}
