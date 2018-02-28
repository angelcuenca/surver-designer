package com.sanmina.surveyengine.controller;

import com.google.gson.Gson;
import com.sanmina.surveyengine.enumerable.SurveyStatus;
import com.sanmina.surveyengine.model.Survey;
import com.sanmina.surveyengine.model.Timeline;
import com.sanmina.surveyengine.service.ISurveyService;
import com.sanmina.surveyengine.service.ITimelineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

/**
 * Created by arlette_parra on 17/12/11.
 */
@Controller
public class TimelineController {

    @Autowired
    ISurveyService iSurveyService;

    @Autowired
    ITimelineService iTimelineService;

    @Autowired
    ISurveyService surveyService;


    @RequestMapping(value = {"/timeline"}, method = RequestMethod.GET)
    public String timeline(Model model){

        List<Survey> surveys = surveyService.getByStatus("PUBLISHED");

        for (Survey survey : surveys) {
            model.addAttribute("enableResponseReminder", survey.getEnableResponseReminder());
            model.addAttribute("enableExpirationReminder", survey.getEnableExpirationReminder());
        }

        return "timeline";
    }

    @RequestMapping(value = {"/timeline/saveReminders"}, method = RequestMethod.POST)
    @ResponseBody
    public void timeline(@RequestParam(value= "enableResponseReminder") Boolean enableResponseReminder,
                         @RequestParam(value= "enableExpirationReminder") Boolean enableExpirationReminder) throws IOException {

        List<Survey> surveys = surveyService.getByStatus("PUBLISHED");

        for (Survey survey : surveys) {
            survey.setEnableResponseReminder(enableResponseReminder);
            survey.setEnableExpirationReminder(enableExpirationReminder);
            surveyService.save(survey);
        }

    }

    @RequestMapping(value = {"/get/timeline"}, method = RequestMethod.GET)
    @ResponseBody
    public void timeline(HttpServletResponse response) throws IOException {

        System.out.println("------------------------------------------------------");
        Timeline timeline = new Timeline(LocalDate.now());

        String jsonTimeline = new Gson().toJson(timeline);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(String.valueOf(jsonTimeline));
    }
}
