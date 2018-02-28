/*
    Functions used by ReactJS files
    Date:           Winter 2017
    Created by:     Angel Cuenca
*/

const SurveyEngine = SurveyEngine || {};
const userInterface = SurveyEngine.commons.userInterface;

//Function used in designer.jsp / surveyengine.react.js
$('#EditQuestionModal').on('hidden.bs.modal', function () {
    //Remove element if modal is closed (unmount react component)
    $("#edit-question").remove();
});

//When close modal component is unmounting
$('#EditContactModal').on('hidden.bs.modal', function () {
    //Unmounting component
    ReactDOM.unmountComponentAtNode(document.getElementById('edit-user'));
});

//When close modal component is unmounting
$('#RemoveContactModal').on('hidden.bs.modal', function () {
    //Unmounting component
    ReactDOM.unmountComponentAtNode(document.getElementById('remove-user'));
});

//When close modal component is unmounting
$('#AddCustomerContactMapModal').on('hidden.bs.modal', function () {
    //Unmounting component
    ReactDOM.unmountComponentAtNode(document.getElementById('add-customer-contact-map'));
});

//When close modal component is unmounting
$('#AddCustomerExternalRating').on('hidden.bs.modal', function () {
    //Unmounting component
    ReactDOM.unmountComponentAtNode(document.getElementById('add-customer-external-rating'));
});

//When close modal component is unmounting
$('#ModalRatingType').on('hidden.bs.modal', function () {
    //Unmounting component
    ReactDOM.unmountComponentAtNode(document.getElementById('add-rating-type'));
});

//When close modal component is unmounting
$('#DeleteCustomerModal').on('hidden.bs.modal', function () {
    //Unmounting component
    ReactDOM.unmountComponentAtNode(document.getElementById('delete-customer'));
});

function reactPopup(indexToInsert){
    //Add attribute to modal (index to insert new question)
    document.getElementById("root").setAttribute("index-insert", indexToInsert);

    //Hide and Show components div
    $(".components").show();
    $(".question-selected").hide();
    $("#AddQuestionModal").modal();
}

function removeQuestionPopup(indexToRemove){
    //Add attribute to modal (index to remove question)
    document.getElementById("remove-question").setAttribute("index-remove", indexToRemove);
    $("#RemoveQuestionModal").modal();
}

function editQuestionPopup(indexToEdit){
    //Create div for mount edit react component
    $("#modal-edit").append('<div id="edit-question"></div>');

    //Add attribute to modal (index to edit question)
    document.getElementById("edit-question").setAttribute("index-edit", indexToEdit);

    //Mount React component in DOM
    ReactDOM.render(
        React.createElement(EditQuestion, null),
        document.getElementById('edit-question')
    );

    $("#EditQuestionModal").modal();
}

function paginationForPageSection(idPage){

    //Remove element when pagination button is clicked
    $("#page-survey-component").remove();

    //Mount PageInfo component to render the new information
    $("#page-survey").append('<div id="page-survey-component"></div>');

    //Add page number as attribute
    document.getElementById("page-survey-component").setAttribute("id-page", idPage);

    //Mount React component in DOM
    ReactDOM.render(
        React.createElement(PageInfo, null),
        document.getElementById('page-survey-component')
    );
}

function addPage(idPage){
    //Get current xml
    let xml = $('#code').val();

    //Create array with all pages in the xml
    let startPos = xml.indexOf("</surveyInfo>") + "</surveyInfo>".length;
    let endPos = xml.indexOf("</survey>");
    let pagesXML = xml.substring(startPos, endPos).trim();

    //Parser DOM XML string to get each page
    let parser = new DOMParser();
    pagesXML = '<root>' + pagesXML + '</root>';
    let xmlDoc = parser.parseFromString(pagesXML, "text/xml");

    let pagesArray = Array.prototype.map.call(
    xmlDoc.querySelectorAll('page'), function(e){
        return e.outerHTML.replace(/\t/g, '')
    });

    let newPageXml = '<page><pageInfo><pageTitle>Title for this Page</pageTitle><pageDescription>Optional description for this page</pageDescription></pageInfo></page>';

    //Adding the new page
    pagesArray.splice(idPage, 0, newPageXml);

    //Iterate to build complete section xml string
    let pages = "";
    pagesArray.forEach(function(element) {
        pages += element;
    });

    //Replace the new section page
    xml = xml.replace(/<\/surveyInfo>[\s\S]*?<\/survey>/, '</surveyInfo>' + pages + '<\/survey>');

    //Set xml
    $("#code").val( xml );

    //Change page number to render page information
    paginationForPageSection(idPage+1);

    //Call render for all Survey elements
    const surveyUtil = SurveyEngine.commons.surveyUtil;
    surveyUtil.render(idPage + 1, xml, "surveyEdit", "preview");
}

function removePage(idPage){
    //Get current xml
    let xml = $('#code').val();

    //Create array with all pages in the xml
    let startPos = xml.indexOf("</surveyInfo>") + "</surveyInfo>".length;
    let endPos = xml.indexOf("</survey>");
    let pagesXML = xml.substring(startPos, endPos).trim();

    //Parser DOM XML string to get each page
    let parser = new DOMParser();
    pagesXML = '<root>' + pagesXML + '</root>';
    let xmlDoc = parser.parseFromString(pagesXML, "text/xml");

    let pagesArray = Array.prototype.map.call(
    xmlDoc.querySelectorAll('page'), function(e){
        return e.outerHTML.replace(/\t/g, '')
    });

    //Render page 2 when page 1 is deleted
    let renderFirst = false;
    if( idPage === 1 && pagesArray.length > 1 ){
        renderFirst = true;
    }

    //Remove the section (page)
    pagesArray.splice(idPage - 1, 1);

    //Iterate to build complete pages xml string
    let pages = "";
    pagesArray.forEach(function(element) {
        pages += element;
    });

    //Replace the new page
    xml = xml.replace(/<\/surveyInfo>[\s\S]*?<\/survey>/, '</surveyInfo>' + pages + '<\/survey>');

    //Set xml
    $("#code").val( xml );

    if( renderFirst ){
        //Change page number to render page information
        paginationForPageSection(idPage);

        //Call render for all Survey elements
        const surveyUtil = SurveyEngine.commons.surveyUtil;
        surveyUtil.render(idPage, xml, "surveyEdit", "preview");
    }else{
        //Change page number to render page information
        paginationForPageSection(idPage-1);

        //Call render for all Survey elements
        const surveyUtil = SurveyEngine.commons.surveyUtil;
        surveyUtil.render(idPage - 1, xml, "surveyEdit", "preview");
    }
}

//Validations for Survey and Page Information
$('#btn-publish, #btn-save').click(function(e) {
    //Get current xml
    let xml = $('#code').val();

    //Get survey title
    let startPos = xml.indexOf("<surveyTitle>") + "<surveyTitle>".length;
    let endPos = xml.indexOf("</surveyTitle>");
    let surveyTitle = xml.substring(startPos, endPos).trim();

    if( surveyTitle === '' ){
        userInterface.notify('Survey Title', 'Please add a title for this survey.', 'notice');
        e.preventDefault(e);
    }else{
        //Get pages
        startPos = xml.indexOf("</surveyInfo>") + "</surveyInfo>".length;
        endPos = xml.indexOf("</survey>");
        let pagesXml = xml.substring(startPos, endPos).trim();

        //Parser DOM XML string to get each page
        let parser = new DOMParser();
        pagesXml = '<root>' + pagesXml + '</root>';
        let xmlDoc = parser.parseFromString(pagesXml, "text/xml");

        let pagesArray = Array.prototype.map.call(
        xmlDoc.querySelectorAll('page'), function(e){
            return e.outerHTML.replace(/\t/g, '')
        });

        let infoValidation = true;
        pagesArray.forEach(function(element, index) {
            startPos = element.indexOf("<pageTitle>") + "<pageTitle>".length;
            endPos = element.indexOf("</pageTitle>");

            if( element.substring(startPos, endPos).trim() === '' ){
                userInterface.notify('Page Title', 'Please add a title for page '+(index+1)+'.', 'notice');
                e.preventDefault(e);
                infoValidation = false;
            }
        });

        if( this.id === 'btn-publish' ){
            //Get optional description
            startPos = xml.indexOf("<surveyDescription>") + "<surveyDescription>".length;
            endPos = xml.indexOf("</surveyDescription>");
            let surveyDescription = xml.substring(startPos, endPos).trim();

            //Set empty value
            if (surveyDescription === 'Optional survey description') {
                xml = xml.replace(/<surveyDescription>[\s\S]*?<\/surveyDescription>/, '<surveyDescription>' + ' ' + '<\/surveyDescription>');
            }

            //Get optional description
            let pagesArrayXml = [];
            pagesArray.forEach(function(element, index) {
                startPos = element.indexOf("<pageDescription>") + "<pageDescription>".length;
                endPos = element.indexOf("</pageDescription>");
                let pageDescription = element.substring(startPos, endPos).trim();

                //Set empty value
                if (pageDescription === 'Optional description for this page') {
                    element = element.replace(/<pageDescription>[\s\S]*?<\/pageDescription>/, '<pageDescription>' + ' ' + '<\/pageDescription>');
                }

                pagesArrayXml[index] = element;
            });

            //Build complete xml pages
            let pages = "";
            pagesArrayXml.forEach(function(element) {
                pages += element;
            });

            //Replace the new page
            xml = xml.replace(/<\/surveyInfo>[\s\S]*?<\/survey>/, '</surveyInfo>' + pages + '<\/survey>');

            //Set xml
            $("#code").val(xml);
        }
    }
});