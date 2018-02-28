package com.sanmina.surveyengine.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Created by gerardo_martinez on 16/08/16.
 */
@Controller
public class ErrorController {
  @RequestMapping(value = "/error", method = RequestMethod.GET)
  public String get(ModelMap model, @RequestParam("code") String code, @RequestParam("error")  String error, @RequestParam("detail")  String detail ) {

    model.addAttribute("code", code);
    model.addAttribute("error", error);
    model.addAttribute("detail", detail);

    return "error";
  }
}
