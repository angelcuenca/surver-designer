<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ page contentType="text/html;charset=UTF-8" language="java"%>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Survey Designer | Timeline</title>
	<link rel='shortcut icon' type='image/x-icon' href='/statics/img/survey-logo.png'/>

	<%-- Fonts --%>
	<link href='https://fonts.googleapis.com/css?family=Maven+Pro:400,500,700,900' rel="stylesheet" type='text/css'>
	<%-- Bootstrap --%>
	<link href="${pageContext.request.contextPath}/statics/css/bootstrap.css" rel="stylesheet">
	<%-- jQuery UI --%>
	<link rel="stylesheet" href="${pageContext.request.contextPath}/statics/css/jquery-ui.css" rel="stylesheet">
	<%-- jQuery --%>
	<script src="${pageContext.request.contextPath}/statics/js/jquery.min.js"></script>
	<%-- CSS --%>
	<link href="${pageContext.request.contextPath}/statics/css/custom-style.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/statics/css/animate.css">
</head>

<body>
	<%--Header--%>
	<jsp:include page="partial/_header.jsp"/>

	<%-- Secondary nav bar --%>
	<nav class="navbar shrink navbar-inverse mtop-0 col-xs-12 padding-0 header-top" id="navigation-b" style="z-index: 500; background-color: #3c3c3c;">
		<div class="container-fluid">
			<div class="row">
				<div class="col-xs-12 padding-0">
					<div class="col-sm-7 col-xs-6">
						<div class="row">
							<a href="javascript:history.go(-1)" class="btn navbar-btn-lg btn-gray-dark pull-left">
								<span class="ion-arrow-left-c text-bigger"></span>
							</a>
							<!-- hidden on smartphones -->
							<p class="pull-left h4 uppercase navbar-text mleft-15">Timeline</p>
						</div>
					</div>
					<div class="col-sm-5 col-xs-12 pull-right mtop-10">
						<div class="row">
							<div class=" col-xs-6 ">
								<p class="col-sm-8  mbottom-0 mtop-10 pull-left white-label">Response reminder</p>
								<div class="onoffswitch onoffswitch-success mtop-5">
									<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="switch-reminder" <c:choose><c:when test="${enableResponseReminder == true}">checked</c:when></c:choose>>
									<label class="onoffswitch-ctrl" for="switch-reminder">
										<div class="onoffswitch-inner"></div>
										<div class="onoffswitch-switch"></div>
									</label>
								</div>
							</div>
							<div class="col-xs-6 padding-0">
								<p class="col-sm-8 mbottom-0 mtop-10 pull-left white-label">Expiration reminder</p>

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
				</div>
			</div>
		</div>
	</nav>


	<div class="col-sm-12">
		<form:form method="POST" enctype="multipart/form-data" id="form" acceptCharset="UTF-8" action="/timeline/saveReminders">
			<div class="panel-body" hidden>
				<input input="text" name="enableResponseReminder" id="enableResponseReminder" >
			</div>
			<div class="panel-body" hidden>
				<input input="text" name="enableExpirationReminder" id="enableExpirationReminder" >
			</div>
		</form:form>
	</div>

	<section class="container-fluid clearfix">
		<%-- React root--%>
		<div id="timeline"/>
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
<script type="text/babel" src="${pageContext.request.contextPath}/statics/js/surveyengine.react.timeline.js"></script>
<script>

    $('#switch-expiration, #switch-reminder').on("click", function(){
		var enableResponseReminder = $('#switch-reminder').prop("checked");
		$("#enableResponseReminder").val(enableResponseReminder);

		var enableExpirationReminder = $('#switch-expiration').prop("checked");
		$("#enableExpirationReminder").val(enableExpirationReminder);

        let request = new XMLHttpRequest();
        request.open("POST", "/timeline/saveReminders?"+"enableResponseReminder="+enableResponseReminder+"&enableExpirationReminder="+enableExpirationReminder);
        request.send();
        request.onload = function () {
            if(request.status === 200){
                let response = request.responseText;
            }
        }
    });

</script>
</html>