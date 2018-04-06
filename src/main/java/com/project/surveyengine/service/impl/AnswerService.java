package com.project.surveyengine.service.impl;

import com.googlecode.objectify.ObjectifyService;
import com.project.surveyengine.enumerable.ResponseStatus;
import com.project.surveyengine.model.Response;
import com.project.surveyengine.service.IAnswerService;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;

/**
 * Created by project on 23/06/16.
 */
@Service
public class AnswerService implements IAnswerService {
  @Override
  public List<Response> getAllSurveys() {
    return ObjectifyService.ofy().load().type(Response.class).list();
  }

  @Override
  public List<Response> getFileAnswers() {
    return ObjectifyService.ofy().load().type(Response.class)
            .filter("answers.type","FILE").list();
  }

  @Override
  public List<Response> getListAnsByMonth(String year,String month) {
    return ObjectifyService.ofy().load().type(Response.class)
            .filter("creationDate >=",new Date((Integer.parseInt(year)-1900),Integer.parseInt(month),1))
            .filter("creationDate <=",new Date((Integer.parseInt(year)-1900),Integer.parseInt(month),31))
            .filter("status", ResponseStatus.SUBMITTED).list();
  }

  @Override
  public List<Response> getListAnsByCodeCustomer(String year,String month, Long code) {
    return ObjectifyService.ofy().load().type(Response.class)
            .filter("creationDate >=",new Date((Integer.parseInt(year)-1900),Integer.parseInt(month),1))
            .filter("creationDate <=",new Date((Integer.parseInt(year)-1900),Integer.parseInt(month),31))
            .filter("customerCode",code)
            .filter("status",ResponseStatus.SUBMITTED).list();
  }

  @Override
  public String getResponser() {
    return null;
  }
}
