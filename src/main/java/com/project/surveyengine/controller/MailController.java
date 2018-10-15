package com.project.surveyengine.controller;

import com.project.surveyengine.enumerable.SurveyStatus;
import com.project.surveyengine.model.*;
import com.project.surveyengine.service.*;
import com.project.surveyengine.model.*;
import com.project.surveyengine.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import javax.mail.MessagingException;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.logging.Logger;

@Controller
public class MailController {

    @Autowired
    IMailService mailService;

    @Autowired
    ICustomerService customerService;

    @Autowired
    IResponseService responseService;

    @Autowired
    IRoleService roleService;

    @Autowired
    ISurveyService surveyService;

    private static final Logger log = Logger.getLogger(MailController.class.getName());


    @RequestMapping(value = "/mail", method = RequestMethod.GET)
    public String mail(){
        return "mail";
    }

    @RequestMapping(value = "/mail", method = RequestMethod.POST)
    public String another(@RequestParam(value= "recipients", required=false) String recipients,
                          @RequestParam(value= "subject", required=false) String subject,
                          @RequestParam(value= "description", required=false) String description,
                          @RequestParam(value= "url", required=false) String url,
                          @RequestParam(value= "file", required=false) String file,
                          Model model) throws IOException, MessagingException, GeneralSecurityException {

        StringTokenizer list = new StringTokenizer(recipients, ",");
        String[] recipientsList = new String[list.countTokens()];

        int numElements= list.countTokens();
        for(int i=0; i<numElements; i++){
            recipientsList[i] = list.nextElement().toString();
        }

        //Implement if attachments are required
        String[] attachFiles = new String[0];

        boolean mailSent = mailService.sendSurvey(recipientsList, attachFiles, subject, description, url);
        if(mailSent){
            model.addAttribute("answer", "Mail was sent.");
        }else{
            model.addAttribute("answer", "Mail was not sent.");
        }

        return "mail";
    }

    @RequestMapping(value = {"/mail/new-survey"}, method = RequestMethod.GET)
    public String sendNewSurvey() throws IOException, GeneralSecurityException, MessagingException, ParseException {

        Timeline timeline = new Timeline(LocalDate.now());

        //if (LocalDate.now().toString().equals(timeline.getSendSurvey())) {
        List<Survey> publishedSurveys = surveyService.getByStatus(SurveyStatus.PUBLISHED.toString());
        List<Customer> customers = customerService.getAllActiveCustomer();

        LocalTime midnight = LocalTime.MIDNIGHT;
        LocalDateTime exipirationLocalDate = LocalDateTime.of(LocalDate.parse(timeline.getExpiration()), midnight.minusSeconds(1));

        DateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US);
        format.setTimeZone(TimeZone.getTimeZone("CST"));
        Date expirationDate = format.parse(exipirationLocalDate.toString());
        Set<User> contactsMailed = new HashSet<>();
        //Implement if attachments are required
        String[] attachFiles = new String[0];

        if (publishedSurveys != null && customers != null) {
            for (Survey survey : publishedSurveys) {
                for (Customer customer : customers) {
                    List<User> contacts = customer.getContactList();
                    if (contacts != null) {
                        for (User contact : contacts) {
                            if (contact.isActive()) {
                                Response response = new Response();
                                response.setSurveyId(survey.getId());
                                response.setCustomerCode(customer.getName());
                                response.setRecipient(contact.getEmail());
                                response.setFiscalMonth(timeline.getFiscalMonth());
                                response.setFiscalYear(timeline.getFiscalYear());
                                response.setExpirationDate(expirationDate);
                                long responseId = responseService.save(response);

                                boolean contactMailed = contactsMailed.stream().anyMatch(
                                        contactMatch -> contactMatch.getEmail().equals(contact.getEmail()));

                                if (!contactMailed) {
                                    String url = "https://survey-designer.appspot.com/survey/" + survey.getId() + "/response/" + responseId;
                                    String[] recipient = new String[1];
                                    recipient[0] = contact.getEmail();

                                    mailService.sendSurvey(recipient, attachFiles, contact.getName(), timeline.getExpiration(), url);
                                    contactsMailed.add(contact);
                                }
                                System.out.println("Response id:" + responseId);
                            }
                        }
                    } else {
                        System.out.println("Empty contact list for customer: " + customer.getName());
                    }
                }
            }
        } else {
            System.out.println("Data not found");
        }
        //}

        return "home";
    }

    @RequestMapping(value = {"/mail/report"}, method = RequestMethod.GET)
    public String sendReport() throws IOException, GeneralSecurityException, MessagingException {

        Timeline timeline = new Timeline(LocalDate.now());
        String localDate = LocalDate.now().toString();
        boolean preReport = localDate.equals(timeline.getPreReport());
        boolean finalReport = localDate.equals(timeline.getFinalReport());
        Set<User> contactsMailedPreReport = new HashSet<>();
        Set<User> contactsMailedFinalReport = new HashSet<>();

        preReport = true;
        if (preReport || finalReport){
            List<Survey> publishedSurveys = surveyService.getByStatus(SurveyStatus.PUBLISHED.toString());
            List<Customer> customers = customerService.getAllActiveCustomer();

            if (publishedSurveys != null && customers != null) {
                for (Customer customer : customers) {
                    List<User> contacts = customer.getContactList();
                    if (contacts != null) {
                        for (User contact : contacts) {
                            boolean isOtherReportee, contactMailed;

                            isOtherReportee = contact.getRoles().stream().anyMatch(
                                    role -> role.name.equals("ROLE_OTHER_REPORTEE"));

                            if (preReport){
                                contactMailed = contactsMailedPreReport.stream().anyMatch(
                                        contactMatch -> contactMatch.getEmail().equals(contact.getEmail()));
                            }else {
                                contactMailed = contactsMailedFinalReport.stream().anyMatch(
                                        contactMatch -> contactMatch.getEmail().equals(contact.getEmail()));
                            }

                            if(!contactMailed) {
                                String reportType = preReport ? "pre-report" : "final-report";
                                String contactAccess = finalReport ? isOtherReportee ? "ROLE_OTHER_REPORTEE": "ROLE_EXECUTIVE" : "ROLE_TAKER";
                                mailService.sendReport(contact, contactAccess, reportType);
                                if (preReport) {
                                    contactsMailedPreReport.add(contact);
                                } else {
                                    contactsMailedFinalReport.add(contact);
                                }
                            }
                        }
                    } else {
                        System.out.println("Empty contact list for customer: " + customer.getName());
                    }
                }
            } else {
                System.out.println("Data not found");
            }
        }

        return "home";
    }

    @RequestMapping(value = "/mail/reminder", method = RequestMethod.GET)
    public String sendReminder() throws GeneralSecurityException, IOException, MessagingException, ParseException {
        Timeline timeline = new Timeline(LocalDate.now());
        List<Survey> publishedSurveys = surveyService.getByStatus(SurveyStatus.PUBLISHED.toString());
        boolean activeReminder = publishedSurveys.get(0).getEnableResponseReminder();
        boolean activeExpirationReminder = publishedSurveys.get(0).getEnableExpirationReminder();
        //if ((LocalDate.now().toString().equals(timeline.getReminder()) && activeReminder) || (LocalDate.now().toString().equals(timeline.getExpiration()) && activeExpirationReminder)) {
            List<Customer> customers = customerService.getAllActiveCustomer();

            Set<User> contactsMailed = new HashSet<>();
            //Implement if attachments are required
            String[] attachFiles = new String[0];

            if (publishedSurveys != null && customers != null) {
                for (Survey survey : publishedSurveys) {
                    for (Customer customer : customers) {
                        List<User> contacts = customer.getContactList();
                        if (contacts != null) {
                            for (User contact : contacts) {
                                List<Response> awaitingResponses = responseService.getAwaitingResponsesbyContact(contact.getEmail());
                                boolean contactMailed =  contactsMailed.stream().anyMatch(
                                        contactMatch -> contactMatch.getEmail().equals(contact.getEmail()));

                                if (awaitingResponses != null && awaitingResponses.size() > 0 && !contactMailed){
                                    Response first = awaitingResponses.get(0);
                                    String url = "https://sanm-gcp-gae-qisdev.appspot.com/survey/" + first.getSurveyId() + "/response/" + first.getId();
                                    String[] recipient = new String[1];
                                    recipient[0] = contact.getEmail();

                                    mailService.sendReminder(recipient, attachFiles, contact.getName(), timeline.getExpiration(), url);
                                    contactsMailed.add(contact);
                                    System.out.println("Response id:" + first.getId());
                                }
                            }
                        } else {
                            System.out.println("Empty contact list for customer: " + customer.getName());
                        }
                    }
                }
            } else {
                System.out.println("Data not found");
            }
        //}

        return "home";
    }
}
