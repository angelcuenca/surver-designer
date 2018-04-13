<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Survey Designer | Response</title>
        <link rel='shortcut icon' type='image/x-icon' href='/statics/img/survey-logo.png'/>
        <!-- Fonts -->
        <link href='https://fonts.googleapis.com/css?family=Maven+Pro:400,500,700,900' rel='stylesheet' type='text/css'>
        <!-- Bootstrap -->
        <link href="${pageContext.request.contextPath}/statics/css/bootstrap.css" rel="stylesheet">
        <!-- Custom-Style -->
        <link href="${pageContext.request.contextPath}/statics/css/custom-style.css" rel="stylesheet">
        <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
        <script src="${pageContext.request.contextPath}/statics/js/jquery.min.js"></script>
        <!-- jQuery UI -->
        <link rel="stylesheet" href="${pageContext.request.contextPath}/statics/css/jquery-ui.css">
    </head>
    <body>

    <c:choose>
        <c:when test="${statusResponse != 'EXPIRED' && statusResponse != 'AWAITING_EXPIRED'}">
            <!-- !Secondary nav bar -->
            <nav class="navbar navbar-static-top header-top shrink navbar-inverse mtop-0 col-xs-12 padding-0" id="navigation-b" style="z-index: 500">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-xs-12 padding-0">
                            <div class="navbar-header">
                                <img src="${pageContext.request.contextPath}/statics/img/survey-logo.png" class="logo pull-left mleft-10 mtop-10">
                                <a class="navbar-brand uppercase text-normal-size" href="#">
                                    <span>Customer Satisfaction Overview</span>
                                </a>
                            </div>
                            <div id="controlbuttons" class="col-sm-4 col-sm-offset-0 pull-right">
                                <div class="row">
                                    <div class="col-xs-12 col-sm-8 col-lg-6 pull-right">
                                        <button type="button" formnovalidate form="form" id="btn-submit" name="btn-submit" class="btn btn-success btn-lg btn-block navbar-btn uppercase text-bold btn-loading">
                                            <span class="content"><span class="ion-checkmark-round"></span> SUBMIT</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </c:when>
    </c:choose>

    <c:choose>
        <c:when test="${statusResponse == 'SUBMITTED'}">
            <!-- !Space top for survey answered view -->
             <section class="container-fluid mbottom-30">
            </section>
        </c:when>
    </c:choose>

    <!-- !Content -->
    <section class="container-fluid mbottom-10" id="main-content">
        <div class="row">
            <!-- visible only on smartphones -->
            <p class="h4 uppercase text-gray-darker visible-xs col-xs-12 mbottom-20">Customer Satisfaction Survey</p>
            <div class="col-lg-8 col-lg-offset-2 clearfix">
                <div class="panel panel-default mbottom-10">

                    <div class="panel-body">
                        <section class="row">
                            <div class="col-sm-12">
                                <form:form method="POST" enctype="multipart/form-data" id="form" action="${redirectAction}">
                                    <div class="panel-body">
                                        <section class="row">
                                            <div id="preview" class="col-sm-12" />
                                        </section>
                                    </div>
                                </form:form>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <%--xmlContent--%>
    <textarea style="display: none;" id="code" name="xmlContent" cols="120" rows="100" name="foo">${xmlContent}</textarea>

    <!-- !Footer -->
    <!--<jsp:include page="partial/_footer.jsp"/>-->
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="${pageContext.request.contextPath}/statics/js/bootstrap.min.js"></script>
    <!-- jQuery UI -->
    <script src="${pageContext.request.contextPath}/statics/js/jquery-ui.js"></script>
    <!-- Survey Engine Commons-->
    <script src="${pageContext.request.contextPath}/statics/js/surveyengine.js"></script>
    <script src="${pageContext.request.contextPath}/statics/js/surveyengine.answer.js"></script>
    <%-- Moment JS--%>
    <script src="${pageContext.request.contextPath}/statics/js/moment.js"></script>
    <script src="${pageContext.request.contextPath}/statics/js/moment-timezone-with-data.js"></script>
    <!-- Pnotify -->
    <script src="${pageContext.request.contextPath}/statics/js/pnotify.custom.js"></script>

    <script>
        const months = ['', 'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
            'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']

        /* Create List with all survey responses */
        var listAnswers = new Array();
        <c:forEach items="${surveyAnswers}" var="listAnswers">
            var answer = new Object();
            answer.InputId = '${listAnswers.inputId}';
            answer.QuestionText = '${listAnswers.questionText}';
            answer.Answer = '${listAnswers.answer}';
            answer.type = '${listAnswers.type}';
            listAnswers.push(answer);
        </c:forEach>

        var listAwaitingResponses = [];
        <c:forEach items="${awaitingResponses}" var="awaitingResponse">
            var awaitingResponse = {};
            awaitingResponse.customer = '${awaitingResponse.customerCode}';
            awaitingResponse.id = '${awaitingResponse.id}';
            awaitingResponse.surveyId = '${awaitingResponse.surveyId}';
            listAwaitingResponses.push(awaitingResponse);
        </c:forEach>

        var surveyAnswer = SurveyEngine.surveyAnswer;
        surveyAnswer.ready(listAnswers, listAwaitingResponses, "${notify}", "${statusResponse}", "${expirationDate}", months['${fiscalMonth}'], "${fiscalYear}", "${activeResponse}", "${contact}");

    </script>
    </body>
</html>