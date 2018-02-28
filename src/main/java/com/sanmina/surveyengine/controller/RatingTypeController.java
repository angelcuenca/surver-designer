package com.sanmina.surveyengine.controller;

import com.google.gson.Gson;
import com.sanmina.surveyengine.model.CustomerExternalRating;
import com.sanmina.surveyengine.model.RatingType;
import com.sanmina.surveyengine.service.impl.RatingTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Controller
public class RatingTypeController {
    @Autowired
    private RatingTypeService ratingTypeService;


    @RequestMapping(value = "/admin/rating-type", method = RequestMethod.GET)
    public String customerExternalRatingView(Model model){
        return "ratingtype";
    }

    @RequestMapping(value = "/admin/get/all/rating-type", method = RequestMethod.GET)
    public void getAllCustomerExternalRating(HttpServletRequest request, HttpServletResponse response) throws IOException {

        //Get all Rating type
        List<RatingType> ratingTypeList = ratingTypeService.getAll();

        String json = new Gson().toJson( ratingTypeList );
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }

    @RequestMapping(value = "/admin/save/rating-type", method = RequestMethod.POST)
    public void saveRatingType(HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        String status = "";
        String ratingTypeName = request.getParameter("ratingTypeName");

        RatingType ratingType = ratingTypeService.getRatingTypeByName(ratingTypeName);

        if( ratingType == null ){
            RatingType newRatingType = new RatingType();

            newRatingType.setRatingTypeName(ratingTypeName);
            ratingTypeService.saveRatingType(newRatingType);
            status = "Rating type " + ratingTypeName + " correctly saved";
        }else {
            status = "Rating type is already created.";
        }

        String json = new Gson().toJson( status );
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }

    @RequestMapping(value = "/admin/update/rating-type", method = RequestMethod.POST)
    public void updateRatingType(HttpServletRequest request,
                                             HttpServletResponse response) throws Exception {
        String status = "";
        long idRatingType = Long.parseLong(request.getParameter("idRatingType"));
        String ratingTypeName = request.getParameter("ratingTypeName");

        RatingType ratingType = ratingTypeService.getRatingTypeById(idRatingType);
        ratingType.setRatingTypeName(ratingTypeName);

        ratingTypeService.saveRatingType(ratingType);
        status = "Rating type correctly updated.";

        String json = new Gson().toJson( status );
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }

    @RequestMapping(value = "/admin/delete/rating-type", method = RequestMethod.POST)
    public void deleteRatingType(HttpServletRequest request,
                                             HttpServletResponse response) throws Exception {

        String status = "";
        long idRatingType = Long.parseLong(request.getParameter("idRatingType"));

        RatingType ratingType = ratingTypeService.getRatingTypeById(idRatingType);
        String nameRatingType = ratingType.getRatingTypeName();
        ratingTypeService.deleteRatingType(ratingType);
        status = nameRatingType + " Rating Type correctly deleted";

        String json = new Gson().toJson( status );
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }

}
