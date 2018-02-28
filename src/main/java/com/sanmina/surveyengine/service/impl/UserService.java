package com.sanmina.surveyengine.service.impl;

import com.googlecode.objectify.ObjectifyService;
import com.sanmina.surveyengine.model.GoogleProfile;
import com.sanmina.surveyengine.model.Role;
import com.sanmina.surveyengine.model.User;
import com.sanmina.surveyengine.service.IRoleService;
import com.sanmina.surveyengine.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Created by gemas on 20/11/2015.
 */
@Service
@Qualifier("userService")
public class UserService implements IUserService {

    ObjectifyService objectifyService;

    @Autowired
    private IRoleService roleService;

    @Override
    public List<User> getAll() {
        return objectifyService.ofy().load().type(User.class).list();
    }

    @Override
    public User save(final User user) {
        objectifyService.ofy().save().entity(user).now();

        return user;
    }

    @Override
    public boolean addRole(String email, String roleName) {
        User user = this.findByEmail(email);
        Role rol = roleService.getByName(roleName);

        Iterator<Role> iterator = user.roles.iterator();
        while(iterator.hasNext()){
            Role role = iterator.next();
            if(role.getName().equals(rol.getName())){
                //Returns false if role already exists
                return false;
            }
        }

        user.roles.add(rol);
        this.save(user);
        return true;
    }

    @Override
    public List<User> getListUserByRole(String roleName){
        List<User> listUserByRole = new ArrayList<>();
        List<User> listAllUser = this.getAll();
        Role rol = roleService.getByName(roleName);

        //Returns a list build by the Role received
        for(User user : listAllUser) {
            Iterator<Role> iterator = user.roles.iterator();
            while(iterator.hasNext()){
                Role role = iterator.next();
                if(role.getName().equals(rol.getName()) || role.getName().equalsIgnoreCase("ROLE_ADMIN")){
                    listUserByRole.add(user);
                    break;
                }
            }
        }

        return listUserByRole;
    }

    @Override
    public boolean removeRole(String email, String roleName){
        User user = this.findByEmail(email);
        Role rol = roleService.getByName(roleName);

        //Returns true if role was removed successfully
        Iterator<Role> iterator = user.roles.iterator();
        while(iterator.hasNext()){
            Role role = iterator.next();
            if(role.getName().equals(rol.getName())){
                iterator.remove();
                this.save(user);
                return true;
            }
        }

        return false;
    }

    @Override
    public void deleteUserAccount(String email) {
        User user = this.findByEmail(email);
        objectifyService.ofy().delete().entity(user).now();
    }

    @Override
    public User verifyUserAccount(GoogleProfile googleProfile) {

        User registered = this.findByEmail(googleProfile.getEmail());
        if(registered != null){
            if( this.userHasRole(registered, "ROLE_ADMIN") ){
                return registered;
            }else{
                return null;
            }
        }else{
            if( googleProfile.getEmail().equalsIgnoreCase("angel.cuenca@sanmina.com") || googleProfile.getEmail().equalsIgnoreCase("arlette.parra@sanmina.com") ){
                //Create the user if it does not exist
                User user = new User(googleProfile.getEmail());
                user.setName(googleProfile.getName().toLowerCase());
                user.setPicture(googleProfile.getPicture());

                //Add default role for new user
                Role role = roleService.getByName("ROLE_ADMIN");
                user.roles.add(role);

                return this.save(user);
            }else{
                return null;
            }
        }
    }

    @Override
    public User getUserById(long id) {
        for (User user: ObjectifyService.ofy().load().type(User.class).list()) {
            if(user.getId() == (id)){
                return user;
            }
        }
        return null;
    }

    /**
     * Gets an employee based on its email
     * @param email User's email
     * @return User object with the users data existing in the database
     */
    @Override
    public User findByEmail(String email) {
        User user = objectifyService.ofy().load().type(User.class).filter("email", email).first().now();
        return user;
    }

    @Override
    public boolean userHasRole(User user, String role){
        if (user != null){
            return user.getRoles().stream().anyMatch(
                    userRole -> userRole.name.equals(role));
        }
        return false;
    }

}
