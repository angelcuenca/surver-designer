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
    <script src="${pageContext.request.contextPath}/statics/js/jquery.min.js"></script>
    <%-- jQuery UI --%>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/statics/css/jquery-ui.css" rel="stylesheet">
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
                            <a href="javascript:history.go(-1)" class="btn navbar-btn-lg btn-gray-dark pull-left">
                                <span class="ion-arrow-left-c text-bigger"></span>
                            </a>
                            <!-- hidden on smartphones -->
                            <p class="pull-left h4 uppercase navbar-text hidden-xs">Uploaded Files By Customer</p>
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

    <!-- M O D A L  T O  U P L O A D  F I L E  -->
    <div class="modal fade bs-example-modal-md" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" id="UploadFileModal">
        <div class="modal-dialog modal-md">
            <div class="modal-content">

                <div class="modal-header">
                    <button type="button" id="btn-modal-remove" class="close" data-dismiss="modal" aria-hidden="true"><span class="ion-close-round"></span></button>
                    <h2 class="modal-title" id="myLargeModalLabel-remove" style="color: white;">Upload File</h2>
                </div>
                <div class="modal-body">

                    <div class="mtop-10">
                        <br />
                    </div>

                    <div class="col-sm-12">
                        <div id="upload-file">
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <%-- Survey Engine Commons --%>
    <script src="${pageContext.request.contextPath}/statics/js/surveyengine.js"></script>
    <%-- Bootstrap JS --%>
    <script src="${pageContext.request.contextPath}/statics/js/bootstrap.min.js"></script>
    <%-- jQuery UI --%>
    <script src="${pageContext.request.contextPath}/statics/js/jquery-ui.js"></script>
    <%-- React JS --%>
    <script src="${pageContext.request.contextPath}/statics/js/react.min.js"></script>
    <script src="${pageContext.request.contextPath}/statics/js/react-dom.min.js"></script>
    <script src="${pageContext.request.contextPath}/statics/js/babel.min.js" charset="utf-8"></script>
    <script src="${pageContext.request.contextPath}/statics/js/react-table.js"></script>
    <script type="text/babel" src="${pageContext.request.contextPath}/statics/js/surveyengine.react.files-report-table.js"></script>
    <script>
        var ReactTable = window.ReactTable.default;

    </script>
</body>
</html>
