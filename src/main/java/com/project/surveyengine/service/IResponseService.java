package com.project.surveyengine.service;

import com.project.surveyengine.enumerable.ResponseStatus;
import com.project.surveyengine.model.Response;

import java.util.List;

/**
 * Created by angel_cuenca on 19/07/16.
 */
public interface IResponseService {
    Response get(Long id);
    long save(Response response);
    List<Response> getAll();
    List<Response> getByEmail(String email);
    List<Response> getAwaitingResponsesbyContact(String contact);
    List<Response> getResponsesListByStatus(String contactToResend, ResponseStatus responseStatus);
    List<Response> getActiveResponsesbyContact(String contactToResend);
    List<Response> getAllActiveResponses();
}
