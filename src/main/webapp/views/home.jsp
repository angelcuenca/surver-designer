<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/security/tags" %>
<%@ page contentType="text/html;charset=UTF-8" language="java"%>

<%--
  Created by IntelliJ IDEA.
  User: angel_cuenca
  Date: 16/10/17
  Time: 05:22 PM
  To change this template use File | Settings | File Templates.
--%>

<html lang="en">
<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Survey Designer</title>
    <link rel='shortcut icon' type='image/x-icon' href='${pageContext.request.contextPath}/statics/img/survey-icon.png'/>
    <!-- Fonts -->
    <link href='https://fonts.googleapis.com/css?family=Maven+Pro:400,500,700,900' rel='stylesheet' type='text/css'>
    <!-- Bootstrap -->
    <link href="${pageContext.request.contextPath}/statics/css/bootstrap.css" rel="stylesheet">
    <!-- Custom-Style -->
    <link href="${pageContext.request.contextPath}/statics/css/surveyengine.react.css" rel="stylesheet">
    <!-- jQuery UI -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/statics/css/jquery-ui.css">
    <!-- jQuery UI -->
    <script src="${pageContext.request.contextPath}/statics/js/jquery.min.js"></script>
    <script src="${pageContext.request.contextPath}/statics/js/bootstrap.min.js"></script>
    <!-- PNotify -->
    <link href="${pageContext.request.contextPath}/statics/css/pnotify.custom.css" rel="stylesheet">
    <script src="${pageContext.request.contextPath}/statics/js/pnotify.custom.js"></script>
    <!-- ReactJS Table -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/statics/css/react-table.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/statics/css/custom-style.css">
</head>
<body>

<%--Header--%>
<s:authorize access="hasRole('ROLE_ADMIN')">
    <jsp:include page="partial/_header.jsp"/>
</s:authorize>

<div>
    <!-- !Secondary nav bar -->
    <nav class="navbar header-top navbar-static-top shrink navbar-inverse mtop-0 col-xs-12 padding-0" id="navigation-b" style="z-index: 500; background-color: #3c3c3c;">
        <div class="container-fluid">
            <div class="row">
                <div class="col-xs-12 padding-0">
                    <s:authorize access="!hasRole('ROLE_ADMIN')">
                        <div class="navbar-header">
                            <img src="${pageContext.request.contextPath}/statics/img/survey-logo.png" class="logo pull-left mtop-10 mleft-10">
                            <a class="navbar-brand uppercase text-normal-size" href="#">
                                <span>Survey Designer</span>
                            </a>
                        </div>
                        <div class="mtop-10 col-lg-2 pull-right mright-25">
                            <button id="btn-login" type="button" class="btn btn-lg btn-danger col-lg-6 col-lg-offset-4" onclick="loginGoogle()" style="margin-left: 120px;">
                                Sign In
                            </button>
                        </div>
                    </s:authorize>
                    <s:authorize access="hasRole('ROLE_ADMIN')">
                        <div class="col-sm-6 col-xs-4">
                            <div class="row">
                                <!-- hidden on smartphones -->
                                <p class="pull-left h4 uppercase navbar-text mleft-15">HOME</p>
                            </div>
                        </div>
                    </s:authorize>
                </div>
            </div>
        </div>
    </nav>

    <div id="home-page"></div>

</div>

<!-- M O D A L   T O   R E - S E N D -->
<div class="modal fade bs-example-modal-md" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" id="HomeResendModal">
    <div class="modal-dialog modal-md">
        <div class="modal-content">

            <div id="resend-modal"></div>

        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div>

<jsp:include page="partial/_footer.jsp"/>

<!-- jQuery UI -->
<script src="${pageContext.request.contextPath}/statics/js/jquery-ui.js"></script>
<!-- Survey Engine Commons -->
<script src="${pageContext.request.contextPath}/statics/js/surveyengine.js"></script>
<!-- Pnotify -->
<script src="${pageContext.request.contextPath}/statics/js/pnotify.custom.js"></script>
<!-- ReactJS -->
<script src="${pageContext.request.contextPath}/statics/js/react.min.js"></script>
<script src="${pageContext.request.contextPath}/statics/js/react-dom.min.js"></script>
<script src="${pageContext.request.contextPath}/statics/js/babel.min.js" charset="utf-8"></script>
<script type="text/babel" src="${pageContext.request.contextPath}/statics/js/surveyengine.react.home.js"></script>
<!-- ReactJS Table -->
<script src="${pageContext.request.contextPath}/statics/js/react-table.js"></script>
<script>
    let ReactTable = window.ReactTable.default
</script>
<script type="text/babel" src="${pageContext.request.contextPath}/statics/js/diacritics.js"></script>
<script type="text/babel" src="${pageContext.request.contextPath}/statics/js/match-sorter.js"></script>
<!-- Login Google -->
<script src="${pageContext.request.contextPath}/statics/js/hello.js"></script>
<script src="${pageContext.request.contextPath}/statics/js/surveyengine.js"></script>
<script src="${pageContext.request.contextPath}/statics/js/surveyengine.login.js"></script>
<script>
    $(document).ready(function(){
        SurveyEngine.login.verifySession();
    });

    function loginGoogle(){
        $(document).ready(function(){
            SurveyEngine.login.init();
        });
    }
</script>
</body>
</html>

