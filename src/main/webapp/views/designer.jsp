<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ page contentType="text/html;charset=UTF-8" language="java"%>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>CSO | Designer</title>
        <link rel='shortcut icon' type='image/x-icon' href='/statics/img/survey-logo.png'/>

        <!-- Fonts -->
        <link href='https://fonts.googleapis.com/css?family=Maven+Pro:400,500,700,900' rel='stylesheet' type='text/css'>
        <!-- Bootstrap -->
        <link href="${pageContext.request.contextPath}/statics/css/bootstrap.css" rel="stylesheet">
        <!-- Custom-Style -->
        <link href="${pageContext.request.contextPath}/statics/css/custom-style.css" rel="stylesheet">
        <!-- jQuery UI -->
        <link rel="stylesheet" href="${pageContext.request.contextPath}/statics/css/jquery-ui.css">
         <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
        <script src="${pageContext.request.contextPath}/statics/js/jquery.min.js"></script>
        <!-- React -->
        <link rel="stylesheet" href="${pageContext.request.contextPath}/statics/css/surveyengine.react.css">

        <style type="text/css">
            .modal {
                position: absolute;
                top: 100px;
                bottom: 0;
                left: 0;
                z-index: 10040;
                overflow-y: auto;
            }

            .modal-backdrop {
                background-image: none;
            }
        </style>
    </head>
    <body>
    <%--header--%>
    <jsp:include page="partial/_header.jsp"/>
    <!-- !Secondary nav bar -->
    <nav class="navbar header-top navbar-static-top shrink navbar-inverse mtop-0 col-xs-12 padding-0" id="navigation-b">
        <div class="container-fluid">
            <div class="row">
                <div class="col-xs-12 padding-0">
                    <div class="col-sm-4 col-xs-2 col-lg-6">
                        <div class="row">
                            <!-- hidden on smartphones -->
                            <p class="pull-left h4 uppercase navbar-text hidden-xs">Survey Designer</p>
                        </div>
                    </div>
                    <c:if test="${not fn:containsIgnoreCase(status, 'published')}">
                        <div class="col-sm-6  col-xs-10 col-lg-4 pull-right">
                            <div class="row">
                                <div class="col-xs-4">
                                    <button form="xmlForm" formnovalidate <c:choose><c:when test="${surveyId == null}">formaction="preview"</c:when><c:otherwise>formaction="${surveyId}/preview"</c:otherwise></c:choose> type="submit" id="btn-edit" class="btn btn-success btn-lg btn-block navbar-btn uppercase text-bold btn-loading" >
                                        <span class="content visible-lg"><span class="ion-eye"></span> Preview</span>
                                        <!-- Visible on medium size screens and tablets -->
                                        <span class="content hidden-lg"><small>Preview</small></span>
                                    </button>
                                </div>
                                <div class="col-xs-4">
                                    <button form="xmlForm" formnovalidate <c:choose><c:when test="${surveyId == null}">formaction="save"</c:when><c:otherwise>formaction="${surveyId}/save"</c:otherwise></c:choose> type="submit" id="btn-save" class="btn btn-default btn-lg btn-block navbar-btn uppercase text-bold" >
                                        <span class="content visible-lg"><span class="ion-document"></span> Save</span>
                                        <!-- Visible on medium size screens and tablets -->
                                        <span class="content hidden-lg"><small>Save</small></span>
                                    </button>
                                </div>
                                <div class="col-xs-4">
                                    <button form="xmlForm" <c:choose><c:when test="${surveyId == null}">formaction="publish"</c:when><c:otherwise>formaction="${surveyId}/publish"</c:otherwise></c:choose> type="submit" id="btn-publish" class="btn btn-info btn-lg btn-block navbar-btn uppercase text-bold" >
                                        <span class="content visible-lg"><span class="ion-android-earth"></span> Publish</span>
                                        <!-- Visible on medium size screens and tablets -->
                                        <span class="content hidden-lg"><small>Publish</small></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </c:if>
                </div>
            </div>
        </div>
    </nav>
    <!-- !Content -->
    <section id="containerSection" class="container-fluid mbottom-10" style="padding-right: 25px; padding-left: 25px;">
        <div class="row">
            <!-- Header and Settings section -->
            <div class="col-lg-3 clearfix">
                <div class="panel panel-default mbottom-10">
                    <div class="panel-heading uppercase text-bold clearfix">
                        <span class="content"><span class="ion-information-circled"></span> SURVEY INFORMATION</span>
                    </div>
                    <div class="panel-body" style="padding-bottom: 0px; padding-top: 0px;">
                        <section class="row">
                            <div class="form-group clearfix">
                                <form:form method="POST" enctype="multipart/form-data" id="uploadImage" acceptCharset="UTF-8" action="${redirectAction}">
                                    <div id="header-survey" />
                                </form:form>
                            </div>
                        </section>
                    </div>
                </div>
                <div class="panel panel-default mbottom-10">
                    <div class="panel-heading uppercase text-bold clearfix">
                        <span class="content"><span class="ion-document"></span> PAGE INFORMATION</span>
                    </div>
                    <div class="panel-body" style="padding-bottom: 0px; padding-top: 0px;">
                        <section class="row">
                            <div class="clearfix">
                                <div id="page-survey">
                                    <div id="page-survey-component" id-page="1"></div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                <div class="panel panel-default mbottom-10" >
                    <div class="panel-heading uppercase text-bold clearfix mtop-10">
                        <span class="content"><span class="ion-gear-b"></span> SETTINGS</span>
                    </div>
                    <section class="row mtop-5" style="padding-bottom: 5px;">
                        <div id="survey_info">
                            <div class="container col-xs-12">
                                <p class="col-xs-8 col-sm-8 col-md-8 col-lg-offset-1 mbottom-0 mtop-10 pull-left">Response Reminder</p>
                                <div class="onoffswitch onoffswitch-success mtop-5">
                                    <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="switch-reminder" <c:choose><c:when test="${enableReminder == true}">checked</c:when></c:choose>>
                                    <label class="onoffswitch-ctrl" for="switch-reminder">
                                        <div class="onoffswitch-inner"></div>
                                        <div class="onoffswitch-switch"></div>
                                    </label>
                                </div>
                            </div>
                            <div class="container col-xs-12">
                                <p class="col-xs-8 col-sm-8 col-md-8 col-lg-offset-1 mbottom-0 mtop-10 pull-left">Expiration Reminder</p>
                                <div class="onoffswitch onoffswitch-success mtop-5">
                                    <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="switch-expiration" <c:choose><c:when test="${enableExpirationReminder == true}">checked</c:when></c:choose>>
                                    <label class="onoffswitch-ctrl" for="switch-expiration">
                                        <div class="onoffswitch-inner"></div>
                                        <div class="onoffswitch-switch"></div>
                                    </label>
                                </div>
                            </div>
                            <div class="container col-xs-12">
                                <p class="col-xs-8 col-sm-8 col-md-8 col-lg-offset-1 mbottom-0 mtop-10 pull-left">Needs Approval</p>
                                <div class="onoffswitch onoffswitch-success mtop-5">
                                    <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="switch-approval" <c:choose><c:when test="${enableApproval == true}">checked</c:when></c:choose>>
                                    <label class="onoffswitch-ctrl" for="switch-approval">
                                        <div class="onoffswitch-inner"></div>
                                        <div class="onoffswitch-switch"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <!-- Survey Designer section -->
            <p class="h4 uppercase text-gray-darker col-xs-12 mbottom-20 hidden">Survey Designer</p>
            <div class="col-lg-9 clearfix">
                <div class="panel panel-default">
                    <%--File upload section--%>
                    <section id="fileUpgitloadSection" class="row" hidden>
                        <c:choose>
                            <c:when test="${surveyId != null}">
                                <div class="col-sm-12">
                                    <h1>${title} #${surveyId}</h1>
                                </div>
                            </c:when>
                            <c:when test="${surveyId == null}">
                                <div class="col-sm-12">
                                    <form:form method="POST" enctype="multipart/form-data" id="form">
                                        <div class="file-drop-area ">
                                            <span class="btn btn-info">Choose files</span>
                                            <span class="file-msg file-name">or drag and drop files here</span>
                                            <input id="chooseXML" class="file-input" type="file" name="xml" />
                                        </div>
                                    </form:form>
                                </div>
                            </c:when>
                        </c:choose>
                    </section>

                    <%--XML Code section--%>
                    <section id="xmlCodeSection" class="row" hidden>
                        <div class="col-sm-12">
                            <form:form method="POST" enctype="multipart/form-data" id="xmlForm" acceptCharset="UTF-8" action="/survey">
                                <div class="panel-body">
                                    <textarea id="code" name="xmlContent" cols="120" rows="100" name="foo" >${xmlContent}</textarea>
                                </div>
                                <div class="panel-body">
                                    <input type="hidden" id="status" value="${status}">
                                 </div>
                                <div class="panel-body" hidden>
                                    <input input="text" name="enableReminder" id="enableReminder" >
                                </div>
                                <div class="panel-body" hidden>
                                    <input input="text" name="enableApproval" id="enableApproval" >
                                </div>
                                <div class="panel-body" hidden>
                                    <input input="text" name="enableExpirationReminder" id="enableExpirationReminder" >
                                </div>
                            </form:form>
                        </div>
                    </section>

                    <%--Errors section--%>
                    <section id="errorsSection" hidden>
                        <c:if test="${not empty errors}">
                            <div class="panel panel-danger mbottom-10">
                                <div class="panel-heading uppercase text-bold clearfix">
                                    <p class="mbottom-0 pull-left">Error Messages</p>
                                    <span class="badge badge-danger mleft-10">${fn: length(errors)}</span>
                                </div>
                                <div class="panel-body">
                                    <section class="row">
                                        <div class="col-sm-12">
                                            <c:forEach var="error" items="${errors}" varStatus="i">
                                                <div class="well well-danger">
                                                    Line Number: ${error.lineNumber}<br/>
                                                    Column Number: ${error.columnNumber}<br/>
                                                    Detail Message: ${error.message}
                                                </div>
                                            </c:forEach>
                                            <c:if test="${not empty exception}">
                                                <div class="well well-danger">
                                                    Exception: ${exception}
                                                </div>
                                            </c:if>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </c:if>
                    </section>

                    <%--Preview section--%>
                    <section id="previewSection" class="panel panel-default ">
                        <div class="panel-heading uppercase text-bold clearfix">
                            <p class="mbottom-0 pull-left">Survey Preview</p>
                        </div>
                        <div class="panel-body">
                            <section class="row">
                                <%--Survey preview section--%>
                                <div id="preview" class="col-sm-12"/>
                            </section>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </section>

    <!-- M O D A L   T O   A D D   Q U E S T I O N  -->
    <div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" id="AddQuestionModal">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">

                <div class="modal-header">
                    <button type="button" id="btn-modal-add" class="close" data-dismiss="modal" aria-hidden="true"><span class="ion-close-round"></span></button>
                    <h2 class="modal-title" id="myLargeModalLabel-add" style="color: white;">ADD  QUESTION</h2>
                </div>
                <div class="modal-body">

                    <div class="col-sm-12">
                        <div id="root">
                        </div>
                    </div>

                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div>

    <!-- M O D A L   T O   E D I T   Q U E S T I O N  -->
    <div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" id="EditQuestionModal">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">

                <div class="modal-header">
                    <button type="button" id="btn-modal-edit" class="close" data-dismiss="modal" aria-hidden="true"><span class="ion-close-round"></span></button>
                    <h2 class="modal-title" id="myLargeModalLabel-edit" style="color: white;">EDIT  QUESTION</h2>
                </div>
                <div class="modal-body">

                    <div class="col-sm-12">
                        <div id="modal-edit">
                        </div>
                    </div>

                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div>

    <!-- M O D A L   T O   R E M O V E   Q U E S T I O N  -->
    <div class="modal fade bs-example-modal-md" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" id="RemoveQuestionModal">
        <div class="modal-dialog modal-md">
            <div class="modal-content">

                <div class="modal-header">
                    <button type="button" id="btn-modal-remove" class="close" data-dismiss="modal" aria-hidden="true"><span class="ion-close-round"></span></button>
                    <h2 class="modal-title" id="myLargeModalLabel-remove" style="color: white;">REMOVE  QUESTION</h2>
                </div>
                <div class="modal-body">

                    <div class="mtop-10">
                        <br />
                    </div>

                    <div class="col-sm-12">
                        <div id="remove-question">
                        </div>
                    </div>

                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div>

    <!-- !Footer -->
    <!--<jsp:include page="partial/_footer.jsp"/>-->

    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="${pageContext.request.contextPath}/statics/js/bootstrap.min.js"></script>
    <!-- jQuery UI -->
    <script src="${pageContext.request.contextPath}/statics/js/jquery-ui.js"></script>
    <!-- Survey Engine Commons -->
    <script src="${pageContext.request.contextPath}/statics/js/surveyengine.js"></script>
    <!-- Survey Engine Designer -->
    <script src="${pageContext.request.contextPath}/statics/js/surveyengine.designer.js"></script>
    <!-- Pnotify -->
    <script src="${pageContext.request.contextPath}/statics/js/pnotify.custom.js"></script>
    <!-- ReactJS -->
    <script src="${pageContext.request.contextPath}/statics/js/react.min.js"></script>
    <script src="${pageContext.request.contextPath}/statics/js/react-dom.min.js"></script>
    <script src="${pageContext.request.contextPath}/statics/js/babel.min.js" charset="utf-8"></script>
    <script type="text/babel" src="${pageContext.request.contextPath}/statics/js/surveyengine.react.builder.js"></script>
    <script type="text/babel" src="${pageContext.request.contextPath}/statics/js/surveyengine.react.info-survey.js"></script>
    <script type="text/babel" src="${pageContext.request.contextPath}/statics/js/surveyengine.react.info-page.js"></script>
    <script type="text/babel" src="${pageContext.request.contextPath}/statics/js/surveyengine.react.remove-question.js"></script>
    <script type="text/babel" src="${pageContext.request.contextPath}/statics/js/surveyengine.react.functions.js"></script>

    <script type="text/javascript">
        var surveyDesigner = SurveyEngine.surveyDesigner;
        surveyDesigner.ready();

        if(${not empty notify}){
           surveyDesigner.notifyDesigner("${notify}");
        }

    </script>
    </body>
</html>