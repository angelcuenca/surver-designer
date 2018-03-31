<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ page contentType="text/html;charset=UTF-8" language="java"%>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>CSO | Preview</title>
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
    </head>
    <body>
    <%--header--%>
    <jsp:include page="partial/_header.jsp"/>

    <!-- !Secondary nav bar -->
    <nav class="navbar header-top navbar-static-top shrink navbar-inverse mtop-0 padding-0 col-xs-12" id="navigation-b" >
        <div class="container-fluid">
            <div class="row">
                <div class="col-xs-12 padding-0">
                    <div class="col-sm-4 col-xs-12 col-lg-6">
                        <div class="row">
                            <!-- hidden on smartphones -->
                            <p class="pull-left h4 uppercase navbar-text col-xs-12" style="color: white;">Survey ${status}</p>
                        </div>
                    </div>
                    <c:if test="${not fn:containsIgnoreCase(status, 'published')}">
                        <div class="col-sm-6  col-xs-12 col-lg-4 pull-right">
                            <div class="row">
                                <div class="col-xs-4">
                                    <button form="xmlForm" formnovalidate <c:choose><c:when test="${surveyId == null}">formaction="edit"</c:when><c:otherwise>formaction="${surveyId}/edit"</c:otherwise></c:choose> type="submit" id="btn-edit" class="btn btn-success btn-lg btn-block navbar-btn uppercase text-bold btn-loading" >
                                        <span class="content visible-lg"><span class="ion-edit"></span> Edit</span>
                                        <!-- Visible on medium size screens and tablets -->
                                        <span class="content hidden-lg"><small>Edit</small></span>
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
                    <c:if test="${fn:containsIgnoreCase(status, 'published')}">
                        <div class="col-xs-4 col-sm-offset-4 col-lg-2 col-lg-offset-4">
                            <button form="xmlForm" formaction="${surveyId}/cancel" type="submit" id="btn-cancel" class="btn btn-danger btn-lg btn-block navbar-btn uppercase text-bold" >
                                <span class="content visible-lg"><span class="glyphicon glyphicon-remove"></span> Cancel</span>
                                <!-- Visible on medium size screens and tablets -->
                                <span class="content hidden-lg"><small>Cancel</small></span>
                            </button>
                        </div>
                    </c:if>
                </div>
            </div>
        </div>
    </nav>

    <section class="row" hidden>
        <div id="survey_info">
            <div class="container col-xs-12">
                <div class="row">
                    <p class="col-md-8 col-lg-offset-1 mbottom-0 mtop-10 pull-left">Reminders</p>
                    <div class="onoffswitch onoffswitch-success mtop-5">
                        <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="switch-reminder" <c:choose><c:when test="${enableReminder == true}">checked</c:when></c:choose>>
                        <label class="onoffswitch-ctrl" for="switch-reminder">
                            <div class="onoffswitch-inner"></div>
                            <div class="onoffswitch-switch"></div>
                        </label>
                    </div>
                </div>
            </div>
            <div class="container col-xs-12">
                <div class="row">
                    <p class="col-md-8 col-lg-offset-1 mbottom-0 mtop-10 pull-left">Needs Approval</p>
                    <div class="onoffswitch onoffswitch-success mtop-5">
                        <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="switch-approval" <c:choose><c:when test="${enableApproval == true}">checked</c:when></c:choose>>
                        <label class="onoffswitch-ctrl" for="switch-approval">
                            <div class="onoffswitch-inner"></div>
                            <div class="onoffswitch-switch"></div>
                        </label>
                    </div>
                </div>
            </div>
            <div class="container col-xs-12">
                <div class="row">
                    <p class="col-md-8 col-lg-offset-1 mbottom-0 mtop-10 pull-left">Authentication Required</p>
                    <div class="onoffswitch onoffswitch-success mtop-5">
                        <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="switch-expiration" <c:choose><c:when test="${enableExpirationReminder == true}">checked</c:when></c:choose>>
                        <label class="onoffswitch-ctrl" for="switch-expiration">
                            <div class="onoffswitch-inner"></div>
                            <div class="onoffswitch-switch"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- !Content -->
    <section id="containerSection" class="container-fluid mbottom-10" style="padding-right: 25px; padding-left: 25px;">
        <div class="row">
            <!-- Survey Designer section -->
            <p class="h4 uppercase text-gray-darker visible-xs col-xs-12 mbottom-20">Survey Designer</p>
            <div class="col-lg-8 col-lg-offset-2 clearfix">
                <div class="panel panel-default">
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

                    <%--Preview section--%>
                    <div class="panel-body">
                        <section class="row">
                            <%--Survey preview section--%>
                            <div id="preview" class="col-sm-12"/>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- !Footer -->
    <!--<jsp:include page="partial/_footer.jsp"/>-->

    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="${pageContext.request.contextPath}/statics/js/bootstrap.min.js"></script>
    <!-- jQuery UI -->
    <script src="${pageContext.request.contextPath}/statics/js/jquery-ui.js"></script>
    <!-- Survey Engine Commons-->
    <script src="${pageContext.request.contextPath}/statics/js/surveyengine.js"></script>
    <!-- Survey Engine Designer-->
    <script src="${pageContext.request.contextPath}/statics/js/surveyengine.designer.js"></script>
    <!-- Pnotify -->
    <script src="${pageContext.request.contextPath}/statics/js/pnotify.custom.js"></script>

    <script type="text/javascript">

        var surveyDesigner = SurveyEngine.surveyDesigner;
        surveyDesigner.ready();

        if(${not empty notify}){
           surveyDesigner.notifyDesigner("${notify}");
        }

        //Validations for Survey and Page Information
        $('#btn-publish, #btn-save').click(function(e) {
            //Get current xml
            let xml = $('#code').val();

            //Get survey title
            let startPos = xml.indexOf("<surveyTitle>") + "<surveyTitle>".length;
            let endPos = xml.indexOf("</surveyTitle>");
            let surveyTitle = xml.substring(startPos, endPos).trim();

            if( surveyTitle === '' ){
                userInterface.notify('Survey Title', 'Please add a title for this survey.', 'notice');
                e.preventDefault(e);
            }else{
                //Get pages
                startPos = xml.indexOf("</surveyInfo>") + "</surveyInfo>".length;
                endPos = xml.indexOf("</survey>");
                let pagesXml = xml.substring(startPos, endPos).trim();

                //Parser DOM XML string to get each page
                let parser = new DOMParser();
                pagesXml = '<root>' + pagesXml + '</root>';
                let xmlDoc = parser.parseFromString(pagesXml, "text/xml");

                let pagesArray = Array.prototype.map.call(
                    xmlDoc.querySelectorAll('page'), function(e){
                        return e.outerHTML.replace(/\t/g, '')
                    });

                let infoValidation = true;
                pagesArray.forEach(function(element, index) {
                    startPos = element.indexOf("<pageTitle>") + "<pageTitle>".length;
                    endPos = element.indexOf("</pageTitle>");

                    if( element.substring(startPos, endPos).trim() === '' ){
                        userInterface.notify('Page Title', 'Please add a title for page '+(index+1)+'.', 'notice');
                        e.preventDefault(e);
                        infoValidation = false;
                    }
                });

                if( this.id === 'btn-publish' ){
                    //Get optional description
                    startPos = xml.indexOf("<surveyDescription>") + "<surveyDescription>".length;
                    endPos = xml.indexOf("</surveyDescription>");
                    let surveyDescription = xml.substring(startPos, endPos).trim();

                    //Set empty value
                    if (surveyDescription === 'Optional survey description') {
                        xml = xml.replace(/<surveyDescription>[\s\S]*?<\/surveyDescription>/, '<surveyDescription>' + ' ' + '<\/surveyDescription>');
                    }

                    //Get optional description
                    let pagesArrayXml = [];
                    pagesArray.forEach(function(element, index) {
                        startPos = element.indexOf("<pageDescription>") + "<pageDescription>".length;
                        endPos = element.indexOf("</pageDescription>");
                        let pageDescription = element.substring(startPos, endPos).trim();

                        //Set empty value
                        if (pageDescription === 'Optional description for this page') {
                            element = element.replace(/<pageDescription>[\s\S]*?<\/pageDescription>/, '<pageDescription>' + ' ' + '<\/pageDescription>');
                        }

                        pagesArrayXml[index] = element;
                    });

                    //Build complete xml pages
                    let pages = "";
                    pagesArrayXml.forEach(function(element) {
                        pages += element;
                    });

                    //Replace the new page
                    xml = xml.replace(/<\/surveyInfo>[\s\S]*?<\/survey>/, '</surveyInfo>' + pages + '<\/survey>');

                    //Set xml
                    $("#code").val(xml);
                }
            }
        });

    </script>
    </body>
</html>