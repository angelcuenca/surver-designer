package com.project.surveyengine.model;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
public class CustomerExternalRating {
    @Id
    public Long id;

    @Index
    public String month;

    @Index
    public String year;

    @Index
    public String customer;

    @Index
    public String ratingType;

    @Index
    public String rating;

    @Index
    public String ratingPeriod;

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getCustomer() {
        return customer;
    }

    public void setCustomer(String customer) {
        this.customer = customer;
    }

    public String getRatingType() {
        return ratingType;
    }

    public void setRatingType(String ratingType) {
        this.ratingType = ratingType;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public String getRatingPeriod() {
        return ratingPeriod;
    }

    public void setRatingPeriod(String ratingPeriod) {
        this.ratingPeriod = ratingPeriod;
    }
}
