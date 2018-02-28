<%--
  Created by IntelliJ IDEA.
  User: arlette_parra
  Date: 11/10/17
  Time: 10:35 AM
  To change this template use File | Settings | File Templates.
--%>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>CSO | Dashboard</title>
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
    <nav class="navbar header-top navbar-static-top shrink navbar-inverse mtop-0 col-xs-12 padding-0" id="navigation-b">
        <div class="container-fluid">
            <div class="row">
                <div class="col-xs-12 padding-0">
                    <div class="col-sm-6 col-xs-2">
                        <div class="row">
                            <!-- hidden on smartphones -->
                            <p class="pull-left h4 uppercase navbar-text hidden-xs">Dashboard</p>
                        </div>
                    </div>
                    <div class="col-sm-4 col-sm-offset-0 pull-right">
                        <div class="row">
                            <div class="col-xs-12 col-sm-8 col-lg-6 pull-right">
                                <button type="button" id="btn-submit" onclick="document.location.href='${pageContext.request.contextPath}/survey/designer'" class="btn btn-success btn-lg btn-block navbar-btn uppercase text-bold btn-loading" >
                                    <span class="content visible-lg"><span class="ion-plus-circled"></span> New Survey</span>
                                    <!-- Visible on medium size screens and tablets -->
                                    <span class="content hidden-lg"><span class="ion-plus-circled"></span> New Survey</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <section class="container-fluid" id="main-content">
            <%-- React root--%>
            <div id="dashboard-table"/>

    </section>

</body>

<%-- Bootstrap JS --%>
<script src="${pageContext.request.contextPath}/statics/js/bootstrap.min.js"></script>
<%-- jQuery UI --%>
<script src="${pageContext.request.contextPath}/statics/js/jquery-ui.js"></script>
<%-- React JS --%>
<script src="${pageContext.request.contextPath}/statics/js/react.min.js"></script>
<script src="${pageContext.request.contextPath}/statics/js/react-dom.min.js"></script>
<script src="${pageContext.request.contextPath}/statics/js/babel.min.js" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/statics/js/react-table.js"></script>
<script type="text/babel" src="${pageContext.request.contextPath}/statics/js/diacritics.js"></script>
<script type="text/babel" src="${pageContext.request.contextPath}/statics/js/match-sorter.js"></script>
<script type="text/babel" src="${pageContext.request.contextPath}/statics/js/surveyengine.react.dashboard-table.js"></script>

<script>
    var ReactTable = window.ReactTable.default;
</script>
</html>
