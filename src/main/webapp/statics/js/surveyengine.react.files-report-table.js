const userInterface = SurveyEngine.commons.userInterface;
const path = '/reports/get/files-report'
const months = ['', 'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']

    class UploadedFilesReport extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            loading: true,
            fiscalMonth: -1,
            fiscalYear: -1,
            yearList: []
        };
    }

    modalUploadFile = (row) => {
        ReactDOM.render(<UploadFile row = {row} responseId={row.original.id} />, document.getElementById('upload-file'));

        $('#UploadFileModal').modal()
    }

    handleDateFilters = (month, year) => {
        this.setState(() => {
            let fiscalMonth = `?fiscalMonth=${month}`;
            let fiscalYear = `&fiscalYear=${year}`;
            let url = `${path}${fiscalMonth}${fiscalYear}`;

            let request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.send();
            request.onload = function () {
                if (request.status === 200) {
                    let response = JSON.parse(request.responseText);
                    this.setState({
                        data: response.responsesByCustomer,
                        fiscalMonth: response.fiscalMonth,
                        fiscalYear: response.fiscalYear,
                        yearList: response.yearList,
                        loading: false,
                    });
                }
            }.bind(this);
            return {loading: true}
        })
    }

    getFilename = (event, blobKey) => {
        let filename = ''
        let url = `/serve?blob-key=${blobKey}`
        let request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.send();
        request.onload = function () {
            if (request.status === 200) {
                let disposition = request.getResponseHeader('Content-Disposition');
                let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                let matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');
                }
                $(event).parent().append(filename)
            }
        }.bind(this);
    }

    getFileColumn = (row) => {
        let ratingColumn = 'Upload related file';

        if(row.length > 0){
            let rating = row.filter(answer => answer.questionText === ratingColumn)[0];
            let blob = rating && rating.answer ? rating.answer:''
            return <div>
                <a onLoad={event => this.getFilename(event.target, blob)} href={rating && rating.answer ? `/serve?blob-key=${rating.answer}` : ' '} target="_blank">
                    <img className="hidden img-responsive center" style={{maxHeight: 40}} src={rating && rating.answer ? `/serve?blob-key=${rating.answer}`:''}/>
                </a>
            </div>
        }
    }

    ratingsTable = (data) => {
        return (
            <ReactTable
                data={data.value}
                columns= {[
                    {
                        Header: "File Name",
                        accessor: "answers",
                        Cell: row => this.getFileColumn(row.value)
                    },
                    {
                        Header: "Contact",
                        accessor: "recipient",
                    },
                    {
                        Header: "Action",
                        Cell: row => <div>
                            <div className="col-xs-6">
                                <a type="button" className="btn btn-success btn-sm btn-edit-circle" onClick={event=>{this.modalUploadFile(row, event)}}>
                                    <span><span className="ion-edit text-bigger"></span> </span>
                                </a>
                            </div>
                            <div className="col-xs-6">
                                <a type="button" href={row.original.answers[16] ? `/serve?blob-key=${row.original.answers[16].answer}`:''} download="" className="btn btn-info btn-sm btn-edit-circle">
                                    <span><span className="ion-arrow-down-a text-bigger"></span></span>
                                </a>
                            </div>
                        </div>,
                        maxWidth: 100
                    },
                ]}
                getTheadProps={() => {
                    return {
                        style: {
                            backgroundColor: 'rgba(255, 255, 255, 0)',
                            color: '#818a95',
                            fontSize: '14px',
                            zIndex: '1'
                        }
                    }
                }}
                pageSize = {data.value.length}
                showPagination = {false}
                resizable = {false}
                sortable={false}
            />
        )
    }
    render() {
        return (
            <div className={`tab-content col-lg-12 clearfix`}>
                <ReactTable
                    data={this.state.data}
                    loading={this.state.loading}
                    columns={[
                        {
                            Header: () => <div className="row">
                                <div className="col-xs-12">
                                    <div className="pull-left">
                                        <button onClick={event => this.handleDateFilters(this.state.fiscalMonth - 1 <=0 ? 12 : this.state.fiscalMonth-1, this.state.fiscalYear)} role="button" className="btn btn-default btn-circle pull-left mright-15">
                                            <span className="glyphicon glyphicon-chevron-left"></span>
                                        </button>
                                        <small className="text-bold text-gray pull-left mright-10 mtop-10 hidden-sm hidden-xs">Previous Month</small>
                                    </div>

                                    <div className="form-group col-sm-3 col-xs-5">
                                        <div className="select">
                                            <select onChange={event => this.handleDateFilters(event.target.value, this.state.fiscalYear)} value={this.state.fiscalMonth}>
                                                <option value='1'>JANUARY</option>
                                                <option value='2'>FEBRUARY</option>
                                                <option value='3'>MARCH</option>
                                                <option value='4'>APRIL</option>
                                                <option value='5'>MAY</option>
                                                <option value='6'>JUNE</option>
                                                <option value='7'>JULY</option>
                                                <option value='8'>AUGUST</option>
                                                <option value='9'>SEPTEMBER</option>
                                                <option value='10'>OCTOBER</option>
                                                <option value='11'>NOVEMBER</option>
                                                <option value='12'>DECEMBER</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group col-sm-3 col-xs-4">
                                        <div className="select">
                                            <select onChange={event => this.handleFilters(this.state.fiscalMonth, event.target.value)} value={this.state.fiscalYear}>
                                                {this.state.fiscalYear && this.state.yearList.map(year => {
                                                    return <option value={year}>{year}</option>
                                                })}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="pull-right">
                                        <button onClick={event => this.handleDateFilters(this.state.fiscalMonth+1 > 12 ? 1 : this.state.fiscalMonth+1, this.state.fiscalYear)} className="btn btn-default btn-circle pull-right mleft-15">
                                            <span className="glyphicon glyphicon-chevron-right"></span>
                                        </button>
                                        <small className="text-bold text-gray pull-right mleft-10 mtop-10 hidden-sm hidden-xs">Next Month</small>
                                    </div>
                                </div>
                                <div className="col-xs-12">
                                    <div className="padding-0">
                                        <div className="pull-left mtop-10" style={{fontSize: 14}}>
                                            <div className="wrap"> This is the uploaded files by customer and contact report for {months[this.state.fiscalMonth]} {this.state.fiscalYear}. (unsubmitted ratings are not shown here)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>,
                            columns: [
                                {
                                    Header: "Customer",
                                    accessor: "customer",
                                    filterable: false,
                                    maxWidth: 300
                                },
                                {
                                    Header: "Ratings",
                                    accessor: "responses",
                                    Cell: row => (this.ratingsTable(row)),
                                    filterable: false
                                }
                            ]
                        }
                    ]}
                    getTdProps={() => {
                        return { style:{ wordBreak: 'break-word', whiteSpace: 'pre-line' } }
                    }}

                    onFetchData={() => {
                        this.setState(() => {
                            let fiscalMonth = `?fiscalMonth=${this.state.fiscalMonth}`;
                            let fiscalYear = `&fiscalYear=${this.state.fiscalYear}`
                            let url = `${path}${fiscalMonth}${fiscalYear}`;

                            let request = new XMLHttpRequest();
                            request.open("GET", url, true);
                            request.send();
                            request.onload = function () {
                                if (request.status === 200) {
                                    let response = JSON.parse(request.responseText);
                                    this.setState({
                                        data: response.responsesByCustomer,
                                        fiscalMonth: response.fiscalMonth,
                                        fiscalYear: response.fiscalYear,
                                        yearList: response.yearList,
                                        loading: false,
                                    });
                                }
                            }.bind(this);
                            return {loading: true}
                        })
                    }}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    sortable = {false}
                />
            </div>
        );
    }
}

class UploadFile extends React.Component {
    constructor() {
        super();
        this.state = {
            file: ''
        };
    }

    handleUploadLogo = (redirectAction) => {
        let formData = new FormData();
        formData.append("uploaded_files", this.state.file);
        let request = new XMLHttpRequest();
        request.open("POST", redirectAction, true);
        request.setRequestHeader('responseId', this.props.responseId)
        request.send(formData);
        request.onload = function() {
            if (request.status === 200) {
                let response = JSON.parse(request.responseText);
                ReactDOM.unmountComponentAtNode(document.getElementById('report-table'));
                ReactDOM.render(<UploadedFilesReport/>, document.getElementById('report-table'));
                $("#UploadFileModal").modal('hide');
            }
        }.bind(this);
    };

    handleUploadSession = (row) => {
        let request = new XMLHttpRequest();
        request.open("GET", "/uploadSessionEditFile");
        request.send();
        request.onload = function () {
            if(request.status === 200){
                let redirectAction = JSON.parse(request.responseText);
                this.handleUploadLogo(redirectAction, row);
            }
        }.bind(this);
    }

    handleFileOnChange = (newFile) => {
        this.setState({
            file: newFile
        });
    }

    render() {
        return(
            <div>
                <div className="file-drop-area row">
                    <span className="btn btn-info col-xs-4">Choose files</span>
                    <span className="file-msg file-name col-xs-8"> or drag and drop files here</span>
                    <input id="btn-submitFile" onChange={() => this.handleFileOnChange($('#btn-submitFile')[0].files[0])} name="file" className="file-input" type="file" value="" disabled=""/>
                </div>

                <div className="btn-save-file form-group">
                    <div className="input-group">
                        <span className="input-group-btn">
                            <button id="btn-save" type="submit" onClick={() => {this.handleUploadSession(this.props.row)}} className="btn btn-info btn-search-user pull-right mtop-20 mleft-10">
                                <span className="content">
                                    <span className="ion-checkmark"></span> Save</span>
                            </button>
                        </span>
                    </div>
                </div>
            </div>

        )
    }
}


ReactDOM.render(<UploadedFilesReport/>, document.getElementById('report-table'));
