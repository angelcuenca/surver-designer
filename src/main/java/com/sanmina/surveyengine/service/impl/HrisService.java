package com.sanmina.surveyengine.service.impl;

import com.sanmina.surveyengine.model.HrisUser;
import com.sanmina.surveyengine.service.IHrisService;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import javax.net.ssl.HttpsURLConnection;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by gerardo_martinez on 8/21/14.
 */
@Service
public class HrisService implements IHrisService {

    @Override
    public List<HrisUser> getUser(String userName, String employeeNumber, String name, String mail) throws Exception {

        String url = "https://hris.sanmina.com/WebServices/wsActiveDirectory/wsActiveDirectory.asmx/dsGetADUserDetails";
        URL obj = new URL(url);
        HttpsURLConnection con = (HttpsURLConnection) obj.openConnection();

        con.setRequestMethod("POST");
        con.setRequestProperty("User-Agent", "Mozilla/5.0");
        con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");
        con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

        String urlParameters = "pstrEmployeeNumber=" + employeeNumber + "&pstrUserName=" + userName + "&pstrEmployeeName=" + name + "&pstrEmployeeGivenName=&pstrEmailID="+ mail
                                +"&pstrMobileNumber=&pstrTelePhoneNumber=&pstrStateName=&pstrCompanyName=&pstrStreetAddress=&pstrLocation=&pstrCountryName=&pstrCountryShortName=&pstrCountryCode=&pstrJobTitle=&pstrDepartment=";

        con.setDoOutput(true);
        DataOutputStream wr = new DataOutputStream(con.getOutputStream());
        wr.writeBytes(urlParameters);
        wr.flush();
        wr.close();

        int responseCode = con.getResponseCode();

        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuffer response = new StringBuffer();

        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();

        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder;
        builder = factory.newDocumentBuilder();
        Document document = builder.parse( new InputSource( new StringReader( response.toString() ) ) );

        document.getDocumentElement().normalize();
        document.getDocumentElement().getNodeName();

        NodeList nList = document.getElementsByTagName("Table1");
        List<HrisUser> usersList = new ArrayList<HrisUser>();

        HrisUser user;
        for (int temp = 0; temp < nList.getLength(); temp++) {
            user = new HrisUser();
            Node nNode = nList.item(temp);

            if (nNode.getNodeType() == Node.ELEMENT_NODE) {
                Element eElement = (Element) nNode;
                try{
                    if(eElement.getElementsByTagName("samaccountname").item(0).getTextContent().toLowerCase() != null){
                        user.setUserName(eElement.getElementsByTagName("samaccountname").item(0).getTextContent().toLowerCase() );
                        user.setEmployeeNumber(eElement.getElementsByTagName("employeeid").item(0).getTextContent());
                        user.setName(eElement.getElementsByTagName("name").item(0).getTextContent());
                        user.setMail(eElement.getElementsByTagName("mail").item(0).getTextContent());

                        if(!user.getUserName().startsWith("a_")){
                            usersList.add(user);
                        }
                    }
                }catch(Exception e){
                    e.printStackTrace();
                }
            }
        }
        return usersList;
    }
}