package com.sanmina.surveyengine.model;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by ange_cuenca on Winter 2017
 */
@Entity
public class CustomerContact implements Serializable{
    @Id
    Long id;

    @Index
    public String customerName;

    @Index
    public String contactEmail;

    @Index
    public String contactName;

    @Index
    public List<Role> contactRoles = new ArrayList<>();

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public List<Role> getContactRoles() {
        return contactRoles;
    }

    public void setContactRoles(List<Role> contactRoles) {
        this.contactRoles = contactRoles;
    }
}
