package com.sanmina.surveyengine.service;

import com.sanmina.surveyengine.model.Role;

import java.util.List;

/**
 * Created by angel_cuenca on 19/08/16.
 */
public interface IRoleService {
    long save(Role role);
    Role getByName(String role);
    List<Role> getAllRoles();
}
