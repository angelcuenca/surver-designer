
class Timeline extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dateAppear:'date date-appear',
            sendSurvey: '',
            preReport: '',
            expiration: '',
            finalReport: ''
        };
    };

    componentDidMount() {
        let request = new XMLHttpRequest();
        request.open("GET", "/get/timeline");
        request.send();
        request.onload = function () {
            if(request.status === 200){
                let response = JSON.parse(request.responseText);
                this.setState({
                    dateAppear: 'date date-appear-active',
                    sendSurvey: response.sendSurvey,
                    preReport: response.preReport,
                    expiration: response.expiration,
                    finalReport: response.finalReport
                });
            }
        }.bind(this)
    };

    render(){
        return(
            <div>
                <div className="row">
                    <div className="col-md-4 col-md-offset-2 "></div>
                </div>
                <section className="timeline">
                    <div className="container">

                        <div className="timeline-item mtop-20" id="send-survey">

                            <div className="timeline-img"></div>

                            <div className="timeline-content fadeInLeft">
                                <h4>Send Survey</h4>
                                <div className={this.state.dateAppear}>{this.state.sendSurvey}</div>
                                <blockquote>Survey response (mail link to provide customer rating) is sent to contacts on the 1st day after the fiscal month end (Sunday).</blockquote>
                            </div>
                        </div>

                        <div className="timeline-item" id="pre-report">

                            <div className="timeline-img"></div>

                            <div className="timeline-content fadeInLeft">
                                <div className={this.state.dateAppear}>{this.state.preReport}</div>
                                <h4>Pre-Report</h4>
                                <blockquote>This report is sent to contacts on the 5th day after fiscal month end (Thursday).</blockquote>
                            </div>
                        </div>

                        <div className="timeline-item" id="expiration">

                            <div className="timeline-img"></div>

                            <div className="timeline-content fadeInRight">
                                <h4>Survey Expiration</h4>
                                <div className={this.state.dateAppear}>{this.state.expiration}</div>
                                <blockquote>The survey will expire on the 6th day after the fiscal month end (Friday).</blockquote>
                            </div>
                        </div>

                        <div className="timeline-item" id="final-report">

                            <div className="timeline-img"></div>

                            <div className="timeline-content fadeInLeft">
                                <div className={this.state.dateAppear}>{this.state.finalReport}</div>
                                <h4>Final Report</h4>
                                <blockquote>This report is sent to contacts on the 8th day after the fiscal month end (Sunday).</blockquote>
                            </div>
                        </div>

                    </div>
                </section>
            </div>
        );
    }
}

ReactDOM.render(<Timeline/>, document.getElementById('timeline'));