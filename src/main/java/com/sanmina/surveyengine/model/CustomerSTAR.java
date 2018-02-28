package com.sanmina.surveyengine.model;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

/**
 * Created by arlette_parra on 19/01/18.
 */
@Entity
public class CustomerSTAR {

    @Id
    public Long id;

    @Index
    public String customerCode;

    @Index
    public String customerName;

    @Index
    public String masterCustomerCode;

    @Index
    public String masterCustomerName;


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

    public void setMasterCustomerCode(String masterCustomerCode) {
        this.masterCustomerCode = masterCustomerCode;
    }

    public void setMasterCustomerName(String masterCustomerName) {
        this.masterCustomerName = masterCustomerName;
    }

    public CustomerSTAR() {
    }

    public CustomerSTAR(String customerCode, String customerName){
        this.customerCode = customerCode;
        this.customerName = customerName;
    }
}
