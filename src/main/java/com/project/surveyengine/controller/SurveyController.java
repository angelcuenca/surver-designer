package com.project.surveyengine.controller;

import com.google.appengine.api.blobstore.*;
import com.google.gson.Gson;
import com.project.surveyengine.enumerable.InputType;
import com.project.surveyengine.enumerable.ResponseStatus;
import com.project.surveyengine.enumerable.SurveyStatus;
import com.project.surveyengine.model.*;
import com.project.surveyengine.service.*;
import com.project.surveyengine.model.*;
import com.project.surveyengine.service.*;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;
import org.xml.sax.InputSource;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathFactory;
import java.io.IOException;
import java.io.StringReader;
import java.time.LocalDate;
import java.util.*;
import java.util.logging.Logger;

@Controller
public class SurveyController {

    @Autowired
    ISurveyService surveyService;

    @Autowired
    IResponseService responseService;

    @Autowired
    ICustomerService customerService;

    @Autowired
    ICustomerContactService customerContactService;

    @Autowired
    IBlobService blobService;

    private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
    private static final Logger log = Logger.getLogger(SurveyController.class.getName());
    private User userLogged;

    @RequestMapping(value = {"/survey/designer"}, method = RequestMethod.GET)
    public String newSurvey(Model model) throws IOException {

        //Get XML content when it comes from RedirectView
        String xmlRedirectView = (String) model.asMap().get("xmlContent");

        if( xmlRedirectView != null ){
            model.addAttribute("xmlContent", xmlRedirectView);
            model.addAttribute("enableReminder", model.asMap().get("enableReminder"));
            model.addAttribute("enableApproval", model.asMap().get("enableApproval"));
            model.addAttribute("enableExpirationReminder", model.asMap().get("enableExpirationReminder"));
        //Get XML from survey.xml when is a new survey
        }else{
            model.addAttribute("enableReminder", true);
            model.addAttribute("enableApproval", true);
            model.addAttribute("enableExpirationReminder", true);

            ClassLoader classLoader = getClass().getClassLoader();
            String xmlSample = IOUtils.toString(classLoader.getResourceAsStream("xml_templates/survey.xml"));
            model.addAttribute("xmlContent", xmlSample);
        }

        return "designer";
    }

    @RequestMapping(value = {"/survey/designer"}, method = RequestMethod.POST)
    protected void handleUploadBlob(HttpServletRequest request, HttpServletResponse resp) throws ServletException, IOException {

        Map<String, List<BlobKey>> blobs = blobstoreService.getUploads(request);
        Object blob = blobs.keySet().iterator().next();
        String keyStr = (String) blob;
        String blobKeyRequest = blobService.getBlobkey(request, keyStr);
        BlobKey blobKey = new BlobKey(blobKeyRequest);


        String json = new Gson().toJson(blobKey);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(json);
    }

    @RequestMapping(value = {"/uploadSession"}, method = RequestMethod.GET)
    protected void GetUploadSession(HttpServletResponse response) throws IOException {

        BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
        String redirectAction = blobstoreService.createUploadUrl("/survey/designer");

        String json = new Gson().toJson(redirectAction);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }

    @RequestMapping(value = {"/survey/preview", "/survey/{surveyId}/preview"}, method = RequestMethod.POST)
    public String surveyPreview(@RequestParam("xmlContent") String xmlContent,
                                @RequestParam("enableReminder") boolean enableReminder,
                                @RequestParam("enableApproval") boolean enableApproval,
                                @RequestParam("enableExpirationReminder") boolean enableExpirationReminder,
                                Model model) throws Exception {

        model.addAttribute("xmlContent", xmlContent);
        model.addAttribute("status", "PREVIEW");
        model.addAttribute("enableReminder", enableReminder);
        model.addAttribute("enableApproval", enableApproval);
        model.addAttribute("enableExpirationReminder", enableExpirationReminder);

        return "preview";
    }

    @RequestMapping(value = {"/survey/edit", "/survey/{surveyId}/edit"}, method = RequestMethod.POST)
    public String surveyDesignEdit(@RequestParam("xmlContent") String xmlContent,
                             @RequestParam("enableReminder") boolean enableReminder,
                             @RequestParam("enableApproval") boolean enableApproval,
                             @RequestParam("enableExpirationReminder") boolean enableExpirationReminder,
                             Model model) throws Exception {

        model.addAttribute("xmlContent", xmlContent);
        model.addAttribute("enableReminder", enableReminder);
        model.addAttribute("enableApproval", enableApproval);
        model.addAttribute("enableExpirationReminder", enableExpirationReminder);

        return "designer";
    }

    @RequestMapping(value = {"/survey/save", "/survey/publish"}, method = RequestMethod.POST)
    public RedirectView surveySave(@RequestParam("xmlContent") String xmlContent,
                                @RequestParam("enableReminder") boolean enableReminder,
                                @RequestParam("enableApproval") boolean enableApproval,
                                @RequestParam("enableExpirationReminder") boolean enableExpirationReminder,
                                RedirectAttributes redirectAttr,
                                HttpServletRequest request) throws Exception {

        userLogged = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String action = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
        boolean nameExist = surveyService.getNameValidation(surveyTitle(xmlContent));
        SurveyStatus surveyStatus = SurveyStatus.DRAFT;
        RedirectView redirectView = new RedirectView();
        redirectView.setExposeModelAttributes(false);
        redirectView.setUrl("/survey/designer");

        if(!nameExist){
            if (action.endsWith("publish")){
                surveyStatus = SurveyStatus.PUBLISHED;
            }

            Survey survey = new Survey(surveyTitle(xmlContent), xmlContent, enableReminder, enableApproval, enableExpirationReminder , surveyStatus, userLogged.getEmail());
            long generatedId = surveyService.save(survey);

            redirectView.setUrl(String.format("/survey/%d", generatedId));
            redirectAttr.addFlashAttribute("notify", "saveSuccess");
            return redirectView;

        }

        redirectAttr.addFlashAttribute("notify", "nameValidationFail");
        redirectAttr.addFlashAttribute("xmlContent", xmlContent);
        redirectAttr.addFlashAttribute("enableReminder", enableReminder);
        redirectAttr.addFlashAttribute("enableApproval", enableApproval);
        redirectAttr.addFlashAttribute("enableExpirationReminder", enableExpirationReminder);

        return redirectView;
    }

    @RequestMapping(value = {"/survey/{surveyId}/save", "/survey/{surveyId}/publish"}, method = RequestMethod.POST)
    public RedirectView surveyUpdate(@RequestParam("xmlContent") String xmlContent,
                                   @RequestParam("enableReminder") boolean enableReminder,
                                   @RequestParam("enableApproval") boolean enableApproval,
                                   @RequestParam("enableExpirationReminder") boolean enableExpirationReminder,
                                   @PathVariable("surveyId") Long id,
                                   RedirectAttributes redirectAttr,
                                   HttpServletRequest request) throws Exception {

        String  action = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);

        long idByName;
        try {
            idByName = surveyService.getIdByName(surveyTitle(xmlContent));
        }catch (Exception e){idByName = -1;}

        if (idByName == id || idByName == -1){
            Survey survey = surveyService.get(id);
            survey.name  = surveyTitle(xmlContent);
            survey.xmlContent = xmlContent;
            survey.enableResponseReminder = enableReminder;
            survey.enableExpirationReminder = enableExpirationReminder;
            survey.enableApproval = enableApproval;
            if(action.endsWith("publish")){
                survey.status =  SurveyStatus.PUBLISHED;
            }
            //Save changes to the xml
            surveyService.save(survey);
            redirectAttr.addFlashAttribute("notify", "saveSuccess");

        }else {
            redirectAttr.addFlashAttribute("notify", "nameValidationFail");
        }

        redirectAttr.addFlashAttribute("xmlContent", xmlContent);
        redirectAttr.addFlashAttribute("enableReminder", enableReminder);
        redirectAttr.addFlashAttribute("enableApproval", enableApproval);
        redirectAttr.addFlashAttribute("enableExpirationReminder", enableExpirationReminder);

        RedirectView redirectView = new RedirectView();
        redirectView.setExposeModelAttributes(false);
        redirectView.setUrl(String.format("/survey/%d", id));
        return redirectView;
    }

    @RequestMapping(value = {"/survey/{surveyId}", "/survey/{surveyId}/cancel"}, method = RequestMethod.GET)
    public String surveyDesigner(@PathVariable("surveyId") Long id,
                                 HttpServletRequest request,
                                 Model model){

        Survey survey = surveyService.get(id);
        userLogged = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String  action = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);

        if( survey != null && survey.getCreatedBy().equalsIgnoreCase(userLogged.getEmail())) {
            model.addAttribute("surveyId", id);
            model.addAttribute("title", survey.name);
            if (!model.containsAttribute("xmlContent")) {
                model.addAttribute("xmlContent", survey.xmlContent);
            }
            model.addAttribute("status",survey.status);
            model.addAttribute("enableReminder", survey.enableResponseReminder);
            model.addAttribute("enableExpirationReminder", survey.enableExpirationReminder);
            model.addAttribute("enableApproval", survey.enableApproval);


            if( survey.status.toString().equalsIgnoreCase("PUBLISHED")){
                return "preview";
            }else{
                return "designer";
            }

        }else{
            return "redirect:" + "/dashboard";
        }
    }

    @RequestMapping(value = {"/survey/{surveyId}/cancel"}, method = RequestMethod.POST)
    public String surveyCanceled(@PathVariable("surveyId") Long id, Model model){

        Survey survey = surveyService.get(id);
        userLogged = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if( survey != null && survey.getCreatedBy().equalsIgnoreCase(userLogged.getEmail())) {
            model.addAttribute("surveyId", id);
            model.addAttribute("title", survey.name);
            if (!model.containsAttribute("xmlContent")) {
                model.addAttribute("xmlContent", survey.xmlContent);
            }
            survey.setStatus(SurveyStatus.DRAFT);
            surveyService.save(survey);
            model.addAttribute("status",survey.status);
            model.addAttribute("enableReminder", survey.enableResponseReminder);
            model.addAttribute("enableExpirationReminder", survey.enableExpirationReminder);
            model.addAttribute("enableApproval", survey.enableApproval);


            if( survey.status.toString().equalsIgnoreCase("PUBLISHED")){
                return "preview";
            }else{
                return "designer";
            }

        }else{
            return "redirect:" + "/dashboard";
        }
    }

    @RequestMapping(value = {"/survey/{surveyId}/response/{responseId}"}, method = RequestMethod.GET)
    public String responseSurvey(@PathVariable("surveyId") Long id,
                                 @PathVariable("responseId") Long responseId,
                                 HttpServletRequest request,
                                 Model model) {

        Response response = responseService.get(responseId);

        if (response.getStatus() == ResponseStatus.EXPIRED || response.getStatus() == ResponseStatus.AWAITING_EXPIRED){
            return "expired";
        }

        String  action = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
        String activeCustomer = "/survey/"+id+"/response/"+responseId;
        Survey survey = surveyService.get(id);

        List<Response> awaitingResponses = responseService.getActiveResponsesbyContact(response.recipient);
        List<Answer> listanswers = response.getAnswers();

        model.addAttribute("surveyId", id);
        model.addAttribute("responseId", responseId);
        model.addAttribute("xmlContent", survey.xmlContent);
        model.addAttribute("surveyAnswers", listanswers);
        model.addAttribute("expirationDate", response.expirationDate);
        model.addAttribute("fiscalMonth", response.getFiscalMonth());
        model.addAttribute("fiscalYear", response.getFiscalYear());
        model.addAttribute("awaitingResponses", awaitingResponses);
        model.addAttribute("statusResponse", response.getStatus().toString());
        model.addAttribute("contact", response.getRecipient());
        //Redirect callback url generated to be used once the blob service is consumed
        BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
        String redirectAction = blobstoreService.createUploadUrl(String.format("/survey/%d/response/%d", id, responseId));
        model.addAttribute("redirectAction", redirectAction);
        model.addAttribute("activeResponse", activeCustomer);

        return "answer";
    }

    @RequestMapping(value = {"/survey/{surveyId}/response/{responseId}", "/survey/{surveyId}/response/{responseId}/edit"}, method = RequestMethod.POST)
    public RedirectView responseSurvey(HttpServletRequest request,
                                       @PathVariable("surveyId") Long id,
                                       @PathVariable("responseId") Long responseId,
                                       RedirectAttributes redirectAttr) throws FileUploadException {

        String keyStr;
        Map inputMap = request.getParameterMap();
        Map<String, List<BlobKey>> blobs = blobstoreService.getUploads(request);
        Response response = responseService.get(responseId);
        List<Answer> listanswers = response.getAnswers();

        //If some file was previously attached, it will be saved to be added with the new answers
        for (Iterator<Answer> it = listanswers.iterator(); it.hasNext(); ) {
            Answer answer= it.next();
            if ( answer.getType() == InputType.VALUE ) {
                it.remove();
            }
        }

        //Remove all the answers, the new answers will be added in the next lines
        response.answers = new ArrayList<>();

        //Add the file saved, only if some previously saved file was found
        for(Answer answer: listanswers){
            response.addResponse(answer.getInputId(), answer.getQuestionText(), answer.getAnswer(), answer.getType());
        }

        //Read all the inputs in the request
        for (Object key: inputMap.keySet()) {
            keyStr = (String)key;

            //Only save the input if it is not a hidden question text
            if (!(keyStr.startsWith("hdn")))
                response.addResponse(keyStr, request.getParameter("hdn" + keyStr), request.getParameter(keyStr), InputType.VALUE);
        }

        //Read all the files in the request
        for(Object blob: blobs.keySet()){
            keyStr = (String)blob;

            String blobKeyRequest = blobService.getBlobkey(request, keyStr);

            BlobInfoFactory blobInfoFactory = new BlobInfoFactory();
            BlobKey blobKey = new BlobKey(blobKeyRequest);
            BlobInfo blobInfo = blobInfoFactory.loadBlobInfo(blobKey);
            String fileName = blobInfo.getFilename();

            if(fileName.isEmpty()){
                //When input file is empty, delete the previously attachment if it's exists
                listanswers = response.getAnswers();
                for (Answer answer: listanswers ) {
                    if ( answer.getInputId().equalsIgnoreCase(keyStr) ) {
                        listanswers.remove(answer);
                        break;
                    }
                }
            }else{
                //When input file is not empty, delete the previously attachment and add the new file
                listanswers = response.getAnswers();
                for (Answer answer: listanswers ) {
                    if ( answer.getInputId().equalsIgnoreCase(keyStr) ) {
                        listanswers.remove(answer);
                        break;
                    }
                }
                response.addResponse(keyStr, request.getParameter("hdn" + keyStr), blobKeyRequest, InputType.FILE);
            }
        }

        response.setStatus(ResponseStatus.SUBMITTED);
        responseService.save(response);

        List<Response> awaitingResponses = responseService.getAwaitingResponsesbyContact(response.recipient);
        if (awaitingResponses != null && awaitingResponses.size() > 0){
            Response first = awaitingResponses.get(0);
            String redirect = "/survey/"+first.surveyId+"/response/"+first.id;
            return new RedirectView(redirect, true);
        }
        redirectAttr.addFlashAttribute("notify", true);
        return new RedirectView("/survey/{surveyId}/response/{responseId}/submit", true);
    }

    @RequestMapping(value = "/survey/{surveyId}/response/{responseId}/submit", method = RequestMethod.GET)
    public String saveResponseSurvey(){
        return "thanks";
    }

    @RequestMapping(value = "/survey/expired", method = RequestMethod.GET)
    public String surveyExpiration(){
        Timeline timeline = new Timeline(LocalDate.now());
        //if (LocalDate.now().toString().equals(timeline.getExpiration())) {
            List<Response> activeResponses = responseService.getAllActiveResponses();
            for ( Response response: activeResponses) {
                if (response.getStatus() == ResponseStatus.SUBMITTED) {
                    response.setStatus(ResponseStatus.EXPIRED);
                } else {
                    response.setStatus(ResponseStatus.AWAITING_EXPIRED);
                }
                responseService.save(response);
            }
        //}
        return "home";
    }

    //Evaluate xpath expression to get survey's title
    public String surveyTitle(String xml) throws Exception {
        String title;
        String xpath = "/survey/surveyInfo/surveyTitle";
        XPath xPath = XPathFactory.newInstance().newXPath();

        try {
            title = xPath.evaluate(xpath, new InputSource(new StringReader(xml)));
            if(title.isEmpty()){
                return "Untitled Survey";
            }
            return title;
        }
        catch (Exception e){
            return "Untitled Survey";
        }
    }
}