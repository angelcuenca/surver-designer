package com.sanmina.surveyengine.model;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
public class RatingType {
    @Id
    public Long id;

    @Index
    public String ratingTypeName;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRatingTypeName() {
        return ratingTypeName;
    }

    public void setRatingTypeName(String ratingTypeName) {
        this.ratingTypeName = ratingTypeName;
    }
}
