<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Survey Designer | Inbox</title>
    <link rel='shortcut icon' type='image/x-icon' href='/statics/img/survey-logo.png'/>

    <%-- Fonts --%>
    <link href='https://fonts.googleapis.com/css?family=Maven+Pro:400,500,700,900' rel="stylesheet" type='text/css'>
    <%-- Bootstrap --%>
    <link href="${pageContext.request.contextPath}/statics/css/bootstrap.css" rel="stylesheet">
    <%-- jQuery UI --%>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/statics/css/jquery-ui.css" rel="stylesheet">
    <%-- CSS --%>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/statics/css/react-table.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/statics/css/custom-style.css" rel="stylesheet">
    <%-- jQuery --%>
    <script src="${pageContext.request.contextPath}/statics/js/jquery.min.js"></script>
</head>

<body>
    <%--Header--%>
    <jsp:include page="partial/_header.jsp"/>

    <%-- Secondary nav bar --%>
    <nav class="navbar shrink navbar-inverse mtop-0 col-xs-12 padding-0 header-top" id="navigation-b">
        <div class="container-fluid">
            <div class="row">
                <div class="col-xs-12 padding-0">
                    <div class="col-sm-6 col-xs-6">
                        <div class="row">
                            <a href="javascript:history.go(-1)" class="btn navbar-btn-lg btn-gray-dark pull-left">
                                <span class="ion-arrow-left-c text-bigger"></span>
                            </a>
                            <!-- hidden on smartphones -->
                            <p class="pull-left h4 uppercase navbar-text mleft-15">INBOX</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <section class="container-fluid" id="main-content">
        <%-- React root--%>
        <div id="inbox-table"/>
    </section>

    <%-- Bootstrap JS --%>
    <script src="${pageContext.request.contextPath}/statics/js/bootstrap.min.js"></script>
    <%-- jQuery UI --%>
    <script src="${pageContext.request.contextPath}/statics/js/jquery-ui.js"></script>
    <%-- Moment JS--%>
    <script src="${pageContext.request.contextPath}/statics/js/moment.js"></script>
    <script src="${pageContext.request.contextPath}/statics/js/moment-timezone-with-data.js"></script>
    <%-- React JS --%>
    <script src="${pageContext.request.contextPath}/statics/js/react.min.js"></script>
    <script src="${pageContext.request.contextPath}/statics/js/react-dom.min.js"></script>
    <script src="${pageContext.request.contextPath}/statics/js/babel.min.js" charset="utf-8"></script>
    <script src="${pageContext.request.contextPath}/statics/js/react-table.js"></script>
    <script type="text/babel" src="${pageContext.request.contextPath}/statics/js/diacritics.js"></script>
    <script type="text/babel" src="${pageContext.request.contextPath}/statics/js/match-sorter.js"></script>
    <script type="text/babel" src="${pageContext.request.contextPath}/statics/js/surveyengine.react.inbox-table.js"></script>

    <script>
        var ReactTable = window.ReactTable.default;
    </script>
</body>
</html>