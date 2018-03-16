package com.project.surveyengine.controller;

import com.google.gson.Gson;
import com.project.surveyengine.model.GoogleProfile;
import com.project.surveyengine.model.Role;
import com.project.surveyengine.model.User;
import com.project.surveyengine.service.impl.UserService;
import com.project.surveyengine.util.GoogleUtil;
import com.project.surveyengine.util.SecurityUtil;
import com.project.surveyengine.service.impl.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;
import java.util.Properties;


/**
 * Created by angel_cuenca on 10/11/2015.
 */
@Controller
public class LoginController {

    @Autowired
    @Qualifier("userService")
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    AuthenticationManager authenticationManager;

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String getLogin(Model model) throws IOException {

        Resource resource = new ClassPathResource("/social.properties");
        Properties props = PropertiesLoaderUtils.loadProperties(resource);

        return "login";
    }

    @RequestMapping(value = "/callback", method = RequestMethod.GET)
    public String callback(){
        return "login";
    }

    @RequestMapping(value = "/callback/google/directory", method = RequestMethod.GET)
    public String callbackGoogle(Model model){
        List<Role> listRoles = roleService.getAllRoles();
        String json = new Gson().toJson( listRoles );
        model.addAttribute("listRoles", json );

        return "users";
    }

    @RequestMapping(value = "/signup", method = RequestMethod.GET)
    public String redirectRequestToRegistrationPage(@RequestParam("token") String token, @RequestParam("service") String service, Model model, HttpServletRequest request) {

        model.addAttribute("token", token);

        //Google token validation, retrieves the data from google's endpoint
        GoogleProfile googleProfile = GoogleUtil.getGoogleProfile(token);

        //Check if the user belongs to Sanmina
        /*if(!googleProfile.getEmail().endsWith("sanmina.com")){
            return  "forward:/error?code=404&error=Forbidden&detail=Your account does not belong to Sanmina";
        } */

        //Load the user's admin account
        User registered = userService.verifyUserAccount(googleProfile);

        //Check if the account has role ADMIN
        if( registered == null ){
            return  "forward:/error?code=404&error=Forbidden&detail=Your account has not been authorized, please contact angelscrf@gmail.com";
        }

        //Create user's session
        SecurityUtil.logInUser(registered);

        //Remove url params
        model.asMap().clear();

        return  "redirect:/";
    }
}
