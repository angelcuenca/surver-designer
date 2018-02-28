/*
    User Interface to handle XML using the power of ReactJS
    Date:           Summer 2017
    Created by:     Angel Cuenca
*/

class PageInfo extends React.Component {
    state = {
        pageTitle: '',
        pageInfo: '',
    };

    handlePageInfo() {
        //Get current xml
        let xml = $('#code').val();

        //Create array with all pages in the xml
        let pagesXML = xml.match( /<\/surveyInfo[^>]*>([\s\S]*?)<\/survey>/i )[1];

        //Parser DOM XML string to get each page
        let parser = new DOMParser();
        pagesXML = '<root>' + pagesXML + '</root>';
        let xmlDoc = parser.parseFromString(pagesXML,"text/xml");

        let pagesArray = Array.prototype.map.call(
        xmlDoc.querySelectorAll('page'), function(e){
            return e.outerHTML.replace(/\t/g, '')
        });

        //Get position to remove, attribute previously added in appropriate question
        let idPage = document.getElementById("page-survey-component").getAttribute('id-page');

        //Get specific page to render Page Information
        let pageXml = pagesArray[idPage - 1];

        //Set value between two tags
        if( this.state.pageTitle === '' ){
            pageXml = pageXml.replace(/<pageTitle>[\s\S]*?<\/pageTitle>/, '<pageTitle>' + " " + '<\/pageTitle>');
        }else{
            pageXml = pageXml.replace(/<pageTitle>[\s\S]*?<\/pageTitle>/, '<pageTitle>' + this.state.pageTitle + '<\/pageTitle>');
        }

        if( this.state.pageInfo === '' ){
            pageXml = pageXml.replace(/<pageDescription>[\s\S]*?<\/pageDescription>/, '<pageDescription>' + " " + '<\/pageDescription>');
        }else{
            pageXml = pageXml.replace(/<pageDescription>[\s\S]*?<\/pageDescription>/, '<pageDescription>' + this.state.pageInfo + '<\/pageDescription>');
        }

        //Replace the page
        pagesArray[idPage - 1] = pageXml;

        //Iterate to build complete page xml string
        let pages = "";
        pagesArray.forEach(function(element) {
            pages += element;
        });

        //Replace the new page section
        xml = xml.replace(/<\/surveyInfo>[\s\S]*?<\/survey>/, '</surveyInfo>' + pages + '<\/survey>');

        //Set xml
        $("#code").val( xml );

        //Call render for all Survey elements
        let surveyUtil = SurveyEngine.commons.surveyUtil;
        surveyUtil.render(idPage, xml, "surveyEdit", "preview");
    };

    componentDidMount(){
        //Get current xml
        let xml = $('#code').val();

        //Create array with all pages in the xml
        let pagesXML = xml.match( /<\/surveyInfo[^>]*>([\s\S]*?)<\/survey>/i )[1];

        //Parser DOM XML string to get each page section
        let parser = new DOMParser();
        pagesXML = '<root>' + pagesXML + '</root>';
        let xmlDoc = parser.parseFromString(pagesXML,"text/xml");

        let pagesArray = Array.prototype.map.call(
        xmlDoc.querySelectorAll('page'), function(e){
            return e.outerHTML.replace(/\t/g, '')
        });

        //Get page number to render
        let idPage = document.getElementById("page-survey-component").getAttribute('id-page');

        //Get specific page to render Page Information
        let pageXml = pagesArray[idPage - 1];

        //Get content between two tags (page title)
        let title;
        if( pageXml.match( /<pageTitle[^>]*>([\s\S]*?)<\/pageTitle>/i )[1] === ' ' ){
            title = "";
        }else{
            title = pageXml.match( /<pageTitle[^>]*>([\s\S]*?)<\/pageTitle>/i )[1];
        }

        //Get content between two tags (page description)
        let description;
        if( pageXml.match( /<pageDescription[^>]*>([\s\S]*?)<\/pageDescription>/i )[1] === ' ' ){
            description = "";
        }else{
            description = pageXml.match( /<pageDescription[^>]*>([\s\S]*?)<\/pageDescription>/i )[1];
        }

        this.setState({
            pageInfo: description,
            pageTitle: title
        });
    };

    render() {
        return(
            <div id="page-survey">
                <h5 className="title-info"> Page Title </h5>
                <div>
                    <input
                    value={this.state.pageTitle}
                    onChange = {(event) => this.setState({ pageTitle: event.target.value}, () => {this.handlePageInfo()})}
                    className="input-page-info"
                    type="text" />
                </div>
                <h5 className="title-info"> Page Description </h5>
                <div>
                    <textarea
                    value={this.state.pageInfo}
                    onChange = {(event) => this.setState({ pageInfo: event.target.value}, () => {this.handlePageInfo()})}
                    className="input-page-info"
                    type="text" rows="3" style={{resize:'vertical'}} />
                </div>
            </div>
        )
    }
}

ReactDOM.render(<PageInfo />, document.getElementById('page-survey-component'));