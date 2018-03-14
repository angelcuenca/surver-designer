package com.project.surveyengine.service.impl;

import com.google.appengine.api.blobstore.*;
import com.project.surveyengine.service.IBlobService;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;


@Service
public class BlobService implements IBlobService {
  private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
  @Override
  public String getBlobkey(HttpServletRequest req, String name) {

    Map<String, List<BlobKey>> blobs = blobstoreService.getUploads(req);
    List<BlobKey> blobKeys = blobs.get(name);
    //System.out.println("BlobKey: "+blobKeys.get(0).getKeyString());
    return blobKeys.get(0).getKeyString();
  }
  @Override
  public void getDownload(HttpServletRequest req, HttpServletResponse res) throws IOException {

    BlobKey blobKey = new BlobKey(req.getParameter("blob-key"));
    BlobInfo blobInfo =  new BlobInfoFactory().loadBlobInfo(blobKey);
    res.setContentType(blobInfo.getContentType());
    res.setHeader("Content-Disposition", "filename=" + blobInfo.getFilename());
    blobstoreService.serve(blobKey, res);
  }

}
