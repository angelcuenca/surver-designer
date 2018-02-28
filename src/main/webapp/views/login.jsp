<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sanmina secure access</title>

    <link href="//fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css">
    <link href='//fonts.googleapis.com/css?family=Kaushan+Script' rel='stylesheet' type='text/css'>
    <link href='//fonts.googleapis.com/css?family=Droid+Serif:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
    <link href='//fonts.googleapis.com/css?family=Roboto+Slab:400,100,300,700' rel='stylesheet' type='text/css'>
    <%--Bootstrap Theme--%>
    <link href="${pageContext.request.contextPath}/statics/css/bootstrap.css" rel="stylesheet">
    <%--Scripts--%>
    <script src="${pageContext.request.contextPath}/statics/js/jquery.min.js"></script>
    <script src="${pageContext.request.contextPath}/statics/js/hello.js"></script>
    <script src="${pageContext.request.contextPath}/statics/js/surveyengine.js"></script>
    <script src="${pageContext.request.contextPath}/statics/js/surveyengine.login.js"></script>
</head>
<body class='body'>
    <div class='container'>
        <div class='col-sm-8 col-sm-offset-2 mtop-10' style="top: 70px;">
            <div class="row">
                <div class="col-xs-6">
                    <h2 class="mtop-20 mbottom-5">Welcome</h2>
                </div>
                <div class="col-xs-6">
                    <img src="${pageContext.request.contextPath}/statics/img/sanmina-100x56.png" width="25%" class="pull-right mbottom-10">
                </div>
            </div>
            <div class="row panel panel-default">
                <div class="col-xs-12 bg-gray-darker">
                    <img src="${pageContext.request.contextPath}/statics/img/secure-access-header.png" width="55%" class="mtop-20 img-responsive center-block">
                </div>
                <form role="form col-xs-12">
                    <div class="clearfix">
                        <div class="col-lg-6 col-md-5 mtop-15 clearfix">
                            <!-- Remove ".hide" class to show the alert, show this alert for errors-->
                            <div class="alert alert-danger hide"><b>Incorrect user or password</b></div>
                            <!-- Remove ".hide" class to show the alert, show this alert whenever the-->
                            <div class="alert alert-success alert-dismissable hide"><button type="button" class="close" data-dismiss="alert" aria-hidden="true"></button><b>You was successfully logged out</b></div>
                            <h3 class="text-center" style="margin-top: 100px;">Surveys Engine System</h3><br/>
                            <button id="btn-login" type="button" class="btn btn-lg btn-danger col-lg-6 col-sm-offset-1" onclick="javascript:SurveyEngine.login.login();" style="margin-left: 90px;">
                                Sign In
                            </button>
                        </div>
                        <div class="col-lg-6 col-md-7 mtop-10 mbottom-10">
                            <div class="clearfix well well-info">
                                <div class="col-xs-12 text-justify">
                                    <h5 class="text-center">SANIMNA CORPORATION ELECTRONIC<br/>
                                        WORKSPACE LEGAL NOTICE</h5>
                                    <p class="text-smaller">
                                        This is a Sanmina Corporation electronic workspace. This system is provided for the business use of Sanmina and its Partners, including customers and suppliers. All information, including personal information, placed on or sent over this system may be monitored, examined, recorded, and/or copied, subject to the terms of any Non-Disclosure Agreement that may exist between Sanmina and its Partners. This system is also governed by all applicable federal, state and local laws, including U.S. export laws. Accordingly, you may not place or send any information over this system that violates any of those laws or infringes on the rights of any third party. For example, information known to fall under the requirements of the International Traffic in Arms Regulations (ITAR) or Export Administration Regulations (EAR) should not be placed on or sent over this system. Unauthorized use or access to this system is strictly prohibited and may be subject to legal action. Complete terms and conditions of use are available <a href="//www.sanmina.com/company-profile/legal-information/index.php" target="_blank">here</a>. By use of this system, the user consents to the terms of this Notice.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <script>

        $(document).ready(function(){
            SurveyEngine.login.init();
        });
    </script>
</body>
</html>

