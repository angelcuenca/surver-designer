/*
    User Interface to handle XML using the power of ReactJS
    Date:           Summer 2017
    Created by:     Angel Cuenca
*/

'use strict';

const SurveyEngine = SurveyEngine || {};
const userInterface = SurveyEngine.commons.userInterface;

class Survey extends React.Component {
    constructor(props) {
        super(props);
    }

    handleQuestion = (xml) => {
      this.props.onSubmit(xml);
    }

    render() {
        if (this.props.components.length === 0) {
            return null;
        }

        const renderCommpos = this.props.components.map((Elem, index) => {
            return <Elem onSubmit={this.handleQuestion} key={index} />
        });

        return (
            <div>
                {renderCommpos}
            </div>
        );
    }
}

class Form extends React.Component {
    state = {
        components: []
    };

    handleSubmit = (nameElement) => {
        //Hide and show components div survey
        $(".components").hide('slow');
        $(".question-selected").show('slow');

        //Shows element survey clicked
        const components = this.state.components;
        components[0] = nameElement;
        this.setState({
            components
        });
    };

    handleShowComponents() {
        $(".components").show('slow');
        $(".question-selected").hide('slow');
    };

    handleComponentXML = (xml) => {
        //Remove element survey
        this.setState(prevState => {
            const components = prevState.components.slice();
            components.splice(0, 1);
            return { components };
        });
        //Returns to App component with XML element
        this.props.onSubmit(xml);
    };

    render() {
        return (
            <div>
                <div className="components mtop-5">
                    <div className="row">
                        <div className="col-sm-12">
                            <h4 className="select-question-text pull-left">Select question:</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-3">
                            <img src={'/statics/img/type_question/input.png'} onClick={()=>this.handleSubmit(Input)} className="img-responsive"/>
                            <span>Input</span>
                        </div>
                        <div className="col-sm-3">
                            <img src={'/statics/img/type_question/select.png'} onClick={()=>this.handleSubmit(Select)} className="img-responsive"/>
                            <span>Select</span>
                        </div>
                        <div className="col-sm-3">
                            <img src={'/statics/img/type_question/date.png'} onClick={()=>this.handleSubmit(Date)} className="img-responsive"/>
                            <span>Date</span>
                        </div>
                        <div className="col-sm-3">
                            <img src={'/statics/img/type_question/file.png'} onClick={()=>this.handleSubmit(File)} className="img-responsive"/>
                            <span>File</span>
                        </div>
                    </div>
                    <div className="row mtop-20">
                        <div className="col-sm-3">
                            <img src={'/statics/img/type_question/radio.png'} onClick={()=>this.handleSubmit(Radio)} className="img-responsive"/>
                            <span>Radio</span>
                        </div>
                        <div className="col-sm-3">
                            <img src={'/statics/img/type_question/checkbox.png'} onClick={()=>this.handleSubmit(Checkbox)} className="img-responsive"/>
                            <span>Checkbox</span>
                        </div>
                        <div className="col-sm-3">
                            <img src={'/statics/img/type_question/textarea.png'} onClick={()=>this.handleSubmit(TextArea)} className="img-responsive"/>
                            <span>Textarea</span>
                        </div>
                        <div className="col-sm-3">
                            <img src={'/statics/img/type_question/branch.png'} onClick={()=>this.handleSubmit(Branch)} className="img-responsive"/>
                            <span>Branch</span>
                        </div>
                    </div>
                </div>
                <div className="question-selected mtop-10">
                    <div>
                        <button className="btn-show-components" onClick={this.handleShowComponents}>Show Components</button>
                    </div>
                    <div className="row">
                            <Survey onSubmit={this.handleComponentXML} components={this.state.components} />
                    </div>
                </div>
            </div>
        )
    }
}

class OptionQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
             casa: this.props.optionName,
             position: this.props.position
         };
    };

    handleOption () {
        this.props.onSubmit(this.state.casa, this.state.position);
    }

    handleRemoveOption = () => {
        this.props.onRemove(this.state.position);
    };

    render(){
        return(
            <div>
                <label>
                    <h5 className="title-option pull-left">Option {this.state.position + 1}</h5>
                    <input name="input" type="text"
                           value = {this.state.casa}
                           onChange = {(event) => this.setState({ casa: event.target.value}, () => this.handleOption())}
                    />
                </label>
                <button className="add-option-remove" onClick={()=>this.handleRemoveOption()}><span className="ion-close"></span></button>
            </div>
        )
    }
}

class Checkbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questionName: '',
            options: [],
            isChecked: true
        };
    };

    toggleSwitchRequired = () => {
        this.setState({
            isChecked: !this.state.isChecked,
        });
    };

    //Initialize any state when comes from edit question
    componentDidMount( ){
        //Get xml question passed as parameter
        var xmlQuestion = this.props.xml;

        if( xmlQuestion != null ){
            //Get content between two tags (title)
            var startPos = xmlQuestion.indexOf("<title>") + "<title>".length;
            var endPos = xmlQuestion.indexOf("</title>");
            var title = xmlQuestion.substring(startPos,endPos).trim();

            //Get required switch button
            var required;
            if( xmlQuestion.indexOf("mandatory=\"true\"") !== -1 ){
                required = true;
            }else{
                required = false;
            }

            //Get all options
            var startPos = xmlQuestion.indexOf("</title>") + "</title>".length;
            var endPos = xmlQuestion.indexOf("</questionModule>");
            var options = xmlQuestion.substring(startPos,endPos).trim();

            var parser = new DOMParser();
            options = '<root>' + options + '</root>';
            var xmlDoc = parser.parseFromString(options, "text/xml");

            var resultOptions = Array.prototype.map.call(
            xmlDoc.querySelectorAll('option'), function(e){
                return e.outerHTML.replace(/\t/g, '');
            });

            resultOptions.forEach(function(element, index) {
                //Get value for each option
                var startPos = element.indexOf("<option>") + "<option>".length;
                var endPos = element.indexOf("</option>");
                var option = element.substring(startPos, endPos).trim();
                resultOptions[index] = option;
            });

            //Set value states
            this.setState({
                options: resultOptions,
                questionName: title,
                isChecked: required
            });
        }
    };

    handleAddOption = () => {
        this.setState(prevState => ({
            options: prevState.options.concat("")
        }));
    };

    handleAddQuestion = () => {
        //Get options checkbox
        var emptyOption = false;
        var optionsXML = "";
        this.state.options.forEach(function(element) {
            optionsXML += "<option>"+ element +"</option>";
            //Validation
            if (element == '') {
                emptyOption = true;
                return false;
            }
        });

        //Validation
        if( this.state.questionName == '' || emptyOption || this.state.options.length < 2 ){
            if( this.state.options.length < 2 ){
                userInterface.notify('Checkbox Question','Please add even two options.','notice');
            }else{
                userInterface.notify('Checkbox Question','Please set all fields.','notice');
            }
        }else{
            //Set required question
            var xml;
            if( $('#switch-required').prop("checked") ) {
                xml = "<questionModule mandatory=\"true\" type=\"checkbox\"><title></title></questionModule>";
            } else {
                xml = "<questionModule type=\"checkbox\"><title></title></questionModule>";
            }

            xml = xml.replace(/<title>[\s\S]*?<\/title>/, '<title>' + this.state.questionName + '<\/title>');
            xml = xml.replace(/<\/title>[\s\S]*?<\/questionModule>/, '</title>' + optionsXML + '<\/questionModule>');

            this.props.onSubmit(xml);
            this.setState({
                questionName: '',
                options: []
            });
        }
    }

    handleOptions = (optionName, position) => {
        const options = this.state.options;
        options[position] = optionName;
        this.setState({
            options
        });
    };

    handleRemoveOption = (indexToRemove) => {
        const options = this.state.options;
        options.splice(indexToRemove, 1);

        this.setState({
            options: options
        });
    };

    render() {
        return(
            <div id="question" className="well well-white">
                <div className="col-sm-12">
                    <h3 className="pull-left"> Checkbox </h3>
                </div>
                <div>
                    <input
                    placeholder="Type your question name"
                    value={this.state.questionName}
                    onChange={(event) => this.setState({ questionName: event.target.value })}
                    className="question-name"
                    type="text" />
                </div>
                <div className="options-section">
                    {this.state.options.map( (option, index) => <OptionQuestion {...option} onSubmit={this.handleOptions} onRemove={this.handleRemoveOption} optionName={option} position={index} />)}
                </div>
                <div>
                    <button className="add-option" onClick={()=>this.handleAddOption()}>Add option</button>
                </div>
                <div className="bottom-question">
                    <div>
                        <h5 className="mbottom-0 mtop-10 mright-10 pull-left"> Required </h5>
                    </div>
                    <div>
                        <div className="onoffswitch-add mtop-5 pull-left">
                            <input id="switch-required"
                                   type="checkbox" name="onoffswitch" className="onoffswitch-checkbox-add"
                                   checked={this.state.isChecked}
                                   onChange={this.toggleSwitchRequired}   />
                            <label className="onoffswitch-label-add" htmlFor="switch-required">
                                <div className="onoffswitch-inner-add"></div>
                                <div className="onoffswitch-switch-add"></div>
                            </label>
                        </div>
                    </div>
                    <div>
                        <button className="add-question pull-right" onClick={()=>this.handleAddQuestion()}>Save</button>
                    </div>
                </div>
            </div>
        )
    }
}

class Select extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questionName: '',
            options: [],
            isChecked: true
        };
    };

    toggleSwitchRequired = () => {
        this.setState({
            isChecked: !this.state.isChecked,
        });
    };

    //Initialize any state when comes from edit question
    componentDidMount( ){
        //Get xml question passed as parameter
        var xmlQuestion = this.props.xml;

        if( xmlQuestion != null ){
            //Get content between two tags (title)
            var startPos = xmlQuestion.indexOf("<title>") + "<title>".length;
            var endPos = xmlQuestion.indexOf("</title>");
            var title = xmlQuestion.substring(startPos,endPos).trim();

            //Get required switch button
            var required;
            if( xmlQuestion.indexOf("mandatory=\"true\"") !== -1 ){
                required = true;
            }else{
                required = false;
            }

            //Get all options
            var startPos = xmlQuestion.indexOf("</title>") + "</title>".length;
            var endPos = xmlQuestion.indexOf("</questionModule>");
            var options = xmlQuestion.substring(startPos,endPos).trim();

            var parser = new DOMParser();
            options = '<root>' + options + '</root>';
            var xmlDoc = parser.parseFromString(options, "text/xml");

            var resultOptions = Array.prototype.map.call(
            xmlDoc.querySelectorAll('option'), function(e){
                return e.outerHTML.replace(/\t/g, '');
            });

            resultOptions.forEach(function(element, index) {
                //Get value for each option
                var startPos = element.indexOf("<option>") + "<option>".length;
                var endPos = element.indexOf("</option>");
                var option = element.substring(startPos, endPos).trim();
                resultOptions[index] = option;
            });

            //Set value states
            this.setState({
                options: resultOptions,
                questionName: title,
                isChecked: required
            });
        }
    };

    handleAddOption = () => {
        this.setState(prevState => ({
            options: prevState.options.concat("")
        }));
    };

    handleAddQuestion = () => {
        //Get options Select
        var emptyOption = false;
        var optionsXML = "";
        this.state.options.forEach(function(element) {
            optionsXML += "<option>"+ element +"</option>";
            //Validation
            if (element == '') {
                emptyOption = true;
                return false;
            }
        });

        //Validation
        if( this.state.questionName == '' || emptyOption || this.state.options.length < 2 ){
            if( this.state.options.length < 2 ){
                userInterface.notify('Select Question','Please add even two options.','notice');
            }else{
                userInterface.notify('Select Question','Please set all fields.','notice');
            }
        }else{
            //Set required question
            var xml;
            if( $('#switch-required').prop("checked") ) {
                xml = "<questionModule mandatory=\"true\" type=\"select\"><title></title></questionModule>";
            } else {
                xml = "<questionModule type=\"select\"><title></title></questionModule>";
            }

            xml = xml.replace(/<title>[\s\S]*?<\/title>/, '<title>' + this.state.questionName + '<\/title>');
            xml = xml.replace(/<\/title>[\s\S]*?<\/questionModule>/, '</title>' + optionsXML + '<\/questionModule>');

            this.props.onSubmit(xml);
            this.setState({
                questionName: '',
                options: []
            });
        }
    }

    handleOptions = (optionName, position) => {
        const options = this.state.options;
        options[position] = optionName;
        this.setState({
            options
        });
    };

    handleRemoveOption = (indexToRemove) => {
        const options = this.state.options;
        options.splice(indexToRemove, 1);

        this.setState({
            options: options
        });
    };

    render() {
        return(
            <div id="question" className="well well-white">
                <div className="col-sm-12">
                    <h3 className="pull-left"> Dropdown </h3>
                </div>
                <div>
                    <input
                    placeholder="Type your question name"
                    value={this.state.questionName}
                    onChange={(event) => this.setState({ questionName: event.target.value })}
                    className="question-name"
                    type="text" />
                </div>
                <div className="options-section">
                    {this.state.options.map( (option, index) => <OptionQuestion {...option} onSubmit={this.handleOptions} onRemove={this.handleRemoveOption} optionName={option} position={index} />)}
                </div>
                <div>
                    <button className="add-option" onClick={()=>this.handleAddOption()}>Add option</button>
                </div>
                <div className="bottom-question">
                    <div>
                        <h5 className="mbottom-0 mtop-10 mright-10 pull-left"> Required </h5>
                    </div>
                    <div>
                        <div className="onoffswitch-add mtop-5 pull-left">
                            <input id="switch-required"
                                   type="checkbox" name="onoffswitch" className="onoffswitch-checkbox-add"
                                   checked={this.state.isChecked}
                                   onChange={this.toggleSwitchRequired}   />
                            <label className="onoffswitch-label-add" htmlFor="switch-required">
                                <div className="onoffswitch-inner-add"></div>
                                <div className="onoffswitch-switch-add"></div>
                            </label>
                        </div>
                    </div>
                    <div>
                        <button className="add-question pull-right" onClick={()=>this.handleAddQuestion()}>Save</button>
                    </div>
                </div>
            </div>
        )
    }
}

class Radio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questionName: '',
            options: [],
            isChecked: true
        };
    };

    toggleSwitchRequired = () => {
        this.setState({
            isChecked: !this.state.isChecked,
        });
    };

    //Initialize any state when comes from edit question
    componentDidMount( ){
        //Get xml question passed as parameter
        var xmlQuestion = this.props.xml;

        if( xmlQuestion != null ){
            //Get content between two tags (title)
            var startPos = xmlQuestion.indexOf("<title>") + "<title>".length;
            var endPos = xmlQuestion.indexOf("</title>");
            var title = xmlQuestion.substring(startPos,endPos).trim();

            //Get required switch button
            var required;
            if( xmlQuestion.indexOf("mandatory=\"true\"") !== -1 ){
                required = true;
            }else{
                required = false;
            }

            //Get all options
            var startPos = xmlQuestion.indexOf("</title>") + "</title>".length;
            var endPos = xmlQuestion.indexOf("</questionModule>");
            var options = xmlQuestion.substring(startPos,endPos).trim();

            var parser = new DOMParser();
            options = '<root>' + options + '</root>';
            var xmlDoc = parser.parseFromString(options, "text/xml");

            var resultOptions = Array.prototype.map.call(
            xmlDoc.querySelectorAll('option'), function(e){
                return e.outerHTML.replace(/\t/g, '');
            });

            resultOptions.forEach(function(element, index) {
                //Get value for each option
                var startPos = element.indexOf("<option>") + "<option>".length;
                var endPos = element.indexOf("</option>");
                var option = element.substring(startPos, endPos).trim();
                resultOptions[index] = option;
            });

            //Set value states
            this.setState({
                options: resultOptions,
                questionName: title,
                isChecked: required
            });
        }
    };

    handleAddOption = () => {
        this.setState(prevState => ({
            options: prevState.options.concat("")
        }));
    };

    handleAddQuestion = () => {
        //Get options checkbox
        var emptyOption = false;
        var optionsXML = "";
        this.state.options.forEach(function(element) {
            optionsXML += "<option>"+ element +"</option>";
            //Validation
            if (element == '') {
                emptyOption = true;
                return false;
            }
        });

        //Validation
        if( this.state.questionName == '' || emptyOption || this.state.options.length < 2 ){
            if( this.state.options.length < 2 ){
                userInterface.notify('Radio Question','Please add even two options.','notice');
            }else{
                userInterface.notify('Radio Question','Please set all fields.','notice');
            }
        }else{
            //Set required question
            var xml;
            if( $('#switch-required').prop("checked") ) {
                xml = "<questionModule mandatory=\"true\" type=\"radio\"><title></title></questionModule>";
            } else {
                xml = "<questionModule type=\"radio\"><title></title></questionModule>";
            }

            xml = xml.replace(/<title>[\s\S]*?<\/title>/, '<title>' + this.state.questionName + '<\/title>');
            xml = xml.replace(/<\/title>[\s\S]*?<\/questionModule>/, '<\/title>' + optionsXML + '<\/questionModule>');

            this.props.onSubmit(xml);
            this.setState({
                questionName: '',
                options: []
            });
        }
    }

    handleOptions = (optionName, position) => {
        const options = this.state.options;
        options[position] = optionName;
        this.setState({
            options
        });
    };

    handleRemoveOption = (indexToRemove) => {
        const options = this.state.options;
        options.splice(indexToRemove, 1);

        this.setState({
            options: options
        });
    };

    render() {
        return(
            <div id="question" className="well well-white">
                <div className="col-sm-12">
                    <h3 className="pull-left"> Radio </h3>
                </div>
                <div>
                    <input
                    placeholder="Type your question name"
                    value={this.state.questionName}
                    onChange={(event) => this.setState({ questionName: event.target.value })}
                    className="question-name"
                    type="text" />
                </div>
                <div className="options-section">
                    {this.state.options.map( (option, index) => <OptionQuestion {...option} onSubmit={this.handleOptions} onRemove={this.handleRemoveOption} optionName={option} position={index} />)}
                </div>
                <div>
                    <button className="add-option" onClick={()=>this.handleAddOption()}>Add option</button>
                </div>
                <div className="bottom-question">
                    <div>
                        <h5 className="mbottom-0 mtop-10 mright-10 pull-left"> Required </h5>
                    </div>
                    <div>
                        <div className="onoffswitch-add mtop-5 pull-left">
                            <input id="switch-required"
                                   type="checkbox" name="onoffswitch" className="onoffswitch-checkbox-add"
                                   checked={this.state.isChecked}
                                   onChange={this.toggleSwitchRequired}   />
                            <label className="onoffswitch-label-add" htmlFor="switch-required">
                                <div className="onoffswitch-inner-add"></div>
                                <div className="onoffswitch-switch-add"></div>
                            </label>
                        </div>
                    </div>
                    <div>
                        <button className="add-question pull-right" onClick={()=>this.handleAddQuestion()}>Save</button>
                    </div>
                </div>
            </div>
        )
    }
}

class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            isChecked: true
        };
    };

    toggleSwitchRequired = () => {
        this.setState({
            isChecked: !this.state.isChecked,
        });
    }

    //Initialize any state when comes from edit question
    componentDidMount( ){
        //Get xml question passed as parameter
        var xmlQuestion = this.props.xml;

        if( xmlQuestion != null ){
            //Get content between two tags (title)
            var startPos = xmlQuestion.indexOf("<title>") + "<title>".length;
            var endPos = xmlQuestion.indexOf("</title>");
            var title = xmlQuestion.substring(startPos,endPos).trim();

            //Get required switch button
            var required;
            if( xmlQuestion.indexOf("mandatory=\"true\"") !== -1 ){
                required = true;
            }else{
                required = false;
            }

            //Set value states
            this.setState({
                inputValue: title,
                isChecked: required
            });
        }
    };

    handleSaveQuestion = () => {
        //Validation
        if( this.state.inputValue == '' ){
            userInterface.notify('Input Question','Please set question name.','notice');
        }else{
            //Set required question
            var xml;
            if( $('#switch-required').prop("checked") ) {
                xml = "<questionModule mandatory=\"true\" type=\"text\"><title></title></questionModule>";
            } else {
                xml = "<questionModule type=\"text\"><title></title></questionModule>";
            }

            xml = xml.replace(/<title>[\s\S]*?<\/title>/, '<title>' + this.state.inputValue + '<\/title>');
            this.props.onSubmit(xml);
            this.setState({ inputValue: '' });
        }
    };

    render() {
        return(
            <div id="question" className="well well-white">
                <div className="col-sm-12">
                    <h3 className="pull-left">Input </h3>
                </div>
                <div>
                    <input
                    placeholder="Type your question name"
                    value={this.state.inputValue}
                    onChange={(event) => this.setState({ inputValue: event.target.value })}
                    className="question-name"
                    type="text" />
                </div>
                <div className="bottom-question">
                    <div>
                        <h5 className="mbottom-0 mtop-10 mright-10 pull-left"> Required </h5>
                    </div>
                    <div>
                        <div className="onoffswitch-add mtop-5 pull-left">
                            <input id="switch-required"
                                   type="checkbox" name="onoffswitch" className="onoffswitch-checkbox-add"
                                   checked={this.state.isChecked}
                                   onChange={this.toggleSwitchRequired}   />
                            <label className="onoffswitch-label-add" htmlFor="switch-required">
                                <div className="onoffswitch-inner-add"></div>
                                <div className="onoffswitch-switch-add"></div>
                            </label>
                        </div>
                    </div>
                    <div>
                        <button className="add-question pull-right" onClick={()=>this.handleSaveQuestion()}>Save</button>
                    </div>
                </div>
            </div>
        )
    }
}

class Date extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            isChecked: true
        };
    };

    toggleSwitchRequired = () => {
        this.setState({
            isChecked: !this.state.isChecked,
        });
    };

    //Initialize any state when comes from edit question
    componentDidMount( ){
        //Get xml question passed as parameter
        var xmlQuestion = this.props.xml;

        if( xmlQuestion != null ){
            //Get content between two tags (title)
            var startPos = xmlQuestion.indexOf("<title>") + "<title>".length;
            var endPos = xmlQuestion.indexOf("</title>");
            var title = xmlQuestion.substring(startPos,endPos).trim();

            //Get required switch button
            var required;
            if( xmlQuestion.indexOf("mandatory=\"true\"") !== -1 ){
                required = true;
            }else{
                required = false;
            }

            //Set value states
            this.setState({
                inputValue: title,
                isChecked: required
            });
        }
    };

    handleSaveQuestion = () => {
        //Validation
        if( this.state.inputValue == '' ){
            userInterface.notify('Date Question','Please set question name.','notice');
        }else{
            //Set required question
            var xml;
            if( $('#switch-required').prop("checked") ) {
                xml = "<questionModule mandatory=\"true\" type=\"date\"><title></title></questionModule>";
            } else {
                xml = "<questionModule type=\"date\"><title></title></questionModule>";
            }

            xml = xml.replace(/<title>[\s\S]*?<\/title>/, '<title>' + this.state.inputValue + '<\/title>');
            this.props.onSubmit(xml);
            this.setState({ inputValue: '' });
        }
    }

    render() {
        return(
            <div id="question" className="well well-white">
                <div className="col-sm-12">
                    <h3 className="pull-left"> Date </h3>
                </div>
                <div>
                    <input
                    placeholder="Type your question name"
                    value={this.state.inputValue}
                    onChange={(event) => this.setState({ inputValue: event.target.value })}
                    className="question-name"
                    type="text" />
                </div>
                <div className="bottom-question">
                    <div>
                        <h5 className="mbottom-0 mtop-10 mright-10 pull-left"> Required </h5>
                    </div>
                    <div>
                        <div className="onoffswitch-add mtop-5 pull-left">
                            <input id="switch-required"
                                   type="checkbox" name="onoffswitch" className="onoffswitch-checkbox-add"
                                   checked={this.state.isChecked}
                                   onChange={this.toggleSwitchRequired}   />
                            <label className="onoffswitch-label-add" htmlFor="switch-required">
                                <div className="onoffswitch-inner-add"></div>
                                <div className="onoffswitch-switch-add"></div>
                            </label>
                        </div>
                    </div>
                    <div>
                        <button className="add-question pull-right" onClick={()=>this.handleSaveQuestion()}>Save</button>
                    </div>
                </div>
            </div>
        )
    }
}

class File extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            isChecked: true
        };
    };

    toggleSwitchRequired = () => {
        this.setState({
            isChecked: !this.state.isChecked,
        });
    };

    //Initialize any state when comes from edit question
    componentDidMount( ){
        //Get xml question passed as parameter
        var xmlQuestion = this.props.xml;

        if( xmlQuestion != null ){
            //Get content between two tags (title)
            var startPos = xmlQuestion.indexOf("<title>") + "<title>".length;
            var endPos = xmlQuestion.indexOf("</title>");
            var title = xmlQuestion.substring(startPos,endPos).trim();

            //Get required switch button
            var required;
            if( xmlQuestion.indexOf("mandatory=\"true\"") !== -1 ){
                required = true;
            }else{
                required = false;
            }

            //Set value states
            this.setState({
                inputValue: title,
                isChecked: required
            });
        }
    };

    handleSaveQuestion = () => {
        //Validation
        if( this.state.inputValue == '' ){
            userInterface.notify('File Question','Please set question name.','notice');
        }else{
            //Set required question
            var xml;
            if( $('#switch-required').prop("checked") ) {
                xml = "<questionModule mandatory=\"true\" type=\"file\"><title></title></questionModule>";
            } else {
                xml = "<questionModule type=\"file\"><title></title></questionModule>";
            }

            xml = xml.replace(/<title>[\s\S]*?<\/title>/, '<title>' + this.state.inputValue + '<\/title>');
            this.props.onSubmit(xml);
            this.setState({ inputValue: '' });
        }
    }

    render() {
        return(
            <div id="question" className="well well-white">
                <div className="col-sm-12">
                    <h3 className="pull-left"> File </h3>
                </div>
                <div>
                    <input
                    placeholder="Type your question name"
                    value={this.state.inputValue}
                    onChange={(event) => this.setState({ inputValue: event.target.value })}
                    className="question-name"
                    type="text" />
                </div>
                <div className="bottom-question">
                    <div>
                        <h5 className="mbottom-0 mtop-10 mright-10 pull-left"> Required </h5>
                    </div>
                    <div>
                        <div className="onoffswitch-add mtop-5 pull-left">
                            <input id="switch-required"
                                   type="checkbox" name="onoffswitch" className="onoffswitch-checkbox-add"
                                   checked={this.state.isChecked}
                                   onChange={this.toggleSwitchRequired}   />
                            <label className="onoffswitch-label-add" htmlFor="switch-required">
                                <div className="onoffswitch-inner-add"></div>
                                <div className="onoffswitch-switch-add"></div>
                            </label>
                        </div>
                    </div>
                    <div>
                        <button className="add-question pull-right" onClick={()=>this.handleSaveQuestion()}>Save</button>
                    </div>
                </div>
            </div>
        )
    }
}

class TextArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            isChecked: true
        };
    };

    toggleSwitchRequired = () => {
        this.setState({
            isChecked: !this.state.isChecked,
        });
    }

    //Initialize any state when comes from edit question
    componentDidMount( ){
        //Get xml question passed as parameter
        var xmlQuestion = this.props.xml;

        if( xmlQuestion != null ){
            //Get content between two tags (title)
            var startPos = xmlQuestion.indexOf("<title>") + "<title>".length;
            var endPos = xmlQuestion.indexOf("</title>");
            var title = xmlQuestion.substring(startPos,endPos).trim();

            //Get required switch button
            var required;
            if( xmlQuestion.indexOf("mandatory=\"true\"") !== -1 ){
                required = true;
            }else{
                required = false;
            }

            //Set value states
            this.setState({
                inputValue: title,
                isChecked: required
            });
        }
    };

    handleSaveQuestion = () => {
        //Validation
        if( this.state.inputValue == '' ){
            userInterface.notify('TextArea Question','Please set question name.','notice');
        }else{
            //Set required question
            var xml;
            if( $('#switch-required').prop("checked") ) {
                xml = "<questionModule mandatory=\"true\" type=\"textarea\"><title></title></questionModule>";
            } else {
                xml = "<questionModule type=\"textarea\"><title></title></questionModule>";
            }

            xml = xml.replace(/<title>[\s\S]*?<\/title>/, '<title>' + this.state.inputValue + '<\/title>');
            this.props.onSubmit(xml);
            this.setState({ inputValue: '' });
        }
    };

    render() {
        return(
            <div id="question" className="well well-white">
                <div className="col-sm-12">
                    <h3 className="pull-left"> Textarea </h3>
                </div>
                <div>
                    <input
                        placeholder="Type your question name"
                        value={this.state.inputValue}
                        onChange={(event) => this.setState({ inputValue: event.target.value })}
                        className="question-name"
                        type="text" />
                </div>
                <div className="bottom-question">
                    <div>
                        <h5 className="mbottom-0 mtop-10 mright-10 pull-left"> Required </h5>
                    </div>
                    <div>
                        <div className="onoffswitch-add mtop-5 pull-left">
                            <input id="switch-required"
                                   type="checkbox" name="onoffswitch" className="onoffswitch-checkbox-add"
                                   checked={this.state.isChecked}
                                   onChange={this.toggleSwitchRequired} />
                            <label className="onoffswitch-label-add" htmlFor="switch-required">
                                <div className="onoffswitch-inner-add"></div>
                                <div className="onoffswitch-switch-add"></div>
                            </label>
                        </div>
                    </div>
                    <div>
                        <button className="add-question pull-right" onClick={()=>this.handleSaveQuestion()}>Save</button>
                    </div>
                </div>
            </div>
        )
    }
}

class RadioBranch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questionName: '',
            options: [],
            isChecked: true
        };
    };

    toggleSwitchRequired = () => {
        this.setState({
            isChecked: !this.state.isChecked,
        });

        this.handleRadioBranch();
    };

    //This method is called if component receive new props
    componentWillReceiveProps( nextProps ) {
        //Get xml question passed as parameter
        let xmlQuestion = nextProps.xml;

        //Edit question
        if( xmlQuestion !== '' ){
            //Get title
            let title;
            if( xmlQuestion.indexOf("<title/>") !== -1 ){
                title = "";
            }else{
                let startPos = xmlQuestion.indexOf("<title>") + "<title>".length;
                let endPos = xmlQuestion.indexOf("</title>");
                title = xmlQuestion.substring(startPos,endPos);
            }

            //Get required switch button
            let required = false;
            if( xmlQuestion.indexOf("mandatory=\"true\"") !== -1 ){
                required = true;
            }

            //Get all options
            let parser = new DOMParser();
            xmlQuestion = '<root>' + xmlQuestion + '</root>';
            let xmlDoc = parser.parseFromString(xmlQuestion, "text/xml");

            let resultOptions = Array.prototype.map.call(
                xmlDoc.querySelectorAll('option'), function(e){
                    return e.outerHTML.replace(/\t/g, '');
                });

            resultOptions.forEach(function(element, index) {
                //Get value for each option
                if( element.indexOf("<option/>") !== -1 ){
                    resultOptions[index] = "";
                }else{
                    let startPos = element.indexOf("<option>") + "<option>".length;
                    let endPos = element.indexOf("</option>");
                    resultOptions[index] = element.substring(startPos, endPos).trim();
                }
            });

            //Set value states
            this.setState({
                options: resultOptions,
                questionName: title,
                isChecked: required
            });
        }else{
            //Pass xml recently added
            this.handleRadioBranch();
        }
    }

    //Initialize any state when comes from edit question
    componentDidMount( ){
        //Get xml question passed as parameter
        let xmlQuestion = this.props.xml;

        //Edit question
        if( xmlQuestion !== '' ){
            //Get title
            let title;
            if( xmlQuestion.indexOf("<title/>") !== -1 ){
                title = "";
            }else{
                let startPos = xmlQuestion.indexOf("<title>") + "<title>".length;
                let endPos = xmlQuestion.indexOf("</title>");
                title = xmlQuestion.substring(startPos,endPos);
            }

            //Get required switch button
            let required = false;
            if( xmlQuestion.indexOf("mandatory=\"true\"") !== -1 ){
                required = true;
            }

            //Get all options
            let parser = new DOMParser();
            xmlQuestion = '<root>' + xmlQuestion + '</root>';
            let xmlDoc = parser.parseFromString(xmlQuestion, "text/xml");

            let resultOptions = Array.prototype.map.call(
            xmlDoc.querySelectorAll('option'), function(e){
                return e.outerHTML.replace(/\t/g, '');
            });

            resultOptions.forEach(function(element, index) {
                //Get value for each option
                if( element.indexOf("<option/>") !== -1 ){
                    resultOptions[index] = "";
                }else{
                    let startPos = element.indexOf("<option>") + "<option>".length;
                    let endPos = element.indexOf("</option>");
                    resultOptions[index] = element.substring(startPos, endPos).trim();
                }
            });

            //Set value states
            this.setState({
                options: resultOptions,
                questionName: title,
                isChecked: required
            });
        }else{
            //Pass xml recently added
            this.handleRadioBranch();
        }
    };

    handleAddOption = () => {
        this.setState(prevState => ({
            options: prevState.options.concat("")
        }), () => {
            this.handleRadioBranch();
        });
    };

    handleRadioBranch () {
        //Get options checkbox
        let optionsXML = "";
        this.state.options.forEach(function(element) {
            optionsXML += "<option>"+ element +"</option>";
        });

        //Create id for each Required switch works
        const idNumberQuestion = "switch-required-textarea" + this.props.sectionNumber + "" + this.props.questionNumber;

        //Set required question
        let xmlRadio;
        if( $('#'+idNumberQuestion).prop("checked") ) {
            xmlRadio = "<questionModuleBranch mandatory=\"true\" type=\"radio\"><title>1</title></questionModuleBranch>";
        } else {
            xmlRadio = "<questionModuleBranch type=\"radio\"><title></title></questionModuleBranch>";
        }

        //Setting question name and options
        xmlRadio = xmlRadio.replace(/<title>[\s\S]*?<\/title>/, '<title>' + this.state.questionName + '<\/title>');
        xmlRadio = xmlRadio.replace(/<\/title>[\s\S]*?<\/questionModuleBranch>/, '<\/title>' + optionsXML + '<\/questionModuleBranch>');

        //Return xml with input value
        this.props.onSubmit(xmlRadio, this.props.questionNumber);

    }

    handleOptions = (optionName, position) => {
        const options = this.state.options;
        options[position] = optionName;
        this.setState({
            options
        });

        //Send changes to parent component
        this.handleRadioBranch();
    };

    handleRemoveOption = (indexToRemove) => {
        const options = this.state.options;
        options.splice(indexToRemove, 1);

        this.setState({
            options: options
        });

        //Send changes to parent component
        this.handleRadioBranch();
    };

    handleRemoveQuestion(){
        //Remove question clicked
        this.props.onRemoveQuestion(this.props.questionNumber);
    };

    render() {
        //Create id for each Required switch works
        const idNumberQuestion = "switch-required-textarea" + this.props.sectionNumber + "" + this.props.questionNumber;

        return(
            <div id="question" className="col-sm-11 well well-white">
                <div className="row">
                    <div className="pull-left mleft-40">
                        <h3 className="mtop-10">Radio</h3>
                    </div>
                    <div className="pull-right mright-25">
                        <label type="button" className="btn btn-default pull-right ion-trash-branch" onClick={()=>this.handleRemoveQuestion()} >
                            <span className="ion-trash-b"/>
                        </label>
                    </div>
                </div>
                <div className="row">
                    <div>
                        <input
                            placeholder="Type your question name"
                            value={this.state.questionName}
                            onChange = {(event) => this.setState({ questionName: event.target.value}, this.handleRadioBranch)}
                            className="question-name"
                            type="text" />
                    </div>
                    <div className="options-section">
                    {
                        this.state.options.map( (option, index) => <OptionQuestion {...option}  onSubmit={this.handleOptions}
                                                                                                onRemove={this.handleRemoveOption}
                                                                                                optionName={option}
                                                                                                position={index} />)
                    }
                    </div>
                    <div>
                        <button className="add-option" onClick={()=>this.handleAddOption()}>Add option</button>
                    </div>
                </div>
                <div className="pull-right mtop-20">
                    <div className="pull-left">
                        <h5 className="mbottom-0 mtop-10 mright-10 pull-right"> Required </h5>
                    </div>
                    <div className="pull-right">
                        <div className="onoffswitch-add mtop-5 pull-right">
                            <input id={idNumberQuestion}
                                   type="checkbox" name="onoffswitch" className="onoffswitch-checkbox-add"
                                   checked={this.state.isChecked}
                                   onChange={this.toggleSwitchRequired} />
                            <label className="onoffswitch-label-add" htmlFor={idNumberQuestion}>
                                <div className="onoffswitch-inner-add"></div>
                                <div className="onoffswitch-switch-add"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class TextAreaBranch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            isChecked: true
        };
    };

    toggleSwitchRequired = () => {
        this.setState({
            isChecked: !this.state.isChecked,
        });

        this.handleTextAreaBranch();
    };

    //This method is called if component receive new props
    componentWillReceiveProps( nextProps ) {
        //Get xml question passed as parameter
        let xmlQuestion = nextProps.xml;

        //Edit question
        if( xmlQuestion !== '' ){
            //Get title
            let title;
            if( xmlQuestion.indexOf("<title/>") !== -1 ){
                title = "";
            }else{
                let startPos = xmlQuestion.indexOf("<title>") + "<title>".length;
                let endPos = xmlQuestion.indexOf("</title>");
                title = xmlQuestion.substring(startPos,endPos);
            }

            //Get required switch button
            let required = false;
            if( xmlQuestion.indexOf("mandatory=\"true\"") !== -1 ){
                required = true;
            }

            //Set value states
            this.setState({
                inputValue: title,
                isChecked: required
            });
        }else{
            //Pass xml recently added
            this.handleTextAreaBranch();
        }
    }

    //Initialize any state when comes from edit question
    componentDidMount( ){
        //Get xml question passed as parameter
        let xmlQuestion = this.props.xml;

        //Edit question
        if( xmlQuestion !== '' ){
            //Get title
            let title;
            if( xmlQuestion.indexOf("<title/>") !== -1 ){
                title = "";
            }else{
                let startPos = xmlQuestion.indexOf("<title>") + "<title>".length;
                let endPos = xmlQuestion.indexOf("</title>");
                title = xmlQuestion.substring(startPos,endPos);
            }

            //Get required switch button
            let required = false;
            if( xmlQuestion.indexOf("mandatory=\"true\"") !== -1 ){
                required = true;
            }

            //Set value states
            this.setState({
                inputValue: title,
                isChecked: required
            });
        }else{
            //Pass xml recently added
            this.handleTextAreaBranch();
        }
    };

    //React lifecycle method: pass in real time the input content to parent component
    handleTextAreaBranch() {
        //Create id for each Required switch works
        const idNumberQuestion = "switch-required-textarea" + this.props.sectionNumber + "" + this.props.questionNumber;

        //Get required option
        let xmlTextArea;
        if( $('#'+idNumberQuestion).prop("checked") ) {
            xmlTextArea = "<questionModuleBranch mandatory=\"true\" type=\"textarea\"><title></title></questionModuleBranch>";
        } else {
            xmlTextArea = "<questionModuleBranch type=\"textarea\"><title></title></questionModuleBranch>";
        }

        //Set value between two tags
        xmlTextArea = xmlTextArea.replace(/<title>[\s\S]*?<\/title>/, '<title>' + this.state.inputValue + '<\/title>');

        //Return xml with input value
        this.props.onSubmit(xmlTextArea, this.props.questionNumber);
    };

    handleRemoveQuestion(){
        //Remove question clicked
        this.props.onRemoveQuestion(this.props.questionNumber);
    };

    render() {
        //Create id for each Required switch works
        const idNumberQuestion = "switch-required-textarea" + this.props.sectionNumber + "" + this.props.questionNumber;

        return(
            <div id="question" className="col-sm-11 well well-white">
                <div className="row">
                    <div className="pull-left mleft-40">
                        <h3 className="mtop-10">Textarea </h3>
                    </div>
                    <div className="pull-right mright-25">
                        <label type="button" className="btn btn-default pull-right ion-trash-branch" onClick={()=>this.handleRemoveQuestion()} >
                            <span className="ion-trash-b"/>
                        </label>
                    </div>
                </div>
                <div className="row">
                    <input
                        placeholder="Type your question name"
                        value={this.state.inputValue}
                        onChange = {(event) => this.setState({ inputValue: event.target.value}, this.handleTextAreaBranch)}
                        className="question-name"
                        type="text" />
                </div>
                <div className="pull-right mtop-20">
                    <div className="pull-left">
                        <h5 className="mbottom-0 mtop-10 mright-10 pull-right"> Required </h5>
                    </div>
                    <div className="pull-right">
                        <div className="onoffswitch-add mtop-5 pull-right">
                            <input id={idNumberQuestion}
                                   type="checkbox" name="onoffswitch" className="onoffswitch-checkbox-add"
                                   checked={this.state.isChecked}
                                   onChange={this.toggleSwitchRequired} />
                            <label className="onoffswitch-label-add" htmlFor={idNumberQuestion}>
                                <div className="onoffswitch-inner-add"></div>
                                <div className="onoffswitch-switch-add"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class SectionBranch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            branchTitle: '',
            branchDescription: '',
            questions: [],
            questionsXml: []
        };
    };

    //This method is called if component receive new props
    componentWillReceiveProps( nextProps ){
        //Get xml
        let xmlSection = nextProps.xml;
        //When is from edit the variable xml is empty
        if( xmlSection !== "" ){
            //Get title of section
            let branchSectionTitle = nextProps.xml.match( /<branchTitle[^>]*>([\s\S]*?)<\/branchTitle>/i )[1];

            //The only field that can be empty. If goes empty, the tag causes problems when is it used with DOMParser()
            let branchSectionDescription;
            if( xmlSection.match( /<branchDescription[^>]*>([\s\S]*?)<\/branchDescription>/i )[1] === ' ' ){
                branchSectionDescription = '';
            }else{
                branchSectionDescription = xmlSection.match( /<branchDescription[^>]*>([\s\S]*?)<\/branchDescription>/i )[1];
            }

            //Get each question in the section Branch
            let parser = new DOMParser();
            xmlSection = '<root>' + xmlSection + '</root>';
            let xmlDoc = parser.parseFromString(xmlSection, "text/xml");

            let questionsBranchArrayXML = Array.prototype.map.call(
                xmlDoc.querySelectorAll('questionModuleBranch'), function(e){
                    return e.outerHTML.replace(/\t/g, '')
                });

            //Set type component in the array
            let questionsBranchArray = [];
            questionsBranchArrayXML.forEach(function(element, index) {
                if( element.indexOf("type=\"textarea\"") !== -1 ){
                    questionsBranchArray[index] = TextAreaBranch;
                }else{
                    questionsBranchArray[index] = RadioBranch;
                }
            });

            //Set value states
            this.setState({
                branchTitle: branchSectionTitle,
                branchDescription: branchSectionDescription,
                questions: questionsBranchArray,
                questionsXml: questionsBranchArrayXML
            });
        }else{
            //Send XML section structure to Branch question
            this.handleInfoSection();
        }
    }

    //This method is called once after your component is rendered
    componentDidMount( ){
        //Edit question. Get xml question passed as parameter
        let xmlSection = this.props.xml;
        //When is from edit the variable xml is empty
        if( xmlSection !== "" ){
            //Get title of section
            let branchSectionTitle = xmlSection.match( /<branchTitle[^>]*>([\s\S]*?)<\/branchTitle>/i )[1];

            //The only field that can be empty. If goes empty, the tag causes problems when is it used with DOMParser()
            let branchSectionDescription;
            if( xmlSection.match( /<branchDescription[^>]*>([\s\S]*?)<\/branchDescription>/i )[1] === ' ' ){
                branchSectionDescription = '';
            }else{
                branchSectionDescription = xmlSection.match( /<branchDescription[^>]*>([\s\S]*?)<\/branchDescription>/i )[1];
            }

            //Get each question in the section Branch
            let parser = new DOMParser();
            xmlSection = '<root>' + xmlSection + '</root>';
            let xmlDoc = parser.parseFromString(xmlSection, "text/xml");

            let questionsBranchArrayXML = Array.prototype.map.call(
            xmlDoc.querySelectorAll('questionModuleBranch'), function(e){
                return e.outerHTML.replace(/\t/g, '')
            });

            //Set type component in the array
            let questionsBranchArray = [];
            questionsBranchArrayXML.forEach(function(element, index) {
                if( element.indexOf("type=\"textarea\"") !== -1 ){
                    questionsBranchArray[index] = TextAreaBranch;
                }else{
                    questionsBranchArray[index] = RadioBranch;
                }
            });

            //Set value states
            this.setState({
                branchTitle: branchSectionTitle,
                branchDescription: branchSectionDescription,
                questions: questionsBranchArray,
                questionsXml: questionsBranchArrayXML
            });
        }else{
            //Send XML section structure to Branch question
            this.handleInfoSection();
        }
    };

    handleAddQuestion = (nameComponent) => {
        //Shows element survey clicked
        const questions = this.state.questions;
        questions[questions.length] = nameComponent;
        this.setState({
            questions
        });

        this.setState(prevState => ({
            questionsXml: prevState.questionsXml.concat("")
        }));
    };

    //This method is called when info or questions are updated
    handleQuestions = (xml, position) => {
        let xmlSection = "<sectionBranch><branchInfo><branchTitle></branchTitle><branchDescription></branchDescription></branchInfo></sectionBranch>";

        let questionsArray = this.state.questionsXml;
        if( xml != null ){
            questionsArray[position] = xml;
        }

        //Iterate array to build complete questions in the section
        let questions = "";
        questionsArray.forEach(function(element) {
            questions += element;
        });

        //Set value between two tags
        xmlSection = xmlSection.replace(/<branchTitle>[\s\S]*?<\/branchTitle>/, '<branchTitle>' + this.state.branchTitle + '<\/branchTitle>');
        //The only field that can be empty. If goes empty, the tag causes problems when is it used with DOMParser()
        if( this.state.branchDescription === '' ){
            xmlSection = xmlSection.replace(/<branchDescription>[\s\S]*?<\/branchDescription>/, '<branchDescription>' + ' ' + '<\/branchDescription>');
        }else{
            xmlSection = xmlSection.replace(/<branchDescription>[\s\S]*?<\/branchDescription>/, '<branchDescription>' + this.state.branchDescription + '<\/branchDescription>');
        }
        xmlSection = xmlSection.replace(/<\/branchInfo>[\s\S]*?<\/sectionBranch>/, '<\/branchInfo>' + questions + '<\/sectionBranch>');

        //Return xml section
        this.props.onSubmit(xmlSection, this.props.sectionNumber);
    };

    handleRemoveQuestion = (idRemoveQuestion) => {
        const questions = this.state.questions;
        const questionsXml = this.state.questionsXml;

        questions.splice(idRemoveQuestion, 1);
        questionsXml.splice(idRemoveQuestion, 1);

        this.setState(({
            questions,
            questionsXml
        }), () => {
            this.handleQuestions();
        });
    };

    //This method is called when is a new section to send the structure
    handleInfoSection(){
        let xmlSection = "<sectionBranch><branchInfo><branchTitle></branchTitle><branchDescription></branchDescription></branchInfo></sectionBranch>";

        //Return xml section
        this.props.onSubmit(xmlSection, this.props.sectionNumber);
    }

    removeSection = () => {
        //Remove the section
        this.props.onRemoveSection(this.props.sectionNumber);
    };

    renderAddSectionBtn = () => {
        if( this.props.numberOfSections > 1 ){
            return(
                <button className="btn btn-default uppercase text-bold pull-right" onClick={()=>this.removeSection()}>
                    <h6 className="add-branch-section uppercase">Remove Section</h6>
                </button>
            )
        }
    };

    render(){
        //Create id for section (Pagination)
        const idSection = "sectionPage" + this.props.sectionNumber;

        //Generate components (Radio and Textarea)
        const questionsPerSection = this.state.questions.map((Elem, index) => {
            return <Elem onSubmit={this.handleQuestions} onRemoveQuestion={this.handleRemoveQuestion} questionNumber={index} sectionNumber={this.props.sectionNumber} xml={this.state.questionsXml[index]} />
        });

        return(
            <div id={idSection} className="section">
                <div className="well well-white">
                    <div className="col-sm-12 mbottom-10">
                        <h3 className="pull-left">Section {this.props.sectionNumber + 1} </h3>
                        {
                            this.renderAddSectionBtn()
                        }
                    </div>
                    <div className="col-sm-12">
                        <div className="col-sm-6">
                            <h5 className="section-branch-title pull-left"> Section Title </h5>
                            <input
                                value={this.state.branchTitle}
                                onChange = {(event) => this.setState({ branchTitle: event.target.value}, () => {this.handleQuestions()})}
                                className="input-info-branch"
                                type="text" />
                        </div>
                        <div className="pull-right col-sm-6">
                            <h5 className="section-branch-description pull-left"> Section Description </h5>
                            <input
                                value={this.state.branchDescription}
                                onChange = {(event) => this.setState({ branchDescription: event.target.value}, () => {this.handleQuestions()})}
                                className="input-info-branch"
                                type="text" />
                        </div>
                    </div>
                    <div>
                        {questionsPerSection}
                    </div>
                    <div className="mbottom-10">
                        <button className="btn-add-question-branch mtop-20" onClick={()=>this.handleAddQuestion(RadioBranch)}>Add Radio</button>
                        <button className="btn-add-question-branch mtop-20 mleft-20" onClick={()=>this.handleAddQuestion(TextAreaBranch)}>Add TextArea</button>
                    </div>
                </div>
            </div>
        )
    }
}

class Branch extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            inputValue: '',
            isChecked: true,
            currentPage: 0,
            sections: [],
            sectionsXml: []
        };
    };

    toggleSwitchRequired = () => {
        this.setState({
            isChecked: !this.state.isChecked,
        });
    };

    //This method is executed after render component
    componentDidUpdate(){
        //Update Pagination for sections
        let surveyUtil = SurveyEngine.commons.surveyUtil;
        surveyUtil.paginationForSectionBranch(this.state.currentPage);
    }

    //Initialize any state when comes from edit question
    componentDidMount( ){
        //Edit question. Get xml question passed as parameter
        let xmlQuestion = this.props.xml;

        if( xmlQuestion != null ){
            //Get title of section
            let branchTitle = xmlQuestion.match( /<title[^>]*>([\s\S]*?)<\/title>/i )[1];

            //Get required switch button
            let required = false;
            //Mandatory could be several times, this required could be in the first 35 characters
            if( xmlQuestion.substring(0,35).indexOf("mandatory=\"true\"") !== -1 ){
                required = true;
            }

            //Get each section Branch
            let parser = new DOMParser();
            xmlQuestion = '<root>' + xmlQuestion + '</root>';
            let xmlDoc = parser.parseFromString(xmlQuestion, "text/xml");

            let sectionBranchArrayXML = Array.prototype.map.call(
            xmlDoc.querySelectorAll('sectionBranch'), function(e){
                return e.outerHTML.replace(/\t/g, '')
            });

            //Set the previous values in this component
            let sectionsBranchArray = [];
            sectionBranchArrayXML.forEach(function(element, index) {
                sectionsBranchArray[index] = SectionBranch;
            });

            //Set value states
            this.setState({
                inputValue: branchTitle,
                isChecked: required,
                sections: sectionsBranchArray,
                sectionsXml: sectionBranchArrayXML
            });
        }else{
            const sections = this.state.sections;
            sections[0] = SectionBranch;
            this.setState({
                sections
            });

            this.setState(prevState => ({
                sectionsXml: prevState.sectionsXml.concat("")
            }));
        }
    };

    handleAddBranchSection(nameComponent){
        //Add new section
        const sections = this.state.sections;
        sections.splice(this.state.currentPage + 1, 0, nameComponent);

        const sectionsXml = this.state.sectionsXml;
        sectionsXml.splice(this.state.currentPage + 1, 0, "");

        this.setState({
            sections,
            sectionsXml,
            currentPage: this.state.currentPage + 1
        });
    };

    handleSaveQuestion = () => {
        //Variables used in this function
        let parser = new DOMParser();
        let xmlDoc;
        let validation = true;
        let startPos;
        let endPos;

        //Validation (title for Branch question, title question for each question in section and options in Radio question)
        if( this.state.inputValue === '' ){
            //Title for Branch question
            userInterface.notify('Branch Question', 'Please set question title.','notice');
            validation = false;
        }else{
            //Get array with each sectionBranch
            let sectionsBranchArray = this.state.sectionsXml;

            //Validate Branch question contains at least two sections
            if( sectionsBranchArray.length < 2 ){
                userInterface.notify('Branch Question', 'Please add at least two sections.', 'notice');
                validation = false;
            }else{
                //Iterate each SectionBranch to find questionModuleBranch type Radio (validate title and options)
                sectionsBranchArray.forEach(function(elementSection, indexSection) {
                    if(validation === false){
                        return;
                    }

                    //Get title of section
                    let titleSectionBranch = elementSection.match( /<branchTitle[^>]*>([\s\S]*?)<\/branchTitle>/i )[1];

                    //Validate section contains a Title
                    if ( titleSectionBranch == '' ){
                        userInterface.notify('Branch Question', 'Please set a title in section '+ (indexSection+1)+ '.', 'notice');
                        validation = false;
                    }else{
                        //Parser DOM XML string to get each questionModuleBranch
                        let sectionBranchXML = elementSection.match( /<\/branchInfo[^>]*>([\s\S]*?)<\/sectionBranch>/i )[1];
                        sectionBranchXML = '<root>' + sectionBranchXML + '</root>';
                        xmlDoc = parser.parseFromString(sectionBranchXML, "text/xml");

                        let questionModuleBranchArray = Array.prototype.map.call(
                        xmlDoc.querySelectorAll('questionModuleBranch'), function(e){
                            return e.outerHTML.replace(/\t/g, '')
                        });

                        //Iterate all questionModuleBranch per sectionBranch
                        questionModuleBranchArray.forEach(function (elementQuestion, indexQuestion) {
                            if(validation === false){
                                return;
                            }

                            //Radio question
                            if( elementQuestion.indexOf("type=\"radio\"") !== -1 ){
                                //Validate title of Radio question
                                if( elementQuestion.indexOf("<title/>") !== -1 ){
                                    userInterface.notify('Branch Question', 'Please set a title in Radio: Section '+ (indexSection+1) +', Question '+ (indexQuestion+1)+ '.', 'notice');
                                    validation = false;
                                }else{
                                    //Validate optiones Radio question
                                    //Parser DOM XML string to get each option Radio question
                                    elementQuestion = '<root>' + elementQuestion + '</root>';
                                    xmlDoc = parser.parseFromString(elementQuestion, "text/xml");

                                    let optionsRadioBranchArray = Array.prototype.map.call(
                                        xmlDoc.querySelectorAll('option'), function(e){
                                            return e.outerHTML.replace(/\t/g, '')
                                        });

                                    if( optionsRadioBranchArray.length < 2 ){
                                        userInterface.notify('Branch Question', 'Please add at least two options in Radio: Section '+ (indexSection+1) +', Question '+ (indexQuestion+1) + '.', 'notice');
                                        validation = false;
                                    }else{
                                        //Checks if any option is empty
                                        if ( elementQuestion.indexOf("<option/>") !== -1 ) {
                                            userInterface.notify('Branch Question', 'Please set all fields Radio: Section '+ (indexSection+1) +', Question '+ (indexQuestion+1)+ '.', 'notice');
                                            validation = false;
                                        }

                                    }
                                }
                            }else{
                                //Textarea question
                                //Validate title of Textarea question
                                if( elementQuestion.indexOf("<title/>") !== -1 ){
                                    userInterface.notify('Branch Question', 'Please set a title in Textarea: Section '+ (indexSection+1) +', Question '+ (indexQuestion+1)+ '.', 'notice');
                                    validation = false;
                                }
                            }//end if radio and text area validation
                        });//end foreach questionModuleBranch
                    }//end if validate section contains a Title
                });//end foreach sectionBranch
            }//end if validate two sections
        }//end if validation branch

        //If all validations passed
        if( validation ){
            //Set required Branch question
            let xml;
            if( $('#switch-required-branch').prop("checked") ) {
                xml = "<questionModule mandatory=\"true\" type=\"branch\"><title></title></questionModule>";
            } else {
                xml = "<questionModule type=\"branch\"><title></title></questionModule>";
            }

            //Iterate array to build complete sections in the branch
            let sectionsXml = "";
            this.state.sectionsXml.forEach(function(element, index) {
                sectionsXml += element;
            });

            //Set values into xml branch
            xml = xml.replace(/<title>[\s\S]*?<\/title>/, '<title>' + this.state.inputValue + '<\/title>');
            xml = xml.replace(/<\/title>[\s\S]*?<\/questionModule>/, '<\/title>' + sectionsXml + '<\/questionModule>');

            //Send complete Branch question XML
            this.props.onSubmit(xml);
            this.setState({ inputValue: '' });
        }
    };

    handleSection = (xml, sectionNumber) => {
        let sectionsXml = this.state.sectionsXml;
        sectionsXml[sectionNumber] = xml;
        this.setState({
            sectionsXml
        });
    };

    handleRemoveSection = (idRemoveSection) => {
        const sections = this.state.sections;
        const sectionsXml = this.state.sectionsXml;

        sections.splice(idRemoveSection, 1);
        sectionsXml.splice(idRemoveSection, 1);

        let newCurrentPage;
        if(idRemoveSection === 0){
            newCurrentPage = 0;
        }else{
            newCurrentPage = idRemoveSection - 1;
        }

        this.setState({
            sections: sections,
            sectionsXml: sectionsXml,
            currentPage: newCurrentPage
        });
    };

    handleCurrentSection = (indexSection) => {
        this.setState({
            currentPage: indexSection
        });
    };

    render() {
        return(
            <div id="question" className="well well-white">
                <div className="branch-question-header row">
                    <h3 className="pull-left">Branch Question</h3>
                    <button className="btn btn-default uppercase text-bold pull-right" onClick={()=>this.handleAddBranchSection(SectionBranch)}>
                        <h6 className="add-branch-section">ADD SECTION</h6>
                    </button>
                </div>
                <div className="row">
                    <div className="pull-left">
                        <h5 className="title-branch">Question Title</h5>
                    </div>
                    <div className="pull-left">
                        <input
                        value={this.state.inputValue}
                        onChange={(event) => this.setState({ inputValue: event.target.value })}
                        className="input-title-branch"
                        type="text" />
                    </div>
                </div>
                <div className="branch-section">
                {
                    this.state.sections.map((option, index) =>
                    <SectionBranch {...option}  onSubmit={this.handleSection}
                                                onRemoveSection={this.handleRemoveSection}
                                                optionName={option}
                                                sectionNumber={index}
                                                xml={this.state.sectionsXml[index]}
                                                numberOfSections={this.state.sections.length} />)
                }
                </div>
                <div>
                    <div id="pages-nav-branch" className="col-xs-12 text-center">
                        <ul className="pagination pagination-section pagination-sm">
                        {
                            this.state.sectionsXml.map((elementSection, indexSection) => {
                                return <li><a id={"_sectionPage"+ indexSection} onClick={()=>this.handleCurrentSection(indexSection)} className="section" href={"#sectionPage"+indexSection}>{indexSection+1}</a></li>;
                            })
                        }
                        </ul>
                    </div>
                </div>
                <div className="bottom-question mtop-30">
                    <div>
                        <h5 className="mbottom-0 mtop-10 mright-10 pull-left"> Required </h5>
                    </div>
                    <div>
                        <div className="onoffswitch-add mtop-5 pull-left">
                            <input id="switch-required-branch"
                                   type="checkbox" name="onoffswitch" className="onoffswitch-checkbox-add"
                                   checked={this.state.isChecked}
                                   onChange={this.toggleSwitchRequired} />
                            <label className="onoffswitch-label-add" htmlFor="switch-required-branch">
                                <div className="onoffswitch-inner-add"></div>
                                <div className="onoffswitch-switch-add"></div>
                            </label>
                        </div>
                    </div>
                    <div>
                        <button className="add-question pull-right" onClick={()=>this.handleSaveQuestion()}>Save</button>
                    </div>
                </div>
            </div>
        )
    }
}


class EditQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            typeQuestion: '',
            xmlQuestion: '',
            indexToEdit: 0,
            questions: []
        };
    };

    componentDidMount( ){
        //Variables used in this function
        let parser = new DOMParser();
        let xmlDoc;

        //Get position to edit, attribute previously added in appropriate question
        let indexToEdit = document.getElementById("edit-question").getAttribute('index-edit');

        //Get current xml
        let xml = $('#code').val();

        //Create array with all sections in the xml
        let pagesXML = xml.match( /<\/surveyInfo[^>]*>([\s\S]*?)<\/survey>/i )[1];

        //Parser DOM XML string to get each section
        pagesXML = '<root>' + pagesXML + '</root>';
        xmlDoc = parser.parseFromString(pagesXML, "text/xml");

        let pagesArray = Array.prototype.map.call(
        xmlDoc.querySelectorAll('page'), function(e){
            return e.outerHTML.replace(/\t/g, '')
        });

        //Get page number to render
        let idPage = document.getElementById("page-survey-component").getAttribute('id-page');

        //Get specific section to render Page Information
        let pageXml = pagesArray[idPage - 1];

        //Get questions section xml
        let xmlQuestions = pageXml.match( /<\/pageInfo[^>]*>([\s\S]*?)<\/page>/i )[1];

        //Parser DOM XML string to get each questionModule
        xmlQuestions = '<root>' + xmlQuestions + '</root>';
        xmlDoc = parser.parseFromString(xmlQuestions,"text/xml");

        let questionsArray = Array.prototype.map.call(
        xmlDoc.querySelectorAll('questionModule'), function(e){
            return e.outerHTML.replace(/\t/g, '')
        });

        //Getting type question
        xmlDoc = parser.parseFromString(questionsArray[indexToEdit - 1], "text/xml");
        let type = xmlDoc.getElementsByTagName("questionModule")[0].getAttribute("type");

        this.setState({
            typeQuestion: type,
            xmlQuestion: questionsArray[indexToEdit - 1 ],
            indexToEdit: indexToEdit,
            questions: questionsArray
        });
    };

    handleSaveQuestion = (xmlToSave) => {
        //Variables used in this function
        let parser = new DOMParser();
        let xmlDoc;

        //Replace the question edited
        let result = this.state.questions;
        result.splice(this.state.indexToEdit - 1, 1, xmlToSave);

        //Iterate to build complete questions xml string
        let questions = "";
        result.forEach(function(element) {
            questions += element;
        });

        //Get current xml
        let xml = $('#code').val();

        //Create array with all sections in the xml
        let pagesXML = xml.match( /<\/surveyInfo[^>]*>([\s\S]*?)<\/survey>/i )[1];

        //Parser DOM XML string to get each section
        pagesXML = '<root>' + pagesXML + '</root>';
        xmlDoc = parser.parseFromString(pagesXML, "text/xml");

        let pagesArray = Array.prototype.map.call(
        xmlDoc.querySelectorAll('page'), function(e){
            return e.outerHTML.replace(/\t/g, '')
        });

        //Get page number to render
        let idPage = document.getElementById("page-survey-component").getAttribute('id-page');

        //Get specific section to render Page Information
        let pageXml = pagesArray[idPage - 1];

        //Set value between two tags
        pageXml = pageXml.replace(/<\/pageInfo>[\s\S]*?<\/page>/, '<\/pageInfo>' + questions + '<\/page>');

        //Replace the section
        pagesArray[idPage - 1] = pageXml;

        //Iterate to build complete section xml string
        let pages = "";
        pagesArray.forEach(function(element) {
            pages += element;
        });

        //Replace the new section page
        xml = xml.replace(/<\/surveyInfo>[\s\S]*?<\/survey>/, '</surveyInfo>' + pages + '<\/survey>');

        //Set xml generated to code variable
        $("#code").val( xml );

        //Call render for all Survey elements
        let surveyUtil = SurveyEngine.commons.surveyUtil;
        surveyUtil.render(idPage, xml, "surveyEdit", "preview");

        //Unmounting component
        ReactDOM.unmountComponentAtNode(document.getElementById('edit-question'));

        $("#edit-question").remove();
        $("#EditQuestionModal").modal('hide');
    };

    render() {
        if( this.state.typeQuestion === 'text' ){
            return <Input onSubmit={this.handleSaveQuestion} xml={this.state.xmlQuestion} />
        } else if ( this.state.typeQuestion === 'checkbox' ){
            return <Checkbox onSubmit={this.handleSaveQuestion} xml={this.state.xmlQuestion} />
        } else if ( this.state.typeQuestion === 'select' ){
            return <Select onSubmit={this.handleSaveQuestion} xml={this.state.xmlQuestion} />
        } else if ( this.state.typeQuestion === 'date' ){
            return <Date onSubmit={this.handleSaveQuestion} xml={this.state.xmlQuestion} />
        } else if ( this.state.typeQuestion === 'file' ){
            return <File onSubmit={this.handleSaveQuestion} xml={this.state.xmlQuestion} />
        } else if ( this.state.typeQuestion === 'radio' ){
            return <Radio onSubmit={this.handleSaveQuestion} xml={this.state.xmlQuestion} />
        } else if ( this.state.typeQuestion === 'textarea' ){
            return <TextArea onSubmit={this.handleSaveQuestion} xml={this.state.xmlQuestion} />
        } else if ( this.state.typeQuestion === 'branch' ){
            return <Branch onSubmit={this.handleSaveQuestion} xml={this.state.xmlQuestion} />
        }
        return(<div><h3> No Edit Component </h3></div>)
    }
}

class App extends React.Component {

    addXMLElement = (xmlToAdd) => {
        //Getting current questions
        let xml = $('#code').val();

        //Create array with all sections in the xml
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

        startPos = pageXml.indexOf("</pageInfo>") + "</pageInfo>".length;
        endPos = pageXml.indexOf("</page>");
        let xmlQuestions = pageXml.substring(startPos,endPos).trim();

        //Parser DOM XML string to get each questionModule
        parser = new DOMParser();
        xmlQuestions = '<root>' + xmlQuestions + '</root>';
        xmlDoc = parser.parseFromString(xmlQuestions,"text/xml");

        let result = Array.prototype.map.call(
        xmlDoc.querySelectorAll('questionModule'), function(e){
            return e.outerHTML.replace(/\t/g, '');
        });

        //Insert xml in specific index
        let indexToInsert = document.getElementById("root").getAttribute('index-insert');
        result.slice(0);
        result.splice(indexToInsert, 0, xmlToAdd);

        //Iterate to build complete questions xml string
        let questions = "";
        result.forEach(function(element) {
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

        //Replace the new section page
        xml = xml.replace(/<\/surveyInfo>[\s\S]*?<\/survey>/, '</surveyInfo>' + pages + '<\/survey>');

        //Set xml generated to code variable
        $("#code").val( xml );

        //Call render for all Survey elements
        const surveyUtil = SurveyEngine.commons.surveyUtil;
        surveyUtil.render(idPage, xml, "surveyEdit", "preview");

        //Set id to scroll
        //$("html, body").animate({ scrollTop: $("#myID").scrollTop() }, 1000);
        $("#AddQuestionModal").modal('hide');
    };

    render(){
        return (
            <div>
                <Form onSubmit={this.addXMLElement} />
            </div>
        );
    }
}


ReactDOM.render(<App />, document.getElementById('root'));