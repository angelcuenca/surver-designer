package com.project.surveyengine.util;


import com.project.surveyengine.model.GoogleProfile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

/**
 * Created by project on 25/11/2015.
 */
public class GoogleUtil {
    /**
     * @param token Google access_token to be validated against google
     * @return Returns GoogleProfile object with the user's data retrieved
     */
    public static GoogleProfile getGoogleProfile(String token) {
        RestTemplate template = new RestTemplate();
        String url = "https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token;
        ResponseEntity<GoogleProfile> forEntity = template.getForEntity(url, GoogleProfile.class);
        return forEntity.getBody();
    }
}
