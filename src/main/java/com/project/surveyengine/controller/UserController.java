package com.project.surveyengine.controller;

import com.google.gson.Gson;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.cmd.Query;
import com.project.surveyengine.model.CustomerContact;
import com.project.surveyengine.model.PatsTable;
import com.project.surveyengine.model.Role;
import com.project.surveyengine.model.User;
import com.project.surveyengine.service.impl.UserService;
import com.project.surveyengine.service.impl.CustomerContactService;
import com.project.surveyengine.service.impl.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Logger;

@Controller
public class UserController {
    @Autowired
    @Qualifier("userService")
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private CustomerContactService customerContactService;

    private static final Logger log = Logger.getLogger(ReportController.class.getName());

    @RequestMapping(value = "/admin/contacts", method = RequestMethod.GET)
    public String userRoleView(Model model){
        //Get email from Session
        String emailUserLogged = (String) SecurityContextHolder.getContext().getAuthentication().getCredentials();
        //Get all roles
        List<Role> listRoles = roleService.getAllRoles();
        String json = new Gson().toJson( listRoles );
        model.addAttribute("listRoles", json );
        model.addAttribute("emailUserLogged", emailUserLogged );

        return "users";
    }

    @RequestMapping(value = "/admin/get/users", method = RequestMethod.GET)
    public void getRoles(HttpServletRequest request, HttpServletResponse response) throws IOException {
        //Get email from Session
        String emailUerLogged = (String) SecurityContextHolder.getContext().getAuthentication().getCredentials();

        PatsTable table = new PatsTable();

        //Get Users
        Query<User> result = ObjectifyService.ofy().load().type(User.class);

        //Set values
        table.setDataUsers(result.list());
        table.setEmailUerLogged(emailUerLogged);

        String json = new Gson().toJson(table);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }

    @RequestMapping(value = "/admin/get/users-map", method = RequestMethod.GET)
    public void getContactsForMap(HttpServletRequest request, HttpServletResponse response) throws IOException {
        //Get email from Session
        String emailUerLogged = (String) SecurityContextHolder.getContext().getAuthentication().getCredentials();

        PatsTable table = new PatsTable();

        //Get Users for mapping (Taker and other reportee)
        List<User> listUsersMap = new ArrayList<>();
        List<User> listAllUser = userService.getAll();

        for(User user : listAllUser) {
            Iterator<Role> iterator = user.roles.iterator();
            while(iterator.hasNext()){
                Role role = iterator.next();
                if( role.getName().equals("ROLE_TAKER") || role.getName().equals("ROLE_OTHER_REPORTEE")
                    || role.getName().equals("ROLE_ADMIN") ){
                    listUsersMap.add(user);
                    break;
                }
            }
        }

        //Set values
        table.setDataUsers(listUsersMap);
        table.setEmailUerLogged(emailUerLogged);

        String json = new Gson().toJson(table);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }

    @RequestMapping(value = "/admin/find/user", method = RequestMethod.POST)
    public void findUserRoles(HttpServletRequest request,
                              HttpServletResponse response, String userEmail) throws Exception {

        User registered = userService.findByEmail(userEmail);

        if( registered == null ) {
            String json = new Gson().toJson("null");
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(json);
        } else {
            String userAccess = registered.roles.get(0).getName();
            String json = new Gson().toJson( userAccess );
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(json);
        }
    }

    @RequestMapping(value = "/admin/save/user", method = RequestMethod.POST)
    public void saveUserRoles(HttpServletRequest request,
                              HttpServletResponse response,
                              String userEmail,
                              String userFullName,
                              String accessUser) throws Exception {
        Role role;
        User registered = userService.findByEmail(userEmail);

        if( registered == null ) {
            User user = new User();
            user.isActive = true;
            user.email = userEmail;
            user.name = userFullName.toLowerCase();

            role = roleService.getByName( accessUser );
            user.roles.add(role);
            userService.save(user);

            //Update CustomerContact model with the new access
            List<CustomerContact> customerContactList = customerContactService.getAllMapsByUserEmail(userEmail);
            for(CustomerContact customerContact: customerContactList){
                List<Role> rolesList = new ArrayList<>();;
                Role roleModel = roleService.getByName(accessUser);
                rolesList.add(roleModel);
                customerContact.setContactRoles(rolesList);
                customerContactService.save(customerContact);
            }

            String json = new Gson().toJson("success");
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(json);
        }else{
            User user = new User();
            role = roleService.getByName( accessUser );
            user.roles.add(role);
            registered.roles = user.roles;

            userService.save(registered);

            //Update CustomerContact model with the new access
            List<CustomerContact> customerContactList = customerContactService.getAllMapsByUserEmail(userEmail);
            for(CustomerContact customerContact: customerContactList){
                List<Role> rolesList = new ArrayList<>();
                Role roleModel = roleService.getByName(accessUser);
                rolesList.add(roleModel);
                customerContact.setContactRoles(rolesList);

                customerContactService.save(customerContact);
            }

            String json = new Gson().toJson( "success" );
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(json);
        }
    }

    @RequestMapping(value = "/admin/remove/user", method = RequestMethod.POST)
    public void deleteUser(HttpServletRequest request,
                           HttpServletResponse response, String userEmail) throws Exception {

        userService.deleteUserAccount(userEmail);

        //Remove mappings from Contact deleted
        List<CustomerContact> customerContactList = customerContactService.getAllMapsByUserEmail(userEmail);
        for(CustomerContact customerContact: customerContactList){
            customerContactService.deleteCustomerContactMap(customerContact);
        }

        String json = new Gson().toJson( "success" );
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }
}