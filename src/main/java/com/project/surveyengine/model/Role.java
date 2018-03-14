package com.project.surveyengine.model;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import java.io.Serializable;

/**
 * Created by angel_cuenca on 19/08/16.
 */
@Entity
public class Role implements Serializable{
    @Id
    public Long id;

    @Index
    public String name;

    public Role(){

    }

    public Role(String name){
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String nameRole) {
        this.name = nameRole;
    }
}
