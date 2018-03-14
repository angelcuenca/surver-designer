package com.project.surveyengine.service.impl;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import com.project.surveyengine.enumerable.ResponseStatus;
import com.project.surveyengine.model.Response;
import com.project.surveyengine.service.IResponseService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by angel_cuenca on 19/07/16.
 */
@Service
public class ResponseService implements IResponseService {

    ObjectifyService objectifyService;

    @Override
    public Response get(Long id) {
        return objectifyService.ofy().load().key(Key.create(Response.class, id)).now();
    }

    @Override
    public long save(Response response) {
        Key<Response> generatedKey = objectifyService.ofy().save().entity(response).now();
        return generatedKey.getId();
    }

    @Override
    public List<Response> getAwaitingResponsesbyContact(String contactToResend) {
        List<ResponseStatus> responseStatusList = new ArrayList<>();
        responseStatusList.add(ResponseStatus.AWAITING);
        List<Response> awaitingResponses = objectifyService.ofy().load().type(Response.class).filter("recipient", contactToResend).filter("status IN", responseStatusList).list();

        return awaitingResponses;
    }

    @Override
    public List<Response> getResponsesListByStatus(String contactToResend, ResponseStatus responseStatus){
        List<ResponseStatus> responseStatusList = new ArrayList<>();
        responseStatusList.add(responseStatus);
        List<Response> responsesList = objectifyService.ofy().load().type(Response.class).filter("recipient", contactToResend).filter("status IN", responseStatusList).list();

        return responsesList;
    }

    @Override
    public List<Response> getActiveResponsesbyContact(String contactToResend) {
        List<ResponseStatus> responseStatusList = new ArrayList<>();
        responseStatusList.add(ResponseStatus.AWAITING);
        responseStatusList.add(ResponseStatus.SUBMITTED);
        List<Response> awaitingResponses = objectifyService.ofy().load().type(Response.class).filter("recipient", contactToResend).filter("status IN", responseStatusList).list();

        return awaitingResponses;
    }

    @Override
    public List<Response> getAllActiveResponses() {
        List<ResponseStatus> responseStatusList = new ArrayList<>();
        responseStatusList.add(ResponseStatus.AWAITING);
        responseStatusList.add(ResponseStatus.SUBMITTED);
        List<Response> awaitingResponses = objectifyService.ofy().load().type(Response.class).filter("status IN", responseStatusList).list();

        return awaitingResponses;
    }

    @Override
    public List<Response> getAll() {
        return ObjectifyService.ofy().load().type(Response.class).list();
    }

    @Override
    public List<Response> getByEmail(String email){
        return  ObjectifyService.ofy().load().type(Response.class).filter("recipient",email).list();
    }
}
