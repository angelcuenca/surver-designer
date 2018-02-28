package com.sanmina.surveyengine.service.impl;

import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.html2pdf.css.media.MediaDeviceDescription;
import com.itextpdf.html2pdf.css.media.MediaType;
import com.itextpdf.io.source.ByteArrayOutputStream;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.sanmina.surveyengine.controller.SurveyController;
import com.sanmina.surveyengine.model.Timeline;
import com.sanmina.surveyengine.model.User;
import com.sanmina.surveyengine.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.*;
import javax.mail.internet.*;
import javax.mail.util.ByteArrayDataSource;
import java.io.*;
import java.net.URL;
import java.security.GeneralSecurityException;
import java.time.LocalDate;
import java.util.*;
import java.util.logging.Logger;

@Service
public class MailService implements IMailService {

    @Autowired
    UserService userService;

    boolean result=false;
    private static final Logger log = Logger.getLogger(SurveyController.class.getName());

    @Override
    public void sendReminder(String[] recipient, String[] attachments, String contact, String expirationDate, String url)
                throws GeneralSecurityException, IOException, MessagingException {

        //Get sending template file
        FileInputStream inputStream;
        ClassLoader classLoader = this.getClass().getClassLoader();
        File configFile = new File(classLoader.getResource("email_templates/new-survey.html").getFile());
        inputStream = new FileInputStream(configFile);
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        String content = org.apache.commons.io.IOUtils.toString(reader);
        reader.close();

        String templateSurvey = content;
        templateSurvey = templateSurvey.replaceAll("@contact", contact);
        templateSurvey = templateSurvey.replaceAll("@expirationDate", expirationDate);
        templateSurvey = templateSurvey.replaceAll("@url", url);

        String month = LocalDate.parse(expirationDate).getMonth().toString();
        String year = String.valueOf(LocalDate.parse(expirationDate).getYear());
        String title = "Customer Satisfaction Overview - Survey Response Reminder " + month + " " + year;

        result = sendEmail(recipient, null, title, templateSurvey);
    }

    @Override
    public boolean sendSurvey(String[] recipient, String[] attachments, String contact, String expirationDate, String url)
                            throws IOException, GeneralSecurityException, MessagingException {

        //Get sending template file
        FileInputStream inputStream;
        ClassLoader classLoader = this.getClass().getClassLoader();
        File configFile = new File(classLoader.getResource("email_templates/new-survey.html").getFile());
        inputStream = new FileInputStream(configFile);
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        String content = org.apache.commons.io.IOUtils.toString(reader);
        reader.close();

        String templateSurvey = content;
        templateSurvey = templateSurvey.replaceAll("@contact", contact);
        templateSurvey = templateSurvey.replaceAll("@expirationDate", expirationDate);
        templateSurvey = templateSurvey.replaceAll("@url", url);

        String month = LocalDate.parse(expirationDate).getMonth().toString();
        String year = String.valueOf(LocalDate.parse(expirationDate).getYear());
        String title = "Customer Satisfaction Overview - New Survey " + month + " " + year;

        result = sendEmail(recipient, null, title, templateSurvey);
        return result;
    }

    @Override
    public boolean sendReport(User contact, String contactAccess, String reportType)
            throws IOException, GeneralSecurityException, MessagingException {

        LocalDate localDate = LocalDate.now();
        Timeline timeline = new Timeline(localDate);
        String month = localDate.withMonth(timeline.getFiscalMonth()).getMonth().toString();
        String year = String.valueOf(timeline.getFiscalYear());
        String[] recipient = {contact.getEmail()};
        byte[] bytesPDF = null;
        String reportUrl = "";

        FileInputStream inputStream;
        ClassLoader classLoader = this.getClass().getClassLoader();
        File configFile = new File(classLoader.getResource("email_templates/report.html").getFile());
        inputStream = new FileInputStream(configFile);
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        String content = org.apache.commons.io.IOUtils.toString(reader);
        reader.close();

        String templateReport = content;
        templateReport = templateReport.replaceAll("@date", month + " " + year );
        templateReport = templateReport.replaceAll("@contactName", contact.getName());

        String subject= "Customer Satisfaction Overview - ";

        if (contactAccess.equals("ROLE_TAKER") ){
            subject += "Pre-Report " + month + " " + year;
            reportUrl = "https://sanm-gcp-gae-qisdev.appspot.com/reports/pre-report?contact=" + contact.getId();
            templateReport = templateReport.replaceAll("@reportType", "Pre-Report");
            templateReport = templateReport.replaceAll("@description", "This notification provides the link for you to review your customer ratings in advance of compilation of the final report.");
            templateReport = templateReport.replaceAll("@url", reportUrl);
        }

        if (contactAccess.equals("ROLE_OTHER_REPORTEE") || contactAccess.equals("ROLE_EXECUTIVE")){
            String report = contactAccess.equals("ROLE_OTHER_REPORTEE") ? "final-report" : "final-executive-report";
            subject += "Final Report " + month + " " + year;
            reportUrl = "https://sanm-gcp-gae-qisdev.appspot.com/reports/"+ report + "?contact=" + contact.getId();
            templateReport = templateReport.replaceAll("@reportType", "Final Report");
            templateReport = templateReport.replaceAll("@url", reportUrl);
            templateReport = templateReport.replaceAll("@description", contactAccess.equals("ROLE_OTHER_REPORTEE")? "This notification provides the link for you to review your customer ratings.": "This notification provides the link for you to view the Final Customer Satisfaction Overview (CSO) Report.");
        }

        /*if (reportType.equals("final-report")){
            String TARGET = "target/";
            String DEST = String.format("TEST.pdf", TARGET);
            bytesPDF = createPdf(new URL(reportUrl), DEST);
        }*/

        result = sendEmail(recipient, bytesPDF, subject, templateReport);
        return result;
    }

    public boolean sendEmail(String[] recipients, byte[] bytesPDF, String subject, String body)
                        throws GeneralSecurityException, IOException, MessagingException {

        Properties properties = new Properties();
        Session session = Session.getDefaultInstance(properties, null);
        session.setDebug(true);

        javax.mail.Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress("noreply@sanmina.com","survey.engine@sanmina.com"));
        message.setReplyTo(InternetAddress.parse("survey.engine@sanmina.com", false));

        Address[] to = new Address[recipients.length];
        for (int i=0; i<recipients.length; i++) {
            to[i] = new InternetAddress(recipients[i]);
        }

        message.setRecipients(Message.RecipientType.TO, to);
        message.setSubject(subject);

        MimeMultipart multipart = new MimeMultipart();
        MimeBodyPart htmlPart = new MimeBodyPart();
        htmlPart.setContent(body, "text/html; charset=utf-8");
        multipart.addBodyPart(htmlPart);

        if (bytesPDF != null){
            MimeBodyPart attachment = new MimeBodyPart();
            DataSource source = new ByteArrayDataSource(bytesPDF, "application/pdf");
            attachment.setFileName("Final Report " + new Date().toString() + ".pdf");
            attachment.setDataHandler(new DataHandler(source));
            multipart.addBodyPart(attachment);
        }

        message.setContent(multipart);
        message.saveChanges();

        Transport.send(message);

        return true;
    }

    public byte[] createPdf(URL url, String dest) throws IOException {

        com.itextpdf.io.source.ByteArrayOutputStream doc = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(doc);
        PdfDocument pdf = new PdfDocument(writer);
        PageSize pageSize = new PageSize(850, 1700);
        pdf.setDefaultPageSize(pageSize);
        ConverterProperties properties = new ConverterProperties();
        MediaDeviceDescription mediaDeviceDescription = new MediaDeviceDescription(MediaType.SCREEN);
        mediaDeviceDescription.setWidth(pageSize.getWidth());
        properties.setMediaDeviceDescription(mediaDeviceDescription);
        HtmlConverter.convertToPdf(url.openStream(), pdf, properties);

        return doc.toByteArray();
    }

}
