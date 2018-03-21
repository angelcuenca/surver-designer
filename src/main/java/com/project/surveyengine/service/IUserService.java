package com.project.surveyengine.service;

import com.project.surveyengine.model.GoogleProfile;
import com.project.surveyengine.model.User;

import java.util.List;

/**
 * Created by project on 20/11/2015.
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
