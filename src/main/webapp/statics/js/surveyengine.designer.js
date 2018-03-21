/**
 * Created by project on 27/07/16.
 */
var SurveyEngine = SurveyEngine || {};

var xmlUtil =  SurveyEngine.commons.xmlUtil;
var userInterface = SurveyEngine.commons.userInterface;
var surveyUtil = SurveyEngine.commons.surveyUtil;
SurveyEngine.surveyDesigner = {

    ready: function(){
        $(document).ready(function(){

            userInterface.goBackButton("return");
            userInterface.navigationTopFixed();
            var code = $('#code').val();

            //If there is xml code validate and create a preview
            if(code){
                //Render view depending on Survey's status (Page to show: 1)
                if( $('#status').val() === "PUBLISHED" || $('#status').val() === "PREVIEW"){
                    surveyUtil.render(1, code, "surveyPreview", "preview", "" , $('#status').val());
                } else {
                    surveyUtil.render(1, code, "surveyEdit", "preview");
                }
                /*
                var errors = $('#errors .well-danger').length();

                if(errors > 0){
                    userInterface.notify("Error", "Check the errors panel", "error");
                    userInterface.scrollTo('errors');
                }
                else{
                    $("#btn-publish").removeClass("hidden").fadeIn(600);
                    //userInterface.scrollTo('previewSection');
                }*/
            }

            $('#chooseXML').on('change', function(){
                var reader = new FileReader();
                var xml = document.getElementById('chooseXML');
                var files = xml.files;

                reader.readAsText(files[0], 'UTF-8');
                reader.onload = function(evt){
                    //editor.setCode(evt.target.result);
                    $("#btn-edit").click();
                }
            });

            /* !Drag & drop area change file name */
            $('.file-input').on('change', function() {
                $('.file-name').text($(".file-input").val().split('\\').pop());
            });

            /* !Loading buttons */
            $('#btn-save, #btn-publish, #btn-edit').on("click", function(){
                userInterface.loadingButton($(this));

                var enableReminder = $('#switch-reminder').prop("checked");
                $("#enableReminder").val(enableReminder);

                var enableApproval = $('#switch-approval').prop("checked");
                $("#enableApproval").val(enableApproval);

                var enableExpirationReminder = $('#switch-expiration').prop("checked");
                $("#enableExpirationReminder").val(enableExpirationReminder);
            });
        });
    },

    notifyDesigner: function(setNotify){

        switch (setNotify){
            case "saveSuccess":
                userInterface.notify('Saved','The survey has been added to your dashboard.','info');
                break;

            case "saveFail":
                userInterface.notify('Errors Found','Fix the errors and try again, please.','info');
                break;

            case  "validateSuccess":
                userInterface.notify('Success','No errors Found.','success');
                break;

            case "nameValidationFail":
                userInterface.notify('Error','This survey title already exist.','error');
                break;
        }
    }

}
