
<!DOCTYPE html>
<!--


_____                       _____            ____
/     (                      /     )    _     /    )
/_____                       / ____/   (_/    /    /
/ __ __ ____ .__ __    /     )   (_\_/  /    /
/_____/ (_// // / /// /(_/  _/     (_      )  /____/

Research & Development 2014


-->
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Survey Designer | Something broke!</title>
    <link rel='shortcut icon' type='image/x-icon' href='/statics/img/survey-logo.png'/>

    <!-- Fonts -->
    <link href='http://fonts.googleapis.com/css?family=Maven+Pro:400,500,700,900' rel='stylesheet' type='text/css'>
    <!-- Bootstrap -->
    <link href="${pageContext.request.contextPath}/statics/css/bootstrap.css" rel="stylesheet">
</head>
<body class='body'>
<div class='container'>
    <div class='col-lg-10 col-lg-offset-1  mtop-10 mbottom-50'>
        <div class="row">
            <div class="col-xs-11 border-bottom-gray-light">
                <img src="${pageContext.request.contextPath}/statics/img/sanmina-100x56.png" class="pull-right mtop-10 mbottom-20">
            </div>
        </div>
        <div class="mtop-50">
            <div class="col-sm-4 sanm-errorgraphic mtop-30" id="graphic">
                <!-- Change this to absolute -->
                <img src="${pageContext.request.contextPath}/statics/img/burned-chip.png" alt="burned chip" class="img-responsive">
                <span class="sanm-errornumber">${code}</span>
                <img src="${pageContext.request.contextPath}/statics/img/smoke.png" alt="smoke" class="sanm-error-smoke">
                <div class="well mtop-20" id="support">
                    <p class="text-center">
                        App owner:<br/>
                        <a href="mailto:help.desk@sanmina.com" target="_blank">
                            help.desk@sanmina.com
                        </a>
                        <br/><br/>
                        <small>Please contact <a href="mailto:help.desk@sanmina.com" target="_blank">Help desk</a> if you need more assitance.</small>
                    </p>
                </div>
            </div>

            <div class="col-sm-8 mtop-10 sanm-error-text">
                <h1 id="main-title">${error}</h1>
                <div class="row">
                    <div class="col-xs-12 mbottom-10 mtop-10 text-gray-darker">
                        <span class="uppercase" id="detail">${detail}</span>
                    </div>
                    <div class="col-xs-12 mtop-15">
                        <button type="button" class="btn btn-lg btn-success" id="back-button" onclick="history.back(-1);">
                            <span class="ion-arrow-left-c"></span> Take me back
                        </button>
                        <button type="button" class="btn btn-lg btn-default" id="home-button" onclick="window.location.href='${pageContext.request.contextPath}/'">
                            <span class="ion-home"></span> Take me home
                        </button>
                    </div>
                    <div class="col-xs-12 mtop-30">
                        <span class="uppercase mtop-20"  id="link-options" >Try with links below:</span>
                        <ul class="mtop-20">
                            <li class="mtop-10"><a href='${pageContext.request.contextPath}/login?logout=true'>Survey Engine Login</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div></div>
</div>
</div>
<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="${pageContext.request.contextPath}/statics/js/jquery.min.js"></script>
</body>
</html>