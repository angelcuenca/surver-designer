package com.project.surveyengine.controller;


import com.googlecode.objectify.ObjectifyService;
import com.project.surveyengine.model.Role;
import com.project.surveyengine.service.ICustomerService;
import com.project.surveyengine.service.IRoleService;
import com.project.surveyengine.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Created by angel_cuenca on 23/08/16.
 */
@Controller
public class InitController {

    ObjectifyService objectifyService;

    @Autowired
    private ICustomerService customerService;

    @Autowired
    private IRoleService roleService;

    @RequestMapping(value = {"/init"}, method = RequestMethod.GET)
    public String initEntities(){

        //if(!(SystemProperty.environment.value() == SystemProperty.Environment.Value.Production)){

            Role role = new Role("ROLE_ADMIN");
            roleService.save(role);
            role = new Role("ROLE_TAKER");
            roleService.save(role);
            role = new Role("ROLE_EXECUTIVE");
            roleService.save(role);
            role = new Role("ROLE_OTHER_REPORTEE");
            roleService.save(role);
        //}

        return "login";
    }
}
