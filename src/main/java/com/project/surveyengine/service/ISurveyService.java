package com.project.surveyengine.service;

import com.project.surveyengine.model.Survey;

import java.util.List;

/**
 * Created by gerardo_martinez on 23/06/16.
 */
public interface ISurveyService {

    Survey get(long id);
    boolean getNameValidation(String name);
    List<Survey> getAll();
    Long getIdByName(String name);
    String getNameById(long id);
    long save(Survey survey);
    List<Survey> getByCreatedBy(String email);
    List<Survey> getByStatus(String status);
}
