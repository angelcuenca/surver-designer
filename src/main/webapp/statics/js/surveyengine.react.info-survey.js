/*
    User Interface to handle XML using the power of ReactJS
    Date:           Winter 2017
    Created by:     Angel Cuenca, Arlette Parra
*/

class Header extends React.Component {
    state = {
        surveyTitle: '',
        surveyInfo: '',
        surveyLogo: ''
    };

    componentDidUpdate(prevProps, prevState) {
        //Get current xml
        let xml = $('#code').val();

        //Set value between two tags
        xml = xml.replace(/<surveyTitle>[\s\S]*?<\/surveyTitle>/, '<surveyTitle>' + this.state.surveyTitle + '<\/surveyTitle>');
        xml = xml.replace(/<surveyDescription>[\s\S]*?<\/surveyDescription>/, '<surveyDescription>' + this.state.surveyInfo + '<\/surveyDescription>');
        xml = xml.replace(/<surveyLogo source="[\s\S]*?"><\/surveyLogo>/,'<surveyLogo source="'+this.state.surveyLogo+'">'+'<\/surveyLogo>');

        //Set xml
        $("#code").val( xml );

        //Get page number to render
        let idPage = document.getElementById("page-survey-component").getAttribute('id-page');

        //Call render for all Survey elements
        let surveyUtil = SurveyEngine.commons.surveyUtil;
        surveyUtil.render(idPage, xml, "surveyEdit", "preview");
    };

    componentDidMount(){
        //Get current xml
        let xml = $('#code').val();

        //Get content between two tags (title)
        let startPos = xml.indexOf("<surveyTitle>") + "<surveyTitle>".length;
        let endPos = xml.indexOf("</surveyTitle>");
        let title = xml.substring(startPos, endPos).trim();
        this.setState({ surveyTitle: title });

        //Get content between two tags (description)
        startPos = xml.indexOf("<surveyDescription>") + "<surveyDescription>".length;
        endPos = xml.indexOf("</surveyDescription>");
        let description = xml.substring(startPos, endPos).trim();
        this.setState({ surveyInfo: description });

        //Get attribute source for logo
        let doc = new DOMParser().parseFromString(xml,'text/xml');
        let logo = doc.getElementsByTagName("surveyLogo")[0].getAttribute("source");

        this.setState({ surveyLogo: logo });
    };

    handleUploadLogo(redirectAction){
        let file = $('#btn-chooseImage')[0].files[0];
        let formData = new FormData();
        formData.append("uploaded_files", file);
        let request = new XMLHttpRequest();
        request.open("POST", redirectAction, true);
        request.send(formData);
        request.onload = function() {
            if (request.status === 200) {
                let response = JSON.parse(request.responseText);
                this.setState({
                    surveyLogo: '/serve?blob-key=' +response.blobKey.toString()
                });
            }
        }.bind(this);
    };

    handleUploadSession(){
        let request = new XMLHttpRequest();
        request.open("GET", "/uploadSession");
        request.send();
        request.onload = function () {
            if(request.status === 200){
                let redirectAction = JSON.parse(request.responseText);
                this.handleUploadLogo(redirectAction);
            }
        }.bind(this);
    }

    render() {
        return(
            <div id="header-survey">
                <h5 className="title-info"> Title </h5>
                <div>
                    <input
                    value={this.state.surveyTitle}
                    onChange={(event) => this.setState({ surveyTitle: event.target.value })}
                    className="header-info"
                    type="text" />
                </div>
                <h5 className="title-info"> Description </h5>
                <div>
                    <textarea
                    value={this.state.surveyInfo}
                    onChange={(event) => this.setState({ surveyInfo: event.target.value })}
                    className="header-info"
                    type="text" rows="3" style={{resize:'vertical'}} />
                </div>
                <h5 className="title-info-logo"> Logo </h5>
                <div>
                    <label className="header-file">
                        <span><span className="ion-upload"></span> UPLOAD</span>
                        <input id="btn-chooseImage" name="surveyLogo" className="btn-file-logo"
                        placeholder="Type your survey description"
                        onChange={() => this.handleUploadSession()}
                        type="file" />
                    </label>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Header />, document.getElementById('header-survey'));