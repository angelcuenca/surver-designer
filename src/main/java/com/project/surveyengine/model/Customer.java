package com.project.surveyengine.model;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import java.util.List;


/**
 * Created by angel_cuenca on 22/07/16.
 */
@Entity
public class Customer {

    @Id
    public Long id;

    @Index
    public String customerCode;

    @Index
    public String customerName;

    public List<User> userList;

    @Index
    public boolean isActive;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return customerCode;
    }

    public void setCode(String customerCode) {
        this.customerCode = customerCode;
    }

    public String getName() {
        return customerName;
    }

    public void setName(String customerName) {
        this.customerName = customerName;
    }

    public List<User> getContactList() {
        return userList;
    }

    public void setContactList(List<User> contactList) {
        this.userList = contactList;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public Customer() {
    }

    public Customer(String customerCode, String customerName){
        this.customerCode = customerCode;
        this.customerName = customerName;
        this.isActive = true;
    }
}
