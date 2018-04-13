<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/security/tags" %>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Survey Designer | Report</title>
    <link rel='shortcut icon' type='image/x-icon' href='/statics/img/survey-logo.png'/>

    <%-- Fonts --%>
    <link href='https://fonts.googleapis.com/css?family=Maven+Pro:400,500,700,900' rel="stylesheet" type='text/css'>
    <%-- Bootstrap --%>
    <link href="${pageContext.request.contextPath}/statics/css/bootstrap.css" rel="stylesheet">
    <%-- CSS --%>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/statics/css/react-table.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/statics/css/custom-style.css" rel="stylesheet">
    <%-- jQuery UI --%>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/statics/css/jquery-ui.css" rel="stylesheet">
    <%-- jQuery --%>
    <script src="${pageContext.request.contextPath}/statics/js/jquery.min.js"></script>

</head>
<body>
<s:authorize access="hasRole('ROLE_ADMIN')">
    <jsp:include page="partial/_header.jsp"/>
</s:authorize>
    <%-- Secondary nav bar --%>
    <nav class="navbar shrink navbar-inverse mtop-0 col-xs-12 padding-0 header-top" id="navigation-b" style="z-index: 500; background-color: #3c3c3c;">
        <div class="container-fluid">
            <div class="row">
                <div class="col-xs-12 padding-0">
                    <div class="col-sm-6 col-xs-12">
                        <div class="row">
                            <s:authorize access="!hasRole('ROLE_ADMIN')">
                                <div class="mleft-15">
                                    <img src="${pageContext.request.contextPath}/statics/img/survey-logo.png" class="logo pull-left mtop-10">
                                </div>
                            </s:authorize>
                            <!-- hidden on smartphones -->
                            <p class="pull-left h4 uppercase navbar-text">Monthly Overview Report </p>
                        </div>
                    </div>
                    <div class="col-sm-4 col-sm-offset-0 pull-right">
                        <div class="row">
                            <div class="col-xs-6 pull-right">
                                <button type="button" id="btn-pdf" class="btn btn-info btn-lg btn-block navbar-btn uppercase text-bold btn-loading">
                                    <span class="content visible-lg"><span class="ion-arrow-down-a"></span> Download PDF</span>
                                    <!-- Visible on medium size screens and tablets -->
                                    <span class="content hidden-lg"><span class="ion-arrow-down-a"></span> PDF</span>
                                </button>
                            </div><div class="col-xs-6 pull-right">
                                <button type="button" id="btn-excel" class="btn btn-default btn-lg btn-block navbar-btn uppercase text-bold btn-loading">
                                    <span class="content visible-lg"><span class="ion-arrow-down-a"></span> Download Excel</span>
                                    <!-- Visible on medium size screens and tablets -->
                                    <span class="content hidden-lg"><span class="ion-arrow-down-a"></span> Excel</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <div id="contactId" name="${contactId}"/>

    <section class="container-fluid mbottom-20" id="main-content">

    <%-- React root--%>
        <div id="report-table" name='${reportType}'/>

    </section>

    <div id="htmlTable"></div>

    <%-- Bootstrap JS --%>
    <script src="${pageContext.request.contextPath}/statics/js/bootstrap.min.js"></script>
    <%-- jQuery UI --%>
    <script src="${pageContext.request.contextPath}/statics/js/jquery-ui.js"></script>
    <%-- Survey Engine Commons --%>
    <script src="${pageContext.request.contextPath}/statics/js/surveyengine.js"></script>
    <script src="${pageContext.request.contextPath}/statics/js/jsPDF.js"></script>
    <%-- React JS --%>
    <script src="${pageContext.request.contextPath}/statics/js/react.min.js"></script>
    <script src="${pageContext.request.contextPath}/statics/js/react-dom.min.js"></script>
    <script src="${pageContext.request.contextPath}/statics/js/babel.min.js" charset="utf-8"></script>
    <script src="${pageContext.request.contextPath}/statics/js/react-table.js"></script>
    <script src="${pageContext.request.contextPath}/statics/js/html2canvas.js"></script>
    <script type="text/babel" src="${pageContext.request.contextPath}/statics/js/surveyengine.react.final-report-table.js"></script>
    <script>
        var ReactTable = window.ReactTable.default;

        function startPrintProcess(canvas, fileName, callback) {
            var pdf = new jsPDF('l', 'pt', 'a4'),
                pdfConf = {
                    pagesplit: false,
                    background: '#ffffff'
                };
            document.body.appendChild(canvas); //appendChild is required for html to add page in pdf
            pdf.addHTML(canvas, 0, 0, pdfConf, function() {
                document.body.removeChild(canvas);
                pdf.addPage();
                pdf.save(fileName + '.pdf');
                callback();
            });
        }

        const reports = SurveyEngine.commons.reportsUtil;
        reports.downloadExcel();

        $('#btn-pdf').click(()=>{
            let report = $('.rt-tbody').css("background-color", "white")[0]
            let fileName = "Survey Designer Final Report - " + $("#fiscalMonth option:selected").text() + "-" + $("#fiscalYear option:selected").text()
            html2canvas(report, {
                onrendered: function(canvas) {
                    startPrintProcess(canvas, fileName,function (){
                    });
                }
            });
        })
    </script>
</body>
</html>
