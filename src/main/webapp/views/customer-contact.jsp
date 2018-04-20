<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
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
    <title>Suevey Group Mappings</title>
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
<%--header--%>
<jsp:include page="partial/_header.jsp"/>
<div>
    <!-- !Secondary nav bar -->
    <nav class="navbar header-top navbar-static-top shrink navbar-inverse mtop-0 col-xs-12 padding-0" id="navigation-b" style="z-index: 500; background-color: #3c3c3c;">
        <div class="container-fluid">
            <div class="row">
                <div class="col-xs-12 padding-0">
                    <div class="col-sm-6 col-xs-2">
                        <div class="row">
                            <p class="pull-left h4 uppercase navbar-text hidden-xs" style="color: white;">Customers / Contacts Catalog</p>
                        </div>
                    </div>
                    <div class="col-sm-4 col-sm-offset-0 pull-right">
                        <div class="row">
                            <div class="col-xs-12 col-sm-8 col-lg-6 pull-right">
                                <div id="btn-add-mapping"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <section class="container-fluid mbottom-20" id="main-content-user">
        <div class="row">
            <div class="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 clearfix panel-user">
                <div class="main-role-form panel panel-default mbottom-10">
                    <div class="panel-heading uppercase text-bold clearfix">
                        <p class="mbottom-0 pull-left">SURVEY / GROUP</p>
                    </div>
                    <div class="panel-body">
                        <section>
                            <div class="col-lg-12 col-md-12">
                                <div id="customer-contact-table"></div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>

<!-- M O D A L   T O  A D D  M A P P I N G -->
<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" id="AddCustomerContactMapModal">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">

            <div id="add-customer-contact-map"></div>

        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div>

<!-- M O D A L   T O   R E M O V E  M A P P I N G  -->
<div class="modal fade bs-example-modal-md" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" id="DeleteCustomerContactMapModal">
    <div class="modal-dialog modal-md">
        <div class="modal-content">

            <div class="modal-header">
                <button type="button" id="btn-modal-remove" class="close" data-dismiss="modal" aria-hidden="true"><span class="ion-close-round"></span></button>
                <h2 class="modal-title" id="myLargeModalLabel-remove" style="color: white;">DELETE CUSTOMER</h2>
            </div>
            <div class="modal-body">

                <div class="mtop-10">
                    <br />
                </div>

                <div class="col-sm-12">
                    <div id="remove-customer-contact-map">
                    </div>
                </div>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div>

<%--header
<jsp:include page="partial/_footer.jsp"/>--%>

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
<!-- ReactJS Table -->
<script src="${pageContext.request.contextPath}/statics/js/react-table.js"></script>
<script>
    let ReactTable = window.ReactTable.default
</script>
<script type="text/babel" src="${pageContext.request.contextPath}/statics/js/diacritics.js"></script>
<script type="text/babel" src="${pageContext.request.contextPath}/statics/js/match-sorter.js"></script>
<script type="text/babel" src="${pageContext.request.contextPath}/statics/js/surveyengine.react.customer-contact.js"></script>
<script type="text/babel" src="${pageContext.request.contextPath}/statics/js/surveyengine.react.functions.js"></script>

</body>
</html>

