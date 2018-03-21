<%--
  Created by IntelliJ IDEA.
  User: project
  Date: 11/10/17
  Time: 10:35 AM
  To change this template use File | Settings | File Templates.
--%>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>CSO | Report</title>
    <link rel='shortcut icon' type='image/x-icon' href='/statics/img/survey-logo.png'/>

    <%-- Fonts --%>
    <link href='https://fonts.googleapis.com/css?family=Maven+Pro:400,500,700,900' rel="stylesheet" type='text/css'>
    <%-- Bootstrap --%>
    <link href="${pageContext.request.contextPath}/statics/css/bootstrap.css" rel="stylesheet">
    <%-- CSS --%>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/statics/css/react-table.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/statics/css/custom-style.css" rel="stylesheet">

</head>
<body>
    <%-- Secondary nav bar --%>
    <nav class="navbar header-top navbar-static-top shrink navbar-inverse mtop-0 col-xs-12 padding-0" id="navigation-b">
        <div class="container-fluid">
            <div class="row">
                <div class="col-xs-12 padding-0">
                    <div class="col-sm-6 col-xs-2">
                        <div class="row">
                            <div class="navbar-header mleft-15">
                                <img src="${pageContext.request.contextPath}/statics/img/survey-logo.png" class="logo pull-left mtop-10">
                            </div>

                            <!-- hidden on smartphones -->
                            <p class="pull-left h4 uppercase navbar-text hidden-xs">Monthly Overview Pre-Report</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <section class="container-fluid mbottom-20" id="main-content">
        <%-- React root--%>
        <div id="report-table"/>
    </section>

    <%-- Survey Engine Commons --%>
    <script src="${pageContext.request.contextPath}/statics/js/surveyengine.js"></script>
    <%-- React JS --%>
    <script src="${pageContext.request.contextPath}/statics/js/react.min.js"></script>
    <script src="${pageContext.request.contextPath}/statics/js/react-dom.min.js"></script>
    <script src="${pageContext.request.contextPath}/statics/js/babel.min.js" charset="utf-8"></script>
    <script src="${pageContext.request.contextPath}/statics/js/react-table.js"></script>
    <script type="text/babel" src="${pageContext.request.contextPath}/statics/js/surveyengine.react.pre-report-table.js"></script>
    <script>
        var ReactTable = window.ReactTable.default;

    </script>
</body>
</html>
