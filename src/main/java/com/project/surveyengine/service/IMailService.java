package com.project.surveyengine.service;

import com.project.surveyengine.model.User;
import javax.mail.MessagingException;
import java.io.IOException;
import java.security.GeneralSecurityException;

public interface IMailService {
    void sendReminder(String[] recipients, String[] attachments, String subject, String description, String url) throws GeneralSecurityException, IOException, MessagingException;
    boolean sendSurvey(String[] recipients, String[] attachments, String subject, String description, String url) throws IOException, GeneralSecurityException, MessagingException;
    boolean sendReport(User contact, String contactAccess, String reportType) throws IOException, GeneralSecurityException, MessagingException;
    boolean sendEmail(String[] recipients, byte[] attachment, String subject, String body) throws GeneralSecurityException, IOException, MessagingException;
}
