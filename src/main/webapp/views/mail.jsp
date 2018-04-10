<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Testing email</title>
    <link rel='shortcut icon' type='image/x-icon' href='/statics/img/survey-icon.png'/>
    <!-- Fonts -->
    <link href='http://fonts.googleapis.com/css?family=Maven+Pro:400,500,700,900' rel='stylesheet' type='text/css'>
    <!-- Bootstrap -->
    <link href="${pageContext.request.contextPath}/statics/css/bootstrap.css" rel="stylesheet">
    <!-- Custom-Style -->
    <link href="${pageContext.request.contextPath}/statics/css/custom-style.css" rel="stylesheet">
    <!-- jQuery UI -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/statics/css/jquery-ui.css">
</head>
<body>

<%--header--%>
<jsp:include page="partial/_header.jsp"/>



<div>
    <nav class="navbar shrink navbar-inverse mtop-0 col-xs-12 padding-0 affix-top" id="navigation-b" style="top: 0px;">
        <div class="container-fluid">
            <div class="row">
                <div class="col-xs-12 padding-0">
                    <div class="col-sm-6 col-xs-2">
                        <div class="row">
                            <!-- hidden on smartphones -->
                            <p class="pull-left h4 uppercase navbar-text hidden-xs">DASHBOARD</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <section class="container-fluid mbottom-20" id="main-content">

        <div id="myTabContent" class="tab-content col-lg-10 col-lg-offset-1 clearfix">
            <div class="tab-pane fade in active" id="home">
                <div class="table-responsive">
                    <form class="panel-body" method="POST" action="/mail">
                        <section>
                            <div class="col-sm-7 col-md-6 col-md-offset-3">
                                <div class="form-group">
                                    <label for="exampleInputEmail1">Recipients</label>
                                    <input type="text" class="form-control input-sm" placeholder="" name="recipients">
                                </div>
                                <div class="form-group">
                                    <label for="exampleInputEmail1">Subject</label>
                                    <input type="text" class="form-control input-sm" placeholder="" name="subject">
                                </div>
                                <div class="form-group">
                                    <label for="exampleInputEmail1">Description</label>
                                    <input type="text" class="form-control input-sm" placeholder="" name="description">
                                </div>
                                <div>
                                    <button type="submit"  id="btn-submit" class="btn btn-success btn-lg navbar-btn uppercase text-bold btn-loading">
                                        <span class="content visible-lg"><span class="ion-email"></span>  Send</span>
                                    </button>
                                </div>
                                <div>
                                    <h1>${answer}</h1>
                                </div>
                            </div>
                        </section>
                    </form>
                </div>
                <!--P A G I N A C I O N-->
            </div>
        </div>
    </section>
</div>
<!-- !Footer -->
<jsp:include page="partial/_footer.jsp"/>
</body>
</html>