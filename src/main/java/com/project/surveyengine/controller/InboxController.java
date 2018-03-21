package com.project.surveyengine.controller;

import com.google.gson.Gson;
import com.project.surveyengine.model.PatsTable;
import com.project.surveyengine.model.Response;
import com.project.surveyengine.model.Survey;
import com.project.surveyengine.service.IResponseService;
import com.project.surveyengine.service.ISurveyService;
import com.project.surveyengine.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/**
 * Created by project on 17/12/11.
 */
@Controller
public class InboxController {

    @Autowired
    private ISurveyService surveyService;

    @Autowired
    private IResponseService responseService;

    @RequestMapping(value = { "/inbox" }, method = RequestMethod.GET)
    public String inbox(){

        return "inbox";
    }

    @RequestMapping(value = "/inbox/get/responses", method = RequestMethod.GET)
    @ResponseBody
    public void inbox(HttpServletResponse response) throws IOException {

        PatsTable table = new PatsTable();
        List<Response> responses = responseService.getAll();
        table.setDataResponses(responses);

        //Return list of responses as JSON
        String jsonTable = new Gson().toJson(table);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(jsonTable);
    }


    @RequestMapping(value = {"/case/{action}/response/{idResponse}"}, method = RequestMethod.GET)
    public ModelAndView inboxPM(@PathVariable("action") String action,
                                @PathVariable("idResponse") String idResponse){

        List<Survey> listSurveys = surveyService.getAll();
        List<Response> listResponses = responseService.getAll();
        Response res = responseService.get(Long.parseLong(idResponse));

        responseService.save(res);
        ModelAndView model = new ModelAndView("redirect:" + "/inbox");
        model.addObject("listResponses", listResponses);
        model.addObject("listSurveys", listSurveys);
        return model;
    }
}
