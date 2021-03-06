<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        version="1.0">

    <xsl:output method="html"/>
    <xsl:param name="date"/>
    <xsl:param name="month"/>
    <xsl:param name="year"/>

    <!-- This template processes the root node ("/survey") -->
    <xsl:template match="/survey">

        <!-- Survey Header Information -->
        <div id="survey-header" class="row">
            <div class="col-xs-9">
                <xsl:if test="$date"><span class="pull-left">Month: <xsl:value-of select="$month"/> Year: <xsl:value-of select="$year"/></span></xsl:if>
                <h2><xsl:value-of select="surveyInfo/surveyTitle"/></h2>
                <h5>
                    <xsl:call-template name="newlines">
                        <xsl:with-param name="input" select="surveyInfo/surveyDescription"/>
                    </xsl:call-template>
                </h5>
            </div>
            <div class="col-xs-3 text-right mbottom-20">
                <img id="brand" src="{surveyInfo/surveyLogo/@source}" class="brand mtop-20"/>
            </div>
            <xsl:if test="$date">
                <h4 class="pull-right badge badge-info mright-15 uppercase">Expiration Date: <xsl:value-of select="surveyInfo/expirationDate"/></h4>
            </xsl:if>
        </div>

        <!-- Page -->
        <xsl:for-each select="//page">
            <xsl:variable name="page_id" select="count(preceding::page)+1"/>
            <div id="page{$page_id}" class="page">
                <div class="btn-group btn-group-sm btn-block">
                    <xsl:if test="count(//page) != 1">
                        <label type="button" onclick="removePage({$page_id});" class="btn btn-default uppercase text-bold pull-right" >
                            <span class="content">Remove Page</span>
                        </label>
                    </xsl:if>
                    <label onclick="addPage({$page_id});" type="submit" id="" class="btn btn-default uppercase text-bold pull-right" >
                        <span class="content"> Add Page</span>
                    </label>
                </div>

                <!-- Page Header Information -->
                <h3><xsl:value-of select="pageInfo/pageTitle"/></h3>
                <h4><xsl:value-of select="pageInfo/pageDescription"/></h4>

                <!-- Question Modules -->
                <xsl:choose>
                    <xsl:when test="count(questionModule) = 0">
                        <button onclick="reactPopup(0);" type="submit" id="btn-question" class="btn btn-md btn-block uppercase text-bold" >
                            <span class="content"><span class=""></span> Add Question</span>
                        </button>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:call-template name="questionModules">
                            <xsl:with-param name="questionModule" select="questionModule"/>
                        </xsl:call-template>
                    </xsl:otherwise>
                </xsl:choose>

            </div>
        </xsl:for-each>

        <!-- Survey Footer -->
        <div id="pages-nav" class="col-xs-12 text-center">
            <ul class="pagination pagination-sm">

                <!-- Survey Page Navigation -->
                <xsl:for-each select="//page">
                    <xsl:call-template name="pagesNav">
                        <xsl:with-param name="type" select="'page'"/>
                    </xsl:call-template>
                </xsl:for-each>
            </ul>
        </div>
    </xsl:template>

    <!--Build Page Navigation Template-->
    <xsl:template name="pagesNav">
        <xsl:param name="type"/>
        <xsl:variable name="page_id" select="count(preceding::page)+1"/>
        <li>
            <a id="a_{$type}{$page_id}" class="{$type}" href="#{$type}{$page_id}">
                <xsl:value-of select="position()"/>
            </a>
        </li>
    </xsl:template>

    <!--Build Radio-Branching Nav Template-->
    <xsl:template name="radio-branchNav">
        <xsl:variable name="id" select="count(preceding::questionModule[@type = 'branch'])+1"/>
        <xsl:variable name="option" select="count(preceding::sectionBranch)+1"/>
        <div class="form-group col-lg-4">
            <div class="radio radio-sm mtop-0">
                <input id="branch{$id}_option{$option}" class="branch" type="radio" name="branch{$id}" value="{./branchInfo/branchTitle}">
                    <xsl:if test="../@mandatory">
                        <xsl:attribute name="required"/>
                    </xsl:if>
                </input>
                <label for="branch{$id}_option{$option}">
                    <span class="rad"/>
                    <span class="radio-label">
                        <xsl:value-of select="./branchInfo/branchTitle"/>
                    </span>
                </label>
            </div>
        </div>
    </xsl:template>

    <!-- Add newlines Template -->
    <xsl:template name="newlines">
        <xsl:param name="input" />
        <xsl:choose>
            <xsl:when test="contains($input, '&#10;')">
                <xsl:value-of select="substring-before($input, '&#10;')" /><br />
                <xsl:call-template name="newlines">
                    <xsl:with-param name="input" select="substring-after($input, '&#10;')" />
                </xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$input" />
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <!-- Build Question Modules Template-->
    <xsl:template name="questionModules">
        <xsl:param name="questionModule"/>

        <xsl:for-each select="$questionModule">

            <xsl:variable name="type" select="./@type"/>
            <xsl:variable name="id" select="count(preceding::*[@type = $type])+1"/>
            <xsl:variable name="countNodes" select="count(preceding-sibling::*[$questionModule])"></xsl:variable>

            <!-- Add Question Button -->
            <xsl:if test="not(self::questionModuleBranch)">
                <button onclick="reactPopup({$countNodes - 1});" type="submit" id="btn-question" class="btn btn-md btn-block uppercase text-bold" >
                    <span class="content"><span class=""></span> Add Question</span>
                </button>
            </xsl:if>

            <div class="well well-white mtop-10 col-sm-12">

                <!-- Edit & Remove Question Buttons -->
                <xsl:if test="not(self::questionModuleBranch)">
                    <div class="btn-group btn-group-sm btn-block">
                        <label type="button" onclick="removeQuestionPopup({$countNodes});" class="btn btn-default pull-right" >
                            <span class="ion-trash-b"/>
                        </label>
                        <label type="button" onclick="editQuestionPopup({$countNodes});" class="btn btn-default pull-right" >
                            <span class="ion-edit"/>
                        </label>
                    </div>
                </xsl:if>
                
                <div name="questionModule{$countNodes}" class="form-group col-sm-12 has-feedback mtop-25">
                    <xsl:if test="./@mandatory">
                        <xsl:attribute name="class">form-group mandatory has-feedback mtop-25 col-sm-12</xsl:attribute>
                    </xsl:if>

                    <label class="control-label col-lg-3">
                        <xsl:value-of select="title"/>
                        <xsl:if test="./@mandatory">
                            <xsl:text> *</xsl:text>
                        </xsl:if>
                    </label>

                    <xsl:if test="./image">
                        <div class="text-center col-xs-12">
                            <img id="image" name="image" src="{./image/@source}" class="mbottom-5 radio-img"/>
                        </div>
                    </xsl:if>



                    <!-- Hidden Input Question Title -->
                    <input id="hdn{$type}{$id}" name="hdn{$type}{$id}" type="hidden" value="{string(title)}"/>


                    <xsl:choose>
                        <!-- Question Modules Text | Number | Range Field Input -->
                        <xsl:when test="($type='text') or ($type='number') or ($type='range')">
                            <input id="{$type}{$id}" type="{$type}" name="{$type}{$id}" class="form-control input-sm" value="">
                                <xsl:if test="./@mandatory">
                                    <xsl:attribute name="required"/>
                                </xsl:if>
                            </input>
                        </xsl:when>

                        <!-- Question Module Textarea -->
                        <xsl:when test="$type='textarea'">
                            <div class="col-lg-9">
                                <textarea id="{$type}{$id}" name="{$type}{$id}" class="form-control input-sm"  value="">
                                    <xsl:if test="./@mandatory">
                                        <xsl:attribute name="required"/>
                                    </xsl:if>
                                </textarea>
                            </div>
                        </xsl:when>

                        <!-- Question Module Date -->
                        <xsl:when test="$type='date'">
                            <div class="input-group">
                                <input type="text" id="{$type}{$id}" name="{$type}{$id}"
                                       class="form-control input-sm date" placeholder="mm/dd/yyyy" value="">
                                    <xsl:if test="./@mandatory">
                                        <xsl:attribute name="required"/>
                                    </xsl:if>
                                </input>
                                <span class="input-group-btn">
                                    <button name="{$type}{$id}" class="btn btn-info btn-sm date" type="button"
                                            data-toggle="modal" data-target="#requestor-modal">
                                        <span class="glyphicon glyphicon-calendar"/>
                                    </button>
                                </span>
                            </div>
                        </xsl:when>

                        <!-- Question Module File -->
                        <xsl:when test="$type='file'">
                            <div class="file-drop-area col-lg-9">
                                <span class="btn btn-info">Choose files</span>
                                <span class="file-msg file-name">or drag and drop files here</span>
                                <input id="{$type}{$id}" name="{$type}{$id}" class="file-input" type="file" value="">
                                    <xsl:if test="./@mandatory">
                                        <xsl:attribute name="required"/>
                                    </xsl:if>
                                </input>
                            </div>
                        </xsl:when>

                        <!-- Question Module Select-->
                        <xsl:when test="$type='select'">
                            <div class="row">
                                <div class="form-group col-xs-12 col-sm-6">
                                    <div class="select select-small span2 pull-left btn-block">
                                        <select id="{$type}{$id}" name="multiple{$type}{$id}">
                                            <xsl:if test="./@mandatory">
                                                <xsl:attribute name="required"/>
                                            </xsl:if>
                                            <option value=""></option>
                                            <xsl:for-each select="./option">
                                                <option value="{.}">
                                                    <xsl:value-of select="."/>
                                                </option>
                                            </xsl:for-each>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </xsl:when>

                        <!-- Question Module Radio-->
                        <xsl:when test="$type='radio'">
                            <xsl:for-each select="./option">
                            <xsl:variable name="option" select="count(preceding-sibling::option)+1"/>
                            <div name="container-{$type}{$id}_option{$option}"
                                 class="form-group col-lg-3">
                                <div class="radio radio-sm mtop-0">
                                    <xsl:if test="starts-with(.,'Needs improvement')">
                                        <xsl:attribute name="class">
                                            <xsl:text>radio radio-sm mtop-0 radio-danger </xsl:text>
                                        </xsl:attribute>
                                    </xsl:if>
                                    <xsl:if test="starts-with(.,'Acceptable')">
                                        <xsl:attribute name="class">
                                            <xsl:text>radio radio-sm mtop-0 radio-warning</xsl:text>
                                        </xsl:attribute>
                                    </xsl:if>
                                    <xsl:if test="starts-with(.,'Good')">
                                        <xsl:attribute name="class">
                                            <xsl:text>radio radio-sm mtop-0 radio-success</xsl:text>
                                        </xsl:attribute>
                                    </xsl:if>
                                    <input id="{$type}{$id}_option{$option}" type="{$type}"
                                           name="{$type}{$id}" value="{.}">
                                        <xsl:if test="../@mandatory">
                                            <xsl:attribute name="required"/>
                                        </xsl:if>
                                    </input>
                                    <label for="{$type}{$id}_option{$option}" class="control-label">
                                        <span class="rad"/>
                                        <span class="radio-label">
                                            <xsl:value-of select="."/>
                                            <xsl:if test="./@image">
                                                <div class="text-center col-xs-12">
                                                    <img id="image" name="image" src="{./@image}"
                                                         class="radio-img"/>
                                                </div>
                                            </xsl:if>
                                        </span>
                                    </label>
                                </div>
                            </div>
                            </xsl:for-each>
                        </xsl:when>

                        <!-- Question Module Checkbox-->
                        <xsl:when test="$type='checkbox'">
                            <div class="row">
                                <xsl:for-each select="./option">
                                    <xsl:variable name="option" select="count(preceding-sibling::option)+1"/>
                                    <div name="container-{$type}{$id}_option{$option}"
                                         class="form-group col-xs-4 col-sm-2">
                                        <div class="checkbox checkbox-sm">
                                            <input id="{$type}{$id}_option{$option}" type="{$type}"
                                                   name="{$type}{$id}_option{$option}" value="{.}">
                                                <xsl:if test="../@mandatory">
                                                    <xsl:attribute name="required"/>
                                                </xsl:if>
                                            </input>
                                            <label for="{$type}{$id}_option{$option}" type="{$type}"
                                                   class="control-label">
                                                <span class="check"/>
                                                <span class="checkbox-label">
                                                    <xsl:value-of select="."/>
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </xsl:for-each>
                            </div>
                        </xsl:when>

                        <!-- Question Module Branch-->
                        <xsl:when test="$type='branch'">
                            <div id="{$type}{$id}" class="branching row">
                                <xsl:for-each select="./sectionBranch">
                                    <xsl:call-template name="radio-branchNav"/>
                                </xsl:for-each>
                            </div>

                            <xsl:for-each select="./sectionBranch">
                                <xsl:variable name="option" select="count(preceding::sectionBranch)+1"/>
                                <div id="{$type}{$id}_option{$option}_branch" class="branch row">
                                    <h4>
                                        <xsl:value-of select="./branchInfo/branchDescription"/>
                                    </h4>
                                    <xsl:call-template name="questionModules">
                                        <xsl:with-param name="questionModule" select=".//questionModuleBranch"/>
                                    </xsl:call-template>
                                </div>
                            </xsl:for-each>
                        </xsl:when>


                    </xsl:choose>
                    <span class="glyphicon form-control-feedback"/>
                    <div class="help-block"/>
                </div>
            </div>
            <xsl:if test="(position() = last() and (not(self::questionModuleBranch)))">
                <button onclick="reactPopup({position()});" type="submit" id="btn-question" class="btn btn-md btn-block uppercase text-bold" >
                    <span class="content"><span class=""></span> Add Question</span>
                </button>
            </xsl:if>
        </xsl:for-each>

    </xsl:template>
    <!--/Section Template-->

</xsl:stylesheet>