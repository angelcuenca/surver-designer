package com.sanmina.surveyengine.model;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.sanmina.surveyengine.enumerable.InputType;
import com.sanmina.surveyengine.enumerable.ResponseStatus;

import java.time.LocalDate;
import java.util.*;

/**
 * Created by gerardo_martinez on 22/06/16.
 */
@Entity
public class Response {

    @Id
    public Long id;

    @Index
    public Long surveyId;

    @Index
    public List<Answer> answers = new ArrayList<>();

    @Index
    public ResponseStatus status;

    @Index
    public Date expirationDate;

    @Index
    public Date creationDate;

    @Index
    public int fiscalMonth;

    @Index
    public int fiscalYear;

    @Index
    public String customerCode;

    @Index
    public String generatedBy;

    @Index
    public String recipient;


    public Response() {
        this.answers = new ArrayList<>();
        this.creationDate = new Date();
        this.status = ResponseStatus.AWAITING;
    }

    public void addResponse(String id, String question, String answer, InputType type) {
        Answer response = new Answer();

        response.inputId = id;
        response.questionText = question;
        response.answer = answer;
        response.type = type;

        this.answers.add(response);
    }

    public List<Answer> getAnswers() {
        return this.answers;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSurveyId() {
        return surveyId;
    }

    public void setSurveyId(Long surveyId) {
        this.surveyId = surveyId;
    }

    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }

    public ResponseStatus getStatus() {
        return status;
    }

    public void setStatus(ResponseStatus status) {
        this.status = status;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public String getCustomerCode() {
        return customerCode;
    }

    public void setCustomerCode(String customerCode) {
        this.customerCode = customerCode;
    }

    public String getGeneratedBy() {
        return generatedBy;
    }

    public void setGeneratedBy(String generatedBy) {
        this.generatedBy = generatedBy;
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public int getFiscalMonth() { return fiscalMonth;}

    public void setFiscalMonth(int fiscalMonth) {
        this.fiscalMonth = fiscalMonth;
    }

    public int getFiscalYear() {
        return fiscalYear;
    }

    public void setFiscalYear(int fiscalYear) {
        this.fiscalYear = fiscalYear;
    }

    public Date getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(Date expirationDate) {
        this.expirationDate = expirationDate;
    }
}