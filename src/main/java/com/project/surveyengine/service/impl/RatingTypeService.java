package com.project.surveyengine.service.impl;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import com.project.surveyengine.model.RatingType;
import com.project.surveyengine.service.IRatingTypeService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RatingTypeService implements IRatingTypeService{
    ObjectifyService objectifyService;

    @Override
    public List<RatingType> getAll() {
        return objectifyService.ofy().load().type(RatingType.class).list();
    }

    @Override
    public RatingType getRatingTypeByName(String name) {
        RatingType ratingType = objectifyService.ofy().load().type(RatingType.class).filter("ratingTypeName", name).first().now();
        return ratingType;
    }

    @Override
    public RatingType getRatingTypeById(long id) {
        for (RatingType ratingType: ObjectifyService.ofy().load().type(RatingType.class).list()) {
            if(ratingType.getId() == (id)){
                return ratingType;
            }
        }
        return null;
    }

    @Override
    public Long saveRatingType(RatingType ratingType) {
        Key<RatingType> generatedKey = objectifyService.ofy().save().entity(ratingType).now();
        return generatedKey.getId();
    }

    @Override
    public void deleteRatingType(RatingType ratingType) {
        objectifyService.ofy().delete().entity(this.getRatingTypeByName(ratingType.getRatingTypeName())).now();
    }
}
