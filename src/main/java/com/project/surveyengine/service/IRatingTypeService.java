package com.project.surveyengine.service;


import com.project.surveyengine.model.RatingType;

import java.util.List;

public interface IRatingTypeService {
    List<RatingType> getAll();
    RatingType getRatingTypeByName(String name);
    Long saveRatingType(RatingType ratingType);
    void deleteRatingType(RatingType ratingType);
    RatingType getRatingTypeById(long id);
}
