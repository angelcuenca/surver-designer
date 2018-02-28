package com.sanmina.surveyengine.controller;

import com.google.appengine.api.blobstore.*;
import com.google.gson.*;
import com.sanmina.surveyengine.model.*;
import com.sanmina.surveyengine.service.*;
import com.sanmina.surveyengine.service.impl.AnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.HandlerMapping;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;
import java.util.Map;
/**
 * Created by arlette_parra on 17/11/23.
 */
@Controller
public class ReportController {
    @Autowired
    AnswerService answerService;

    @Autowired
    IBlobService blobService;

    @Autowired
    IUserService iUserService;

    @Autowired
    IReportService reportService;

    @Autowired
    ICustomerService customerService;

    @Autowired
    IResponseService responseService;

    @Autowired
    IMailService mailService;

    private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

    @RequestMapping(value="/reports/pre-report", method = RequestMethod.GET)
    public String preReport(@RequestParam("contact") long contactId){
        return "pre-report";
      }

    @RequestMapping(value = "/reports/get/pre-report", method = RequestMethod.GET)
    public void preReport( HttpServletResponse response,
                           @RequestParam("contact") long contactId,
                           @RequestParam("fiscalMonth") int month,
                           @RequestParam("fiscalYear") int year) throws IOException {

        User contact = iUserService.getUserById((contactId));
        boolean isSurveyTaker =  iUserService.userHasRole(contact, "ROLE_TAKER");
        boolean isAdmin = iUserService.userHasRole(contact, "ROLE_ADMIN");
        PatsTable tablePreReport = new PatsTable();

        if (isSurveyTaker || isAdmin){
            tablePreReport = reportService.getMonthlyOverviewPreReport(contact, month, year);
        }

        tablePreReport.setYearList(reportService.getResponsesYearList());

        String jsonTable = new Gson().toJson(tablePreReport);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(jsonTable);
    }

    @RequestMapping(value= {"/reports/monthly-overview-report"}, method = RequestMethod.GET)
    public String adminFinalReport(Model model){
        User userLogged = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        model.addAttribute("contactId", userLogged.getId());
        model.addAttribute("reportType", "final-executive-report");
        return "final-report";
    }

    @RequestMapping(value= {"/reports/final-report", "/reports/final-executive-report"}, method = RequestMethod.GET)
    public String finalReport(HttpServletRequest request,
                              @RequestParam("contact") long contactId,
                              Model model){
        String reportType = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
        if (reportType.endsWith("final-report")){
            reportType = "final-report";
        }else {
            reportType = "final-executive-report";
        }
        model.addAttribute("reportType", reportType);
        return "final-report";
    }

    @RequestMapping(value = {"/reports/get/final-report", "/reports/get/final-executive-report"}, method = RequestMethod.GET)
    public void finalReport( HttpServletRequest request,
                             HttpServletResponse response,
                             @RequestParam("contact") long contactId,
                             @RequestParam("fiscalMonth") int month,
                             @RequestParam("fiscalYear") int year) throws IOException {

        User contact = iUserService.getUserById((contactId));
        PatsTable tableFinalReport = new PatsTable();
        boolean isAdmin = iUserService.userHasRole(contact, "ROLE_ADMIN");
        boolean isExecutive = iUserService.userHasRole(contact, "ROLE_EXECUTIVE");
        boolean isOtherReportee = iUserService.userHasRole(contact, "ROLE_OTHER_REPORTEE");
        String reportType = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);

        if ((isAdmin || isExecutive) && reportType.endsWith("final-executive-report")) {
            tableFinalReport = reportService.getMonthlyOverviewFinalReport(contact, month, year, true);
        }else if ((isAdmin || isOtherReportee) && reportType.endsWith("final-report")){
            tableFinalReport = reportService.getMonthlyOverviewFinalReport(contact, month, year, false);
        }

        tableFinalReport.setYearList(reportService.getResponsesYearList());

        String jsonTable = new Gson().toJson(tableFinalReport);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(jsonTable);
    }

    @RequestMapping(value="/reports/divisional-report", method = RequestMethod.GET)
    public String divisionalReport() throws IOException {
        return "divisional-report";
    }

    @RequestMapping(value = "/reports/get/divisional-report", method = RequestMethod.GET)
    public void divisionalReport( HttpServletResponse response,
                                  @RequestParam("fiscalMonth") int month,
                                  @RequestParam("fiscalYear") int year) throws IOException {

        User userLogged = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean isAdmin = iUserService.userHasRole(userLogged, "ROLE_ADMIN");
        PatsTable tableReport = new PatsTable();

        if (isAdmin){
            tableReport = reportService.getMonthlyOverviewDivisionalReport(month, year);
        }

        tableReport.setYearList(reportService.getResponsesYearList());

        String jsonTable = new Gson().toJson(tableReport);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(jsonTable);
    }

    @RequestMapping(value="/reports/3-month-report", method = RequestMethod.GET)
    public String threeMonthReport() {
        return "3-month-report";
    }

    @RequestMapping(value = "/reports/get/3-month-report", method = RequestMethod.GET)
    public void threeMonthReport( HttpServletResponse response,
                                  @RequestParam("fiscalMonth") int month,
                                  @RequestParam("fiscalYear") int year) throws IOException {

        User userLogged = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean isAdmin = iUserService.userHasRole(userLogged, "ROLE_ADMIN");
        PatsTable tableReport = new PatsTable();

        if (isAdmin){
            tableReport = reportService.getThreeMonthReport(month, year);
        }

        tableReport.setYearList(reportService.getResponsesYearList());

        String jsonTable = new Gson().toJson(tableReport);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(jsonTable);

    }

    @RequestMapping(value="/reports/stoplight-report", method = RequestMethod.GET)
    public String stoplightReport(){
        return "stoplight-report";
    }

    @RequestMapping(value = "/reports/get/stoplight-report", method = RequestMethod.GET)
    public void stoplightReport( HttpServletResponse response,
                                  @RequestParam("fiscalMonth") int month,
                                  @RequestParam("fiscalYear") int year) throws IOException {

        User userLogged = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean isAdmin = iUserService.userHasRole(userLogged, "ROLE_ADMIN");
        PatsTable tableReport = new PatsTable();

        if (isAdmin){
            tableReport = reportService.getStoplightReport(month, year);
        }

        tableReport.setYearList(reportService.getResponsesYearList());

        String jsonTable = new Gson().toJson(tableReport);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(jsonTable);

    }

    @RequestMapping(value="/reports/unrecorded-report", method = RequestMethod.GET)
    public String unrecordedReport(){
        return "unrecorded-report";
    }

    @RequestMapping(value = "/reports/get/unrecorded-report", method = RequestMethod.GET)
    public void unrecordedReport( HttpServletResponse response,
                                  @RequestParam("fiscalMonth") int month,
                                  @RequestParam("fiscalYear") int year) throws IOException {

        User userLogged = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean isAdmin = iUserService.userHasRole(userLogged, "ROLE_ADMIN");
        PatsTable tableReport = new PatsTable();

        if (isAdmin){
            tableReport = reportService.getMonthlyUnrecordedReport(month, year);
            tableReport.setResponseByMonth(reportService.getResponsesByMonth("showAllCustomers", month, year));
        }

        tableReport.setYearList(reportService.getResponsesYearList());

        String jsonTable = new Gson().toJson(tableReport);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(jsonTable);

    }

    @RequestMapping(value="/reports/final-year-report", method = RequestMethod.GET)
    public String finalYearReport(){
        return "final-year-report";
    }

    @RequestMapping(value = {"/reports/get/final-year-report"}, method = RequestMethod.GET)
    public void finalYearReport(HttpServletResponse response,
                                @RequestParam("customer") String customer,
                                @RequestParam("fiscalYear") int year) throws IOException {

        User userLogged = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean isAdmin = iUserService.userHasRole(userLogged, "ROLE_ADMIN");
        PatsTable tableReport = new PatsTable();

        if (isAdmin){
            if (customer.isEmpty() && customerService.getAll().size() > 0){
                List<Customer> customerList = customerService.getAll();
                customer = customerList.get(0).getName();
            }
            tableReport = reportService.getYearlyOverviewReport(customer, year);
            tableReport.setDataCustomers(customerService.getAll());
            tableReport.setCustomer(customer);
        }

        tableReport.setYearList(reportService.getResponsesYearList());

        String jsonTable = new Gson().toJson(tableReport);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(jsonTable);
    }

    @RequestMapping(value="/reports/files-report", method = RequestMethod.GET)
    public String uploadedFilesReport() throws MalformedURLException {
        return "files-report";
    }

    @RequestMapping(value = "/reports/get/files-report", method = RequestMethod.GET)
    public void uploadedFilesReport( HttpServletResponse response,
                                     @RequestParam("fiscalMonth") int month,
                                     @RequestParam("fiscalYear") int year) throws IOException {

        User userLogged = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean isAdmin = iUserService.userHasRole(userLogged, "ROLE_ADMIN");
        PatsTable tableReport = new PatsTable();

        if (isAdmin){
            tableReport = reportService.getMonthlyUploadedFilesReport(month, year);
        }

        tableReport.setYearList(reportService.getResponsesYearList());

        String jsonTable = new Gson().toJson(tableReport);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(jsonTable);
    }

    @RequestMapping(value = {"/reports/files-report"}, method = RequestMethod.POST)
    protected void handleUploadBlob( HttpServletRequest request, HttpServletResponse resp) throws ServletException, IOException {
        Map<String, List<BlobKey>> blobs = blobstoreService.getUploads(request);
        Object blob = blobs.keySet().iterator().next();
        String keyStr = (String) blob;
        String blobKeyRequest = blobService.getBlobkey(request, keyStr);
        BlobKey blobKey = new BlobKey(blobKeyRequest);

        long responseId = Long.parseLong(request.getHeader("responseId"));

        Response response = responseService.get(responseId);

        for ( Answer rating : response.answers) {
            if (rating.type.toString().equals("FILE")){
                rating.answer = blobKey.getKeyString();
            }
        }

        responseService.save(response);

        String json = new Gson().toJson(blobKey);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(json);
    }

    @RequestMapping(value = "/serve", method = RequestMethod.GET)
    public void getDownload(HttpServletRequest request, HttpServletResponse response) throws IOException { blobService.getDownload(request,response);
    }

    @RequestMapping(value = {"/uploadSessionEditFile"}, method = RequestMethod.GET)
    protected void GetUploadSession(HttpServletResponse response) throws IOException {

        //Redirect callback url generated to be used once the blob service is consumed
        BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
        String redirectAction = blobstoreService.createUploadUrl(String.format("/reports/files-report"));

        String json = new Gson().toJson(redirectAction);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }
}
