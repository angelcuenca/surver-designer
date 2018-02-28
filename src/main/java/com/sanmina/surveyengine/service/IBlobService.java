package com.sanmina.surveyengine.service;

import com.sanmina.surveyengine.model.Survey;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/**
 * Created by gerardo_martinez on 23/06/16.
 */
public interface IBlobService {


  String getBlobkey(HttpServletRequest req, String name);

  void getDownload(HttpServletRequest req, HttpServletResponse res) throws IOException;
}
