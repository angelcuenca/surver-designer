var SurveyEngine = SurveyEngine || {};

SurveyEngine.surveyAnswer = {

    ready: function(listAnswers, listAwaitingResponses,  notify, surveyStatus, expirationDate, fiscalMonth, fiscalYear, activeResponse, contact){
        $(document).ready(function(){
            var surveyUtil = SurveyEngine.commons.surveyUtil;
            var xmlUtil = SurveyEngine.commons.xmlUtil;
            var userInterface = SurveyEngine.commons.userInterface;

            let expirationDateFormat  = moment.utc(expirationDate, "ddd MMM DD HH:mm:ss [] YYYY")
            expirationDateFormat.tz('America/Mexico_City');
            expirationDateFormat.format('LLL');
            // Append surveyInfo
            var xmlString = xmlUtil.appendNode($('#code').val(), "expirationDate", expirationDateFormat, "surveyInfo");
            xmlString = xmlUtil.appendNode(xmlString, "fiscalMonth", fiscalMonth, "surveyInfo");
            xmlString = xmlUtil.appendNode(xmlString, "fiscalYear", fiscalYear, "surveyInfo");
            xmlString = xmlUtil.appendNode(xmlString, "contact", contact, "surveyInfo");

            // Render Survey (Page to show: 1)
            surveyUtil.render(1, xmlString, "surveyPreview", "preview", listAnswers, listAwaitingResponses, surveyStatus, activeResponse);

            /* !Loading buttons */
            $('#btn-save').click(function(e){
                $('#isSubmitPost').val(false);
                userInterface.loadingButton($(this));
                $('#form').submit();
            });

            $('#btn-submit').click(function (e) {
                if (surveyUtil.validateOnSubmit()) {
                    $('#isSubmitPost').val(true);

                    var validate = $(this).attr('formaction');
                    userInterface.loadingButton($(this));
                    $("#form").attr("action", validate).submit();
                }
            });

            if(notify){
                userInterface.notify("Success", "Survey has been saved.", "success");
            }

        });
    }
}