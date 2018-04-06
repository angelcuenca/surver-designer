package com.project.surveyengine.service;

import com.project.surveyengine.model.Response;

import java.text.ParseException;
import java.util.List;

/**
 * Created by project on 23/06/16.
 */
public interface IAnswerService {

  List<Response> getAllSurveys();

  List<Response> getListAnsByMonth(String year,String month) throws ParseException;

  List<Response> getListAnsByCodeCustomer(String year,String month, Long code);

  String getResponser();

  List <Response> getFileAnswers();

}
