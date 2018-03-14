package com.project.surveyengine.service;

import com.project.surveyengine.model.Role;

import java.util.List;

/**
 * Created by angel_cuenca on 19/08/16.
 */
public interface IRoleService {
    long save(Role role);
    Role getByName(String role);
    List<Role> getAllRoles();
}
