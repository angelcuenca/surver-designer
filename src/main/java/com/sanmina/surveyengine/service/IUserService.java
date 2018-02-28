package com.sanmina.surveyengine.service;

import com.sanmina.surveyengine.model.GoogleProfile;
import com.sanmina.surveyengine.model.Role;
import com.sanmina.surveyengine.model.User;

import java.util.List;

/**
 * Created by gemas on 20/11/2015.
 */
public interface IUserService {

    User verifyUserAccount(GoogleProfile googleProfile);
    User findByEmail(String email);
    List<User> getAll();
    User save(User user);
    boolean addRole(String email, String role);
    boolean removeRole(String email, String role);
    User getUserById(long id);
    void deleteUserAccount(String id);
    List<User> getListUserByRole(String roleName);
    boolean userHasRole(User user, String role);
}
