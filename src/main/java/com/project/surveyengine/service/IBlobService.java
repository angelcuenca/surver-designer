package com.project.surveyengine.service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by gerardo_martinez on 23/06/16.
 */
public interface IBlobService {


  String getBlobkey(HttpServletRequest req, String name);

  void getDownload(HttpServletRequest req, HttpServletResponse res) throws IOException;
}
