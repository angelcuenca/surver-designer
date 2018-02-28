/*
    User Interface to handle XML using ReactJS. Remove Question component
    Date:           Winter 2017
    Created by:     Angel Cuenca
*/

class RemoveQuestion extends React.Component {

    removeQuestion = (result) => {
        if ( result ){
            //Get position to remove, attribute previously added in appropriate question
            let indexToRemove = document.getElementById("remove-question").getAttribute('index-remove');

            //Get total xml
            let xml = $('#code').val();

            //Create array with all pages in the xml
            let startPos = xml.indexOf("</surveyInfo>") + "</surveyInfo>".length;
            let endPos = xml.indexOf("</survey>");
            let pagesXML = xml.substring(startPos, endPos).trim();

            //Parser DOM XML string to get each section
            let parser = new DOMParser();
            pagesXML = '<root>' + pagesXML + '</root>';
            let xmlDoc = parser.parseFromString(pagesXML,"text/xml");

            let pagesArray = Array.prototype.map.call(
            xmlDoc.querySelectorAll('page'), function(e){
                return e.outerHTML.replace(/\t/g, '')
            });

            //Get page number to render
            let idPage = document.getElementById("page-survey-component").getAttribute('id-page');

            //Get specific section to render Page Information
            let pageXml = pagesArray[idPage - 1];

            //Get questions section xml
            startPos = pageXml.indexOf("</pageInfo>") + "</pageInfo>".length;
            endPos = pageXml.indexOf("</page>");
            let xmlQuestions = pageXml.substring(startPos,endPos).trim();

            //Parser DOM XML string to get each questionModule
            parser = new DOMParser();
            xmlQuestions = '<root>' + xmlQuestions + '</root>';
            xmlDoc = parser.parseFromString(xmlQuestions,"text/xml");

            let arrayQuestions = Array.prototype.map.call(
            xmlDoc.querySelectorAll('questionModule'), function(e){
                return e.outerHTML.replace(/\t/g, '');
            });

            //Remove question
            arrayQuestions.splice(indexToRemove - 1 , 1);

            //Iterate to build complete questions xml string
            let questions = "";
            arrayQuestions.forEach(function(element) {
                questions += element;
            });

            //Set value in specific page
            pageXml = pageXml.replace(/<\/pageInfo>[\s\S]*?<\/page>/, '<\/pageInfo>' + questions + '<\/page>');

            //Replace the page
            pagesArray[idPage - 1] = pageXml;

            //Iterate to build complete section xml string
            let pages = "";
            pagesArray.forEach(function(element) {
                pages += element;
            });

            //Replace the new page
            xml = xml.replace(/<\/surveyInfo>[\s\S]*?<\/survey>/, '</surveyInfo>' + pages + '<\/survey>');

            //Save xml
            $("#code").val( xml );

            //Call render
            let surveyUtil = SurveyEngine.commons.surveyUtil;
            surveyUtil.render(idPage, xml, "surveyEdit", "preview");
        }

        $("#RemoveQuestionModal").modal('hide');
    };

    render() {
        return(
            <div className="remove-question">
                <h4> Do you want yo remove this question ? </h4>
                <div className="btn-remove-question">
                    <button className="btn-remove-yes" onClick={()=>this.removeQuestion(true)} >YES</button>
                    <button className="btn-remove-no" onClick={()=>this.removeQuestion(false)} >NO</button>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<RemoveQuestion />, document.getElementById('remove-question'));