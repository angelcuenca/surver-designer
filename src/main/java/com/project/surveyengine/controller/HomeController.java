package com.project.surveyengine.controller;

import com.google.gson.Gson;
import com.project.surveyengine.enumerable.ResponseStatus;
import com.project.surveyengine.enumerable.SurveyStatus;
import com.project.surveyengine.model.*;
import com.project.surveyengine.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.logging.Logger;

@Controller
public class HomeController {
    @Autowired
    IMailService iMailService;

    @Autowired
    ICustomerService iCustomerService;

    @Autowired
    IResponseService iResponseService;

    @Autowired
    ISurveyService iSurveyService;

    @Autowired
    IUserService iUserService;

    private static final Logger log = Logger.getLogger(SurveyController.class.getName());

    @RequestMapping(value = {"/", "/home"}, method = RequestMethod.GET)
    public String customersView(Model model){
        return "index";
    }

    @RequestMapping(value = {"/home/resend-to"}, method = RequestMethod.GET)
    public void resendTo(HttpServletRequest request, HttpServletResponse response) throws IOException, GeneralSecurityException, MessagingException {

        String statusMessage = "";
        String contactToResend = request.getParameter("contactToResend");
        String typeResend = request.getParameter("typeResend");
        String editSurvey = request.getParameter("editSurvey");
        Timeline timeline = new Timeline(null);
        String[] recipient = new String[1];
        recipient[0] = contactToResend;
        String[] attachFiles = new String[0];

        //Get User id
        User user = iUserService.findByEmail(contactToResend);

        if( typeResend.equalsIgnoreCase("survey") ){
            List<Survey> publishedSurveys = iSurveyService.getByStatus(SurveyStatus.PUBLISHED.toString());

            //Resend survey or Resend Edit survey
            if( editSurvey.equalsIgnoreCase("disabled") ){
                List<Response> responseAwaitingList = iResponseService.getResponsesListByStatus(contactToResend, ResponseStatus.AWAITING);

                if( !(publishedSurveys.isEmpty()) && !(responseAwaitingList.isEmpty()) ) {
                    String url = "http://sanm-gcp-gae-qisdev.appspot.com/survey/" + publishedSurveys.get(0).getId() + "/response/" + responseAwaitingList.get(0).getId();
                    boolean status = iMailService.sendSurvey(recipient, attachFiles, user.getName(), timeline.getExpiration(), url);
                    if (status) {
                        statusMessage = "Survey correctly resent for " + contactToResend + ".";
                    } else {
                        statusMessage = "Error Survey for " + contactToResend;
                    }
                }else{
                    statusMessage = "Contact " + contactToResend +" does not have survey to resend.";
                }
            }else{
                List<Response> responsesSavedList = iResponseService.getResponsesListByStatus(contactToResend, ResponseStatus.SUBMITTED);

                if( !(publishedSurveys.isEmpty()) && !(responsesSavedList.isEmpty()) ) {
                    String url = "http://sanm-gcp-gae-qisdev.appspot.com/survey/" + publishedSurveys.get(0).getId() + "/response/" + responsesSavedList.get(0).getId();
                    boolean status = iMailService.sendSurvey(recipient, attachFiles, user.getName(), timeline.getExpiration(), url);
                    if (status) {
                        statusMessage = "Survey edit correctly resent for " + contactToResend + ".";
                    } else {
                        statusMessage = "Error Survey for " + contactToResend;
                    }
                }else{
                    statusMessage = "Contact " + contactToResend +" does not have survey to edit.";
                }
            }
        }else if( typeResend.equalsIgnoreCase("final-report") ){

            boolean status = iMailService.sendReport(user, "ROLE_OTHER_REPORTEE", typeResend);
            if(status){
                statusMessage = "Final Report correctly resent for "+ contactToResend +".";
            }else{
                statusMessage = "Error Final Report for " + contactToResend;
            }

        }else if( typeResend.equalsIgnoreCase("executive-report") ){

            boolean status = iMailService.sendReport(user, "ROLE_EXECUTIVE", typeResend);
            if(status){
                statusMessage = "Executive Report correctly resent for "+ contactToResend +".";
            }else{
                statusMessage = "Error Executive Report for " + contactToResend;
            }
        }

        String json = new Gson().toJson( statusMessage );
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }

    @RequestMapping(value = "/admin/get/users-by-role", method = RequestMethod.GET)
    public void getUsersByRole(HttpServletRequest request, HttpServletResponse response) throws IOException {
        //Get email from Session
        String emailUerLogged = (String) SecurityContextHolder.getContext().getAuthentication().getCredentials();
        String role = request.getParameter("role");

        PatsTable table = new PatsTable();
        List<User> listUser = iUserService.getListUserByRole(role);

        //Set values
        table.setDataUsers(listUser);
        table.setEmailUerLogged(emailUerLogged);

        String json = new Gson().toJson(table);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }
}
