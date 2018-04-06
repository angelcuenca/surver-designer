package com.project.surveyengine.model;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.project.surveyengine.enumerable.SurveyStatus;

import java.util.Date;

/**
 * Created by project on 9/06/16.
 */
@Entity
public class Survey {
  @Id
  @Index
  public Long id;

  @Index
  public String name;

  public String xmlContent;

  public Date expirationDate;

  public boolean enableResponseReminder;

  public boolean enableExpirationReminder;

  @Index
  public boolean enableApproval;

  @Index
  public SurveyStatus status;

  @Index
  public String createdBy;

  public Date creationDate;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getXmlContent() {
    return xmlContent;
  }

  public void setXmlContent(String xmlContent) {
    this.xmlContent = xmlContent;
  }

  public SurveyStatus getStatus() {
    return status;
  }

  public void setStatus(SurveyStatus status) {
    this.status = status;
  }

  public String getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(String createdBy) {
    this.createdBy = createdBy;
  }

  public Date getCreationDate() {
    return creationDate;
  }

  public void setCreationDate(Date creationDate) {
    this.creationDate = creationDate;
  }

  public Date getExpirationDate() {
    return expirationDate;
  }

  public void setExpirationDate(Date expirationDate) {
    this.expirationDate = expirationDate;
  }

  public Boolean getEnableResponseReminder() {
    return enableResponseReminder;
  }

  public Boolean getEnableExpirationReminder() {
    return enableExpirationReminder;
  }


  public void setEnableResponseReminder(Boolean enableResponseReminder) {
    this.enableResponseReminder = enableResponseReminder;
  }

  public void setEnableExpirationReminder(Boolean enableExpirationReminder) {
    this.enableExpirationReminder = enableExpirationReminder;
  }

  public boolean isEnableResponseReminder() {
    return enableResponseReminder;
  }

  public boolean isEnableExpirationReminder() {
    return enableExpirationReminder;
  }

  public boolean getEnableApproval() {
    return enableApproval;
  }

  public void setEnableApproval(boolean enableApproval) {
    this.enableApproval = enableApproval;
  }

  public Survey(){
    this.status = SurveyStatus.DRAFT;
    this.creationDate = new Date();
  }

  public Survey(String name, String xmlContent, boolean enableResponseReminder, boolean enableApproval, boolean enableExpirationReminder, SurveyStatus status, String createdBy){
    this.name = name;
    this.xmlContent = xmlContent;
    this.enableResponseReminder = enableResponseReminder;
    this.enableExpirationReminder = enableExpirationReminder;
    this.enableApproval = enableApproval;
    this.status = status;
    this.creationDate = new Date();
    this.createdBy = createdBy;
  }

  public Survey(Long id) {
    this.id = id;
  }
}
