/**
 * Created by arlette_parra on 27/07/16.
 */

var SurveyEngine = SurveyEngine || {};

SurveyEngine.commons = {

    reportsUtil: {
        buildHeader: function (trHeader) {
            var ratingsTable = $(".ratings-table").first();
            ratingsTable.find(".rt-thead.-header .rt-th").each(function (key, value) {
                let td=$('<td/>',{text:$(value).text()});
                trHeader.append(td);
            })
            return trHeader;
        },

        exportHtmlTable: function (reportType) {
            const divisions = ["EMS", "PWB", "ISS", "ENC", "BPA"]
            const naRating = '#efefef';
            const needsImprovement = '#f9888e';
            const acceptable = '#fee399';
            const good = '#a3d5c0';
            let done = false;

            let tblDiv=$("<div/>",{id:"tableReport"});
            let tbl=$("<table/>");
            let tbo=$("<tbody/>");

            //Header Row
            let tr = $('<tr/>'), td;
            if (reportType != 'stoplight'){
                td = $('<td>Customer</td>');
                tr.append(td);
            }
            if (reportType == 'final-year') {
                td = $('<td>Year</td>');
                tr.append(td);
            }
            if (reportType == 'stoplight' || reportType == 'final-year'){
                tr = SurveyEngine.commons.reportsUtil.buildHeader(tr);
            }
            tbo.append(tr);


            $('.rt-tr-group').each(function(key,value){
                //Customer
                $(value).find(".customer").each(function(key,value){
                    let tr=$('<tr/>');
                    let td=$('<td/>',{text:$(value).text()});
                    tr.append(td);
                    if (reportType == 'unrecorded'){
                        let td = $('<td>Contact</td>');
                        tr.append(td)
                    }else {
                        tr = SurveyEngine.commons.reportsUtil.buildHeader(tr);

                    }
                    tbo.append(tr);
                });

                // Overall Ratings
                if($(value).find(".customer").length == 0 || reportType == 'stoplight' ){
                    let tr=$('<tr/>');

                    /*let tblExternal=$("<table/>");
                    let tboExternal=$("<tbody/>");
                    let trExternal = $('<tr/>');
                    $(value).find(".external-rating").each(function(key,value) {
                        console.log(value)
                        let tdExternal=$('<td/>',{text:$(value).text()});
                        console.log(tdExternal)
                        trExternal.append(tdExternal);
                    });
                    tboExternal.append(trExternal)
                    tblExternal.append(tboExternal);
                    let td=$('<td/>');
                    td.append(table);
                    tr.append(td);*/

                    $(value).find(".rating").each(function(key,value){
                        console.log(value)
                        if(key == 0 && reportType != 'stoplight' && reportType != 'final-year' ){
                            let td=$('<td/>');
                            tr.append(td);
                        }

                        if (key == 0 && reportType == 'final-year' && done){
                            let td=$('<td/>');
                            tr.append(td);
                            td=$('<td/>');
                            tr.append(td);
                        }

                        if (key == 0 && reportType == 'final-year' && !done){
                            let td = $('<td/>',{text: $("#selectedCustomer option:selected").text()});
                            tr.append(td);
                            td = $('<td/>',{text: $("#fiscalYear option:selected").text()});
                            tr.append(td);
                            done = true;
                        }

                        let className = $(value).parent().attr('class');
                        let colorCell = className == 'NA-rating' ? naRating :
                            className == 'Acceptable' ? acceptable :
                                className == 'Good' ? good :
                                    className == 'Needs-improvement' ? needsImprovement: '';
                        let td=$('<td/>',{text:$(value).text()}).css("background-color", colorCell);
                        tr.append(td);
                        tbo.append(tr);
                    });
                }

                // Divisional Ratings
                if($(value).find(".customer").length == 0){
                    divisions.forEach(division => {
                        let tr=$('<tr/>');
                        let div = ".rating-divisional-"+division
                        $(value).find(div).each(function(key,value){
                            if(key == 0){
                                let td=$('<td/>');
                                tr.append(td);
                            }
                            let className = $(value).parent().attr('class');
                            let colorCell = className == 'NA-rating' ? naRating :
                                className == 'Acceptable' ? acceptable :
                                    className == 'Good' ? good :
                                        className == 'Needs-improvement' ? needsImprovement: '';
                            let td=$('<td/>',{text:$(value).text()}).css("background-color", colorCell);
                            tr.append(td);
                            tbo.append(tr);
                        });
                    })
                }

            });

            //Footer
            $(".rt-tfoot").each(function(key,value){
                let tr=$('<tr/>');

                if(reportType == 'final-year'){
                    let td=$('<td/>');
                    tr.append(td);
                    td=$('<td/>');
                    tr.append(td);
                }
                $(value).find(".rating").each(function(key,value){
                    let td=$('<td/>',{text:$(value).text()});
                    tr.append(td);
                });
                tbo.append(tr);
            });

            tbl.append(tbo);
            tblDiv.append(tbl);

            //$('#report-table').append(tblDiv)

            return tblDiv;
        },

        downloadExcel: function (reportType) {
            $("#btn-excel").click(function(e) {
                var htmlTable = SurveyEngine.commons.reportsUtil.exportHtmlTable(reportType)
                var file = new Blob([htmlTable.html()], {type:"application/vnd.ms-excel; charset=UTF-8"});
                var url = URL.createObjectURL(file);
                var fileName = "CSO Final Report - " + $("#fiscalMonth option:selected").text() + "-" + $("#fiscalYear option:selected").text()+".xls";
                var a = "<a id='downloadExcel' href='"+url+"' download='"+fileName+"'></a>";
                $("body").append(a);
                var CickDownload= document.getElementById('downloadExcel');
                CickDownload.click();
                $("body #downloadExcel").remove();
                e.preventDefault();
            });
        },
    },

    xmlUtil: {

        parseString: function(xmlString){
            var xmlDocument;
            if (document.implementation && document.implementation.createDocument) {
                xmlDocument = new DOMParser().parseFromString(xmlString, 'text/xml');
            }
            else if (window.ActiveXObject) {
                xmlDocument = new ActiveXObject("Microsoft.XMLDOM");
                xmlDocument.loadXML(xmlString);
            }
            return xmlDocument;
        },

        appendNode: function(xmlString, nodeName, nodeText, parentNode){
            var xmlDocument = SurveyEngine.commons.xmlUtil.parseString(xmlString);
            var newNode = xmlDocument.createElement(nodeName);
            var newText = xmlDocument.createTextNode(nodeText);
            newNode.appendChild(newText);
            xmlDocument.getElementsByTagName(parentNode)[0].appendChild(newNode);
            xmlString = new XMLSerializer().serializeToString(xmlDocument);

            return xmlString;
        }
    },

    surveyUtil: {
        // Transform from an XML string to HTML by calling an XSL template and append the result to a given id
        // The survey fields will be render with the answers if the param array listAnswers is set
        render: function(pageActive, xmlString, xslFilename, domElementId, listAnswers, listAwaitingResponses, surveyStatus, activeResponse){

            $.get("/statics/xsl/" + xslFilename + ".xsl", function(xslDocument){
                var date =  new Date();
                var xsltProcessor = new XSLTProcessor();
                xsltProcessor.setParameter(null, 'date', date);
                var survey = SurveyEngine.commons.surveyUtil;
                xsltProcessor.importStylesheet(xslDocument);
                var xmlDocument = SurveyEngine.commons.xmlUtil.parseString(xmlString);
                var resultFragment = xsltProcessor.transformToFragment(xmlDocument , document);

                $('#'+ domElementId).empty();
                $('#'+ domElementId).append(resultFragment);

                survey.pagination(pageActive, surveyStatus);
                //survey.paginationForSectionBranch(pageActive, surveyStatus);
                survey.branching();
                survey.datePicker();
                survey.validateAnswers();
                survey.validateFile();
                survey.changeCustomerResponse();

                if(listAnswers){
                    survey.fillAnswers(listAnswers, surveyStatus);
                }

                if(surveyStatus == "AWAITING"){
                    $('#page2 input[value="is NOT applicable (unknown, no business, etc.)"]').attr('checked', true);
                }

                // Append customerInfo
                if(listAwaitingResponses.length > 0){
                    listAwaitingResponses.forEach(awaitingResponse => {
                        $('#selectCustomerResponse').append(`<option value="/survey/${awaitingResponse.surveyId}/response/${awaitingResponse.id}">${awaitingResponse.customer}</option>`);
                    })
                }else {
                    $("#selectCustomerResponse")
                        .prop("disabled", true);
                }

                $('#selectCustomerResponse').val(activeResponse);
                $('#a_page1').text('Go to Overall Ratings');
                $('#a_page2').text('Go to Divisional Ratings');

            });
        },

        changeCustomerResponse: function () {
            $('#selectCustomerResponse').change(function() {
                document.location.href = $(this).val();
            });
        },

        pagination: function(pageActive, surveyStatus){
            $('#page'+pageActive).css('display','block');
            $('#a_page'+pageActive).parent().addClass('active');
            $('#a_page'+pageActive).parent().siblings().removeClass('active');

            $('a.page').click(function (e) {
                e.preventDefault();
                $(this).parent().addClass('active');
                $(this).parent().siblings().removeClass('active');
                target = $(this).attr('href');
                $('div.page').not(target).hide();
                $(target).fadeIn(600);

                if( surveyStatus != 'PREVIEW' && surveyStatus != 'PUBLISHED' ){
                    // ReactJs - PageInfo Component (Render current information page)
                    var idPage = target.replace('#page', '');
                    paginationForPageSection(idPage);
                }
            });
        },

        paginationForSectionBranch: function(sectionActive){
            $('#sectionPage'+(sectionActive)).css('display','block');
            $('#_sectionPage'+(sectionActive)).parent().addClass('active');
            $('#_sectionPage'+(sectionActive)).parent().siblings().removeClass('active');
            $('div.section').not('#sectionPage'+(sectionActive)).hide();

            $('a.section').click(function (e) {
                e.preventDefault();
                let sectionBlock = $(this).attr('href').slice(0, -1);
                $(sectionBlock+(sectionActive)).css('display','block');
                $(this).parent().addClass('active');
                $(this).parent().siblings().removeClass('active');
                target = $(this).attr('href');
                $('div.section').not(target).hide();
                $(this).fadeIn(600);
            });
        },

        branching: function(){
            $('input.branch').click(function () {
                var targetBranch = '#'+$(this).attr('id')+'_branch';
                //Remove values on branch change
                var branchFields = $(targetBranch).siblings('.branch').hide().find("input, textarea, select").not('[type="hidden"]');
                branchFields.val("");
                branchFields.attr("checked", false);

                $(targetBranch).has('div').length ? $(targetBranch).fadeIn(600) : false;
            });
        },

        datePicker: function(){
            $("input.date").datepicker();
            $("button.date").click(function(){
                var id = '#'+$(this).attr('name');
                $(id).datepicker("show");
            })
        },

        validateFile: function() {
            var input, file, message;

            $('input[type = file]').change(function (e) {
                input = e.target;
                file = input.files[0];
                message = file.name;
                var fileSize = SurveyEngine.commons.validate.fileSize(file.size);
                var fileType = SurveyEngine.commons.validate.fileType(file);
                if (fileType && file.size <= 1048576){
                    message = message + ", file size " + fileSize;
                    $(input).closest(".has-feedback").removeClass("has-error").addClass("has-success")
                }else if (!fileType){
                    message = message + ": Not a valid file type. Update your selection."
                    $(input).closest(".has-feedback").removeClass('has-success').addClass("has-error")
                }else {
                    message = message + ": Not a valid file size. Update your selection."
                    $(input).closest(".has-feedback").removeClass('has-success').addClass("has-error")
                }
                $(input).parent().find("#validateFile").text(message);
            });
        },

        validateAnswers: function(){
            $('[required]').blur(function(){
                SurveyEngine.commons.validate.required($(this));
            });

            $('[required]').change(function(){
                SurveyEngine.commons.validate.required($(this));
            });
        },

        validateOnSubmit: function(){
            var branchRequired = $('div.branch ').find('div.mandatory [required]').parent(":visible")
            var simpleRequired = $('[required]').not($('div.branch').find('div.mandatory [required]')), valid = true, requiredValidate;
            for(var i=0; i< simpleRequired.length; i++){
                requiredValidate = SurveyEngine.commons.validate.required(simpleRequired.get(i));
                if(!requiredValidate ){valid = false};
            }

            for(var i=0; i <branchRequired.length; i++){
                requiredValidate = SurveyEngine.commons.validate.required(branchRequired.get(i).firstElementChild);
                if(!requiredValidate){valid = false};
            }

            if (!valid){
                SurveyEngine.commons.userInterface.notify("Error", "Please answer the mandatory fields.", "error");
            }

            var input = $('input[type = file]')[0];
            if (input.files.length > 0) {
                var file = input.files[0];
                var message;
                message = file.name;
                var fileSize = SurveyEngine.commons.validate.fileSize(file.size);
                var fileType = SurveyEngine.commons.validate.fileType(file);
                if (fileType && file.size <= 1048576) {
                    message = message + ", file size " + fileSize;
                    $(input).closest(".has-feedback").removeClass('has-error').addClass("has-success")
                } else if (!fileType) {
                    message = message + ": Not a valid file type. Update your selection."
                    $(input).closest(".has-feedback").removeClass('has-success').addClass("has-error")
                    SurveyEngine.commons.userInterface.notify("Error", message , "error");
                    valid = false
                } else {
                    message = message + ": Not a valid file size. Update your selection."
                    $(input).closest(".has-feedback").removeClass('has-success').addClass("has-error")
                    valid = false;
                    SurveyEngine.commons.userInterface.notify("Error", message , "error");
                }
                $(input).parent().find("#validateFile").text(message);
            }
            console.log(valid)
            return valid;
        },

        fillAnswers: function(surveyAnswers, surveyStatus){
            for(var i in surveyAnswers){
                var inputId = surveyAnswers[i].InputId;
                var questionText = surveyAnswers[i].QuestionText;
                var answer = surveyAnswers[i].Answer;
                var type = surveyAnswers[i].type;

                //Set the survey's values saved
                if( type == 'FILE' ){
                    var $inputFile = $('<div id="'+ answer +'"><a href="/serve?blob-key='+ answer +'" download class="btn btn-info"><strong>Download</strong></a><a> </a><button type="button" onclick="SurveyEngine.commons.surveyUtil.deleteInputFile(\'' + answer + '\' , \'' + inputId + '\')" class="btn btn-xs btn-danger btn-circle"><span class="glyphicon glyphicon-remove"></span></button></div>');
                    $("#"+inputId).closest(".file-drop-area").hide();
                    $("#"+inputId).remove();
                    $inputFile.insertAfter("#hdn"+inputId);
                }else{
                    $('input[name="' + inputId + '"][value="' + answer + '"][class="branch"]').click();
                    $("#"+inputId).val(answer);
                    $('input[name="' + inputId + '"][value="' + answer + '"]').attr('checked', true);
                }

                //Disable all form if survey is submitted
                if(surveyStatus == 'EXPIRED' || surveyStatus == 'AWAITING_EXPIRED'){
                    $(":input").not("[id=selectCustomerResponse]")
                        .prop("disabled", true);
                }
            }
        },

    deleteInputFile: function(fileName, fileId){
            var inputFile = $('<input id="'+ fileId +'" type="file" class="file-input" name="'+ fileId +'"  value="" accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.csv,.xls,.xlsx,.application/vnd.ms-excel,.application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.pdf,.application/pdf,.zip,.application/zip,.application/x-zip-compressed">');
            $("#"+fileName).remove();
            inputFile.insertAfter($("#hdn"+fileId).next().closest(".file-drop-area").children(".file-msg"))
            $(inputFile).onChange = SurveyEngine.commons.surveyUtil.validateFile()
            $("#"+fileId).closest(".file-drop-area").show();
        }
    },

    validate: {

        fileSize: function (number) {
            if(number < 1024) {
                return number + 'bytes';
            } else if(number > 1024 && number < 1048576) {
                return (number/1024).toFixed(1) + 'KB';
            } else if(number > 1048576) {
                return (number/1048576).toFixed(1) + 'MB';
            }
        },

        fileType: function (file) {
            var fileTypes = [
                'doc',
                'docx',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'csv',
                'xls',
                'xlsx',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'pdf',
                'application/pdf',
                'zip',
                'application/zip',
                'application/x-zip-compressed'
            ]

            for(var i = 0; i < fileTypes.length; i++) {
                if(file.type === fileTypes[i]) {
                    return true;
                }
            }
            return false;
        },

        required: function(field){
            var typeMultiple = $(field).attr("type") == "checkbox" || $(field).attr("type") == "radio";
            var checked, multiple;

            if(typeMultiple){
                multiple = $(field).closest('.mandatory').find('input');
                for(var i=0;i<multiple.length;i++){
                    if (multiple.get(i).checked){
                        checked = true;
                    }
                }
            }

            if((!typeMultiple && $(field).val() == '') ||  (typeMultiple && !checked)){
                SurveyEngine.commons.userInterface.haserrorStyle(field);
                return false;
            }
            SurveyEngine.commons.userInterface.hassuccessStyle(field);

            return true;
        }
    },

    userInterface: {

        goBackButton: function(buttonId){
            $('#'+buttonId).click(function(){
                parent.history.back();
            });
        },

        loadingButton: function(scope){
            scope.addClass('state-loading');
            $('#navigation-b').addClass("important");
            $("#main-content").toggleClass("block-content");
        },

        navigationTopFixed: function(){
            $('#navigation-b').affix({
                offset: {
                    top: $("#header").outerHeight()
                }
            });

            $('#navigation-b').on('affix.bs.affix', function () {
                $("#header").hide();
                $(this).css("top", "0px");
                $('#containerSection').css("margin-top", "140px");
            });

            $('#navigation-b').on('affixed-top.bs.affix', function () {
                $("#header").show();
                $('#containerSection').css("margin-top", "0px");
            });
        },

        scrollTo: function(domElementId){
            $('html, body').animate({
                scrollTop: $('#' + domElementId).offset().top
            }, 1000);
        },

        haserrorStyle: function(field){
            $(field).closest('.mandatory').addClass('has-error');
            $(field).next('.form-control-feedback').addClass('glyphicon-remove');
        },

        hassuccessStyle: function(field){
            $(field).closest('.mandatory').removeClass('has-error');
            $(field).closest('.mandatory').addClass('has-success').children('.form-control-feedback').removeClass('glyphicon-remove');
            $(field).next('.form-control-feedback').addClass('glyphicon-ok');
        },

        notify: function(title, text, type) {
            $(function () {
                new PNotify({
                    title: title,
                    text: text,
                    type: type,
                    hide: true,
                    delay: 2500
                });
            });
        },

        getUrlParam: function(sParam){
            var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }
        }
    }
}