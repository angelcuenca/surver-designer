package com.project.surveyengine.controller;

import com.google.gson.Gson;
import com.project.surveyengine.model.PatsTable;
import com.project.surveyengine.model.Survey;
import com.project.surveyengine.service.ISurveyService;
import com.project.surveyengine.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;


/**
 * Created by arlette_parra on 17/12/11.
 */
@Controller
public class DashboardController {


    @Autowired
    ISurveyService surveyService;

    @RequestMapping(value = {"/dashboard/get/surveys"}, method = RequestMethod.GET)
    @ResponseBody
    public void dashboard(HttpServletResponse response) throws IOException {

        PatsTable table = new PatsTable();
        List<Survey> surveys = surveyService.getAll();
        table.setDataSurveys(surveys);

        //Return list of responses as JSON
        String jsonTable = new Gson().toJson(table);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(jsonTable);
    }

    @RequestMapping(value="/dashboard", method = RequestMethod.GET)
    public String dashboard(){
        return "dashboard";
    }

}
