package com.project.surveyengine.service.impl;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import com.project.surveyengine.model.Role;
import com.project.surveyengine.service.IRoleService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by angel_cuenca on 19/08/16.
 */
@Service
public class RoleService implements IRoleService {

    ObjectifyService objectifyService;

    @Override
    public long save(Role role) {
        if(this.getByName(role.getName()) == null) {
            Key<Role> generatedKey = objectifyService.ofy().save().entity(role).now();
            return generatedKey.getId();
        }
        return 0;
    }

    @Override
    public Role getByName(String role){
        return ObjectifyService.ofy().load().type(Role.class).filter("name", role).first().now();
    }

    @Override
    public List<Role> getAllRoles() {
        return ObjectifyService.ofy().load().type(Role.class).list();
    }
}
