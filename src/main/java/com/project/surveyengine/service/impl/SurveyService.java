package com.project.surveyengine.service.impl;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import com.project.surveyengine.model.Survey;
import com.project.surveyengine.model.User;
import com.project.surveyengine.service.ISurveyService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by project on 23/06/16.
 */
@Service
public class SurveyService implements ISurveyService {

    ObjectifyService objectifyService;

    @Override
    public Survey get(long id){
        for(Survey survey: ObjectifyService.ofy().load().type(Survey.class).list()) {
            if( survey.getId() == id ){
                return survey;
            }
        }
        return null;
    }

    @Override
    public List<Survey> getAll() {

        return ObjectifyService.ofy().load().type(Survey.class).list();
    }

    @Override
    public List<Survey> getByStatus(String status){
        return  ObjectifyService.ofy().load().type(Survey.class).filter("status", status).list();
    }

    @Override
    public List<Survey> getByCreatedBy(String email){
        return  ObjectifyService.ofy().load().type(Survey.class).ancestor(Key.create(User.class, email)).list();
    }

    @Override
    public boolean getNameValidation(String name){
      List <Survey> list = ObjectifyService.ofy().load().type(Survey.class).list();
      boolean result = false;
      for (Survey s: list) {
        if (s.getName().equals(name))
          result = true;
      }
      return  result;
    }

    @Override
    public Long getIdByName(String name){
      return ObjectifyService.ofy().load().type(Survey.class).filter("name",name).first().now().getId();
    }

    @Override
    public String getNameById(long id) {
      for (Survey s: ObjectifyService.ofy().load().type(Survey.class).list()) {
        if(s.getId()==(id)){
          return s.getName();
        }
      }
      return null;
    }

    @Override
    public long save(Survey survey) {
      Key<Survey> generatedKey = objectifyService.ofy().save().entity(survey).now();
      return generatedKey.getId();
    }
}
