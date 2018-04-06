<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%--
  Created by IntelliJ IDEA.
  User: project
  Date: 22/06/16
  Time: 05:22 PM
  To change this template use File | Settings | File Templates.
--%>
<html lang="en">

<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Survey Saved</title>
    <link rel='shortcut icon' type='image/x-icon' href='${pageContext.request.contextPath}/statics/img/survey-logo.png'/>
    <!-- Fonts -->
    <link href='https://fonts.googleapis.com/css?family=Maven+Pro:400,500,700,900' rel='stylesheet' type='text/css'>
    <!-- Bootstrap -->
    <link href="${pageContext.request.contextPath}/statics/css/bootstrap.css" rel="stylesheet">
    <!-- Custom-Style -->
    <link href="${pageContext.request.contextPath}/statics/css/custom-style.css" rel="stylesheet">
    <!-- jQuery UI -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/statics/css/jquery-ui.css">

</head>
<body>
<%--header--%>
<section id="main-content">
     <div class="intro-body">
         <div class="container">
             <div class="col-lg-10 col-lg-offset-1  mtop-10 mbottom-50">
                 <div class="row">
                     <div class="col-xs-11 border-bottom-gray-light">
                         <img src="${pageContext.request.contextPath}/statics/img/sanmina-100x56.png" class="pull-right mtop-10 mbottom-20">
                     </div>
                 </div>
                 <div class="row mtop-50">
                     <div class="col-sm-4 sanm-errorgraphic mtop-30" id="graphic">
                         <!-- Change this to absolute -->
                         <img src="${pageContext.request.contextPath}/statics/img/survey-logo.png" alt="survey logo" class="img-responsive img-circle btn-shadow">
                         <div class="well mtop-20" id="support">
                             <p class="text-center">
                                 App owner:<br>
                                 <a href="mailto:the.owner@sanmina.com" target="_blank">
                                     kavita.sharma@sanmina.com
                                 </a>
                                 <br><br>
                                 <small>Please contact <a href="mailto:help.desk@sanmina.com" target="_blank">Help desk</a> if you need more assitance.</small>
                             </p>
                         </div>
                     </div>
                     <div class="col-sm-8 mtop-10 sanm-error-text">
                         <h1 id="main-title">Thanks for answering!</h1>
                         <div class="row">
                             <div class="col-xs-12 mbottom-10 mtop-10 text-gray-darker">
                                 <span class="uppercase" id="detail">Your response has been submitted.</span>
                             </div>
                             <div class="col-xs-12 mtop-15">
                                 <button href="/home" onclick="document.location.href='/home'" type="button" class="btn btn-lg btn-default" id="home-button">
                                     <span class="ion-home"></span> Take me home
                                 </button>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
         </div>
    </div>
</section>
</body>
</html>
