/*
    User Interface created with ReactJS to resend emails from Home view
    Date:           Winter 2017
    Created by:     Angel Cuenca
*/

'use strict';

const userInterface = SurveyEngine.commons.userInterface;

class ReSendModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            dataContacts: [],
            contactSelected: '',
            contactEmail: ''
        };
    };

    //Method executed after Render
    componentDidMount( ) {
        let request = new XMLHttpRequest();
        let role;
        if( this.props.titleModal === 'Resend Survey' || this.props.titleModal === 'Edit Survey' ){
            role = '?role=ROLE_TAKER';
        }else if( this.props.titleModal === 'Final Report' ){
            role = '?role=ROLE_OTHER_REPORTEE';
        }else if( this.props.titleModal === 'Executive Final Report' ){
            role = '?role=ROLE_EXECUTIVE';
        }

        let url = `${'/admin/get/users-by-role'}${role}`;
        request.open("GET", url, true);
        request.send();
        request.onload = function() {
            if (request.status === 200) {
                let response = JSON.parse(request.responseText);
                //let responseInfo = JSON.stringify(response);

                this.setState({
                    dataContacts: response.dataUsers,
                    loading: false
                });
            }
        }.bind(this);
        return{loading: true}
    }

    handleReSend = () => {

        if( this.state.contactEmail !== '' ){
            let contactToResend = '?contactToResend='+this.state.contactEmail;
            let typeResend;
            let editSurvey = '&editSurvey=disabled';

            if( this.props.titleModal === 'Resend Survey' || this.props.titleModal === 'Edit Survey' ){
                typeResend = '&typeResend=survey';
                if(this.props.titleModal === 'Edit Survey'){
                    editSurvey = '&editSurvey=enabled';
                }
            }else if( this.props.titleModal === 'Final Report' ){
                typeResend = '&typeResend=final-report';
            }else if( this.props.titleModal === 'Executive Final Report' ){
                typeResend = '&typeResend=executive-report';
            }

            let url = `${'/home/resend-to'}${contactToResend}${typeResend}${editSurvey}`;

            let request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.send();
            request.onload = function() {
                if (request.status === 200) {
                    let status = JSON.parse(request.responseText);
                    //let responseInfo = JSON.stringify(response);

                    if( status !== 'Contact ' + this.state.contactEmail +' does not have survey to resend.'
                       || status !== 'Contact ' + this.state.contactEmail +' does not have survey to edit.' ){
                        $("#HomeResendModal").modal('hide');

                        userInterface.notify(this.props.titleModal, status, 'success');
                    }else{
                        userInterface.notify(this.props.titleModal, status, 'notice');
                    }
                }
            }.bind(this);
            return{loading: true}
        }else{
            userInterface.notify(this.props.titleModal, 'Please select a Contact.','notice');
        }

    };

    render(){
        return(
              <div>
                  <div className="modal-header">
                      <button type="button" id="btn-modal-remove" className="close" data-dismiss="modal" aria-hidden="true"><span className="ion-close-round"></span></button>
                      <h2 className="modal-title" id="myLargeModalLabel-remove" style={{color: 'white'}}>{this.props.titleModal}</h2>
                  </div>
                  <div className="modal-body">
                      <div className="col-sm-10 col-sm-offset-1">
                          <label className="uppercase">Select Contact</label>
                          <ReactTable
                              data={this.state.dataContacts}
                              showPageSizeOptions= {false}
                              filterable
                              getTrProps={(state, rowInfo) => {
                                  if(rowInfo !== undefined){ //console.log("row info"+rowInfo.index);
                                      return {
                                          onClick: (e) =>  {
                                              this.setState({
                                                  contactSelected: rowInfo.row.name,
                                                  contactEmail: rowInfo.original.email
                                              });
                                          },
                                          style: {
                                              background: rowInfo.row.name === this.state.contactSelected ? '#e2e2e2' : 'white'
                                          }
                                      }
                                  }else{
                                      return {
                                          style: {
                                              background: 'white'
                                          }
                                      }
                                  }
                              }}
                              columns={[
                                  {
                                      Header: "Name",
                                      id: "name",
                                      accessor: d => d.name.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); }),
                                      filterMethod: (filter, rows) =>
                                          matchSorter(rows, filter.value, { keys: ["name"] }),
                                      filterAll: true,
                                      Filter: ({ filter, onChange }) => (
                                          <input className="customer-code-input form-control input-sm" onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                                      )
                                  }
                              ]}
                              onFilteredChange={(column, value) => {
                                  this.setState({
                                      contactSelected: ''
                                  });
                              }}
                              defaultPageSize={10}
                              className="-striped -highlight"
                          />
                          <div className="row">
                              <div className="input-group">
                                  <span className="input-group-btn">
                                      <button id="user-form" className="btn btn-info btn-search-user pull-right mright-15 mtop-25" onClick={()=>this.handleReSend()} >
                                          <span className="content"><span className="ion-paper-airplane"/> Resend</span>
                                      </button>
                                  </span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
        );
    }
}

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    };

    reSendMail = (nameModal) => {
        //Mount React component in DOM
        ReactDOM.render(<ReSendModal titleModal={nameModal} />, document.getElementById('resend-modal'));

        //Open Modal
        $("#HomeResendModal").modal();
    };

    render() {
        return (
            <div>
                <section className="container-fluid mbottom-20">
                    <div className="row">
                        <div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 mtop-10 clearfix">
                            <div className="col-lg-4 col-md-4 text-center hidden-xs mtop-25">
                                <i className="circle-home-ion"><span className="ion-clipboard send-icon mtop-5"></span></i>
                            </div>
                            <div className="col-lg-8 col-md-8 section-left-home">
                                <h1 className="text-bold title-home">Resend Survey</h1>
                                <p>Lost your email to respond your survey ?</p>
                                <button type="button" className="btn btn-info btn-md btn-shadow" onClick={()=>this.reSendMail("Resend Survey")} >
                                    Click here to resend it to yourself
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="container-fluid mbottom-20">
                    <div className="row">
                        <div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 clearfix">
                            <div className="col-lg-4 col-md-4 text-center hidden-xs mtop-25">
                                <i className="circle-home-ion"><span className="ion-arrow-graph-up-right send-icon mtop-5"></span></i>
                            </div>
                            <div className="col-lg-8 col-md-8 section-left-home">
                                <h1 className="text-bold title-home">User Report</h1>
                                <p>Lost your link to see your User report?</p>
                                <button type="button" className="btn btn-info btn-md btn-shadow" onClick={()=>this.reSendMail("Final Report")} >
                                    Click here to resend it to yourself
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="container-fluid mbottom-20">
                    <div className="row">
                        <div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 footer-home-space clearfix">
                            <div className="col-lg-4 col-md-4 text-center hidden-xs mtop-25">
                                <i className="circle-home-ion"><span className="ion-stats-bars send-icon mtop-5"></span></i>
                            </div>
                            <div className="col-lg-8 col-md-8 section-left-home">
                                <h1 className="text-bold title-home">Executive Report</h1>
                                <p>Lost your link to see your Executive Report?</p>
                                <button type="button" className="btn btn-info btn-md btn-shadow" onClick={()=>this.reSendMail("Executive Final Report")} >
                                    Click here to resend it to yourself
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

ReactDOM.render(<HomePage/>, document.getElementById('home-page'));

//When close modal component is unmounting
$('#HomeResendModal').on('hidden.bs.modal', function () {
    //Unmounting component
    ReactDOM.unmountComponentAtNode(document.getElementById('resend-modal'));
});