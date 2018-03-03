<%@ taglib prefix="s" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<!-- !Primary nav bar -->
<nav class="navbar navbar-static-top navbar-default margin-0 col-xs-12 padding-0" id="header" role="navigation">
    <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle mright-0" data-toggle="collapse" data-target="#menu">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <img src="${pageContext.request.contextPath}/statics/img/survey-logo.png" class="logo pull-left mtop-10">
            <a class="navbar-brand uppercase text-normal-size" href="${pageContext.request.contextPath}/home">
                <span>Suvey Designer</span>
            </a>
        </div>
        <!-- User -->
        <div class="pull-right mtop-10 hidden-xs">
            <a href="${pageContext.request.contextPath}/logout" class="btn btn-default btn-circle pull-right mleft-15 mtop-5">
                <span class="glyphicon glyphicon-off"></span>
            </a>
            <small class="text-bold text-gray pull-right uppercase mtop-15 mleft-10 hidden-sm hidden-xs">
                <s:authentication var="user" property="principal" />
                <s:authorize access="isAuthenticated()">
                     Hello ${user.name}
                </s:authorize>
            </small>

            <s:authentication var="user" property="principal" />
            <s:authorize access="isAuthenticated()">
                <div class="pull-right mleft-20 hidden-md hidden-sm hidden-xs">
                    <img src="<c:url value="${user.picture}"/>" alt="User profile picture" class="img-circle" style="height: 40px; width:40px">
                </div>
            </s:authorize>
        </div>
        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse pull-right" id="menu">
            <ul class="nav navbar-nav">
                <li>
                    <a href="${pageContext.request.contextPath}/home" class="uppercase text-medium">
                        Home
                    </a>
                </li>
                <li>
                    <a href="${pageContext.request.contextPath}/inbox" class="uppercase text-medium">
                        Inbox
                    </a>
                </li>
                <li>
                    <a href="${pageContext.request.contextPath}/survey/designer" class="uppercase text-medium">
                        Designer
                    </a>
                </li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle uppercase text-medium control" data-toggle="dropdown">Reports <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a class="uppercase text-medium" href="${pageContext.request.contextPath}/reports/monthly-overview-report" style="padding: 8px 20px 8px 20px;">Monthly Report</a></li>
                        <%--<li><a class="uppercase text-medium" href="${pageContext.request.contextPath}/reports/divisional-report" style="padding: 8px 20px 8px 20px;">Monthly Overview By Division</a></li>
                        <li><a class="uppercase text-medium" href="${pageContext.request.contextPath}/reports/3-month-report" style="padding: 8px 20px 8px 20px;">3 Months Overview</a></li>
                        <li><a class="uppercase text-medium" href="${pageContext.request.contextPath}/reports/stoplight-report" style="padding: 8px 20px 8px 20px;">Monthly Stoplight</a></li>
                        <li><a class="uppercase text-medium" href="${pageContext.request.contextPath}/reports/unrecorded-report" style="padding: 8px 20px 8px 20px;">Monthly Unrecorded Ratings</a></li>
                        <li><a class="uppercase text-medium" href="${pageContext.request.contextPath}/reports/final-year-report" style="padding: 8px 20px 8px 20px;">Yearly Overall Average Ratings</a></li>--%>
                    </ul>
                </li>
                <s:authorize access="hasRole('ROLE_ADMIN')">
                    <%--Only visible for administrators--%>
                    <li id="adminMenu" class="dropdown">
                        <a class="dropdown-toggle uppercase text-medium control" data-toggle="dropdown">ADMIN <span class="caret"></span></a>
                        <ul class="dropdown-menu uppercase text-medium">
                            <li><a href="${pageContext.request.contextPath}/admin/contacts" style="padding: 8px 20px 8px 20px;" class="uppercase text-medium">Contact Catalog</a></li>
                            <li class="divider" style="margin: 0px;"></li>
                            <li><a href="${pageContext.request.contextPath}/admin/customers" style="padding: 8px 20px 8px 20px;" class="uppercase text-medium">Customer Catalog</a></li>
                            <li class="divider" style="margin: 0px;"></li>
                            <li><a href="${pageContext.request.contextPath}/admin/customer-contact" style="padding: 8px 20px 8px 20px;" class="uppercase text-medium">Customer/Contact Catalog</a></li>
                            <li class="divider" style="margin: 0px;"></li>
                            <li><a href="${pageContext.request.contextPath}/admin/rating-type" style="padding: 8px 20px 8px 20px;" class="uppercase text-medium">Rating Types</a></li>
                            <li class="divider" style="margin: 0px;"></li>
                            <li><a href="${pageContext.request.contextPath}/admin/customer-external-rating" style="padding: 8px 20px 8px 20px;" class="uppercase text-medium">Customer External Rating</a></li>
                        </ul>
                    </li>
                </s:authorize>
            </ul>
        </div>
    </div>
</nav>

