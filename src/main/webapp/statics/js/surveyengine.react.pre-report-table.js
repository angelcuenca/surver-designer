const userInterface = SurveyEngine.commons.userInterface;
const path = '/reports/get/pre-report'
const months = ['', 'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']
const divisions = ["EMS", "PWB", "ISS/PMC", "ENC", "BPA/CAB"]

class PreReport extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            yearList: [],
            loading: true,
            fiscalMonth: -1,
            fiscalYear: -1,
            showComments: false
        };
    }

    showComments = (checked) => {
        this.setState({
            showComments: checked,
        });
    }

    handleDateFilters = (month, year) => {
        this.setState(() => {
            let contactId = `?contact=${userInterface.getUrlParam("contact")}`;
            let fiscalMonth = `&fiscalMonth=${month}`;
            let fiscalYear = `&fiscalYear=${year}`;
            let url = `${path}${contactId}${fiscalMonth}${fiscalYear}`;

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

    /*getRatingColumn = (row) => {
        let ratingColumn = row.column.Header;
        if(row.value.length > 0){
            let rating = row.value.filter(answer => answer.questionText === ratingColumn)[0];
            return <div>
                <div className="visible-lg">
                    <div className={this.state.showComments ? 'hidden' : ''}>
                        <div className={rating && rating.answer ? ratingColumn == 'Comments' ? 'Comment' : rating.answer.replace(' ', '-') : ''}>{rating && rating.answer ? rating.answer : ''}</div>
                    </div>
                    <div className={this.state.showComments ? '' : 'hidden'}>
                        <div className={rating && rating.answer ? ratingColumn == 'Comments' ? 'Comment' : rating.answer.replace(' ', '-') : ''}>{rating && rating.answer ? rating.answer == 'Needs improvement' ? '1' : rating.answer == 'Acceptable' ? '2' : rating.answer == 'Good' ? '3' : rating.answer : ''}</div>
                    </div>
                </div>
                <div className="hidden-lg">
                    <div className={rating && rating.answer ? ratingColumn == 'Comments' ? 'Comment' : rating.answer.replace(' ', '-') : ''}>{rating && rating.answer ? rating.answer == 'Needs improvement' ? '1' : rating.answer == 'Acceptable' ? '2' : rating.answer == 'Good' ? '3' : rating.answer : ''}</div>
                </div>
            </div>
        }
    }*/

    getRatingColumn = (row) => {
        let ratingColumn = row.column.Header;
        let divisionalColumn = []

        if(row.value.length > 0){
            console.log(row.value)
            let rating = row.value.filter(answer => answer.questionText === ratingColumn)[0];
            divisionalColumn.push(<div>
                <div className="visible-lg">
                    <div className={this.state.showComments ? 'hidden' : ''} style={rating && rating.answer.length > 0 && this.state.showComments ? {height: '11%'}: {height: '35'}}>
                        <div className={rating && rating.answer ? ratingColumn == 'Comments' ? 'Comment' : rating.answer.replace(' ', '-') : ''}>{rating && rating.answer ? rating.answer : ''}</div>
                    </div>
                    <div className={this.state.showComments ? '' : 'hidden'} style={rating && rating.answer.length > 0 && this.state.showComments ? {height: '11%'}: {height: '35'}}>
                        <div className={rating && rating.answer ? ratingColumn == 'Comments' ? 'Comment' : rating.answer.replace(' ', '-') : ''}>{rating && rating.answer ? rating.answer == 'Needs improvement' ? '1' : rating.answer == 'Acceptable' ? '2' : rating.answer == 'Good' ? '3' : rating.answer : ''}</div>
                    </div>
                </div>
                <div className="hidden-lg" style={rating && rating.answer.length > 0 && this.state.showComments ? {height: '11%'}: {height: '35'}}>
                    <div className={rating && rating.answer ? ratingColumn == 'Comments' ? 'Comment' : rating.answer.replace(' ', '-') : ''}>{rating && rating.answer ? rating.answer == 'Needs improvement' ? '1' : rating.answer == 'Acceptable' ? '2' : rating.answer == 'Good' ? '3' : rating.answer : ''}</div>
                </div>
            </div>)
            divisions.forEach(division => {
                let rating = row.value.filter(answer => answer.questionText.includes(division) && answer.questionText.includes(ratingColumn))[0];
                divisionalColumn.push(<div style={rating && rating.answer.length > 0 && this.state.showComments ? {height: '11%'}: {height: '35'}}><div className={rating && rating.answer ? ratingColumn == 'Comments' ? 'Comment' : rating.answer.replace(' ', '-') : ratingColumn != 'Comments' ? 'NA-rating': ''}>{rating && rating.answer && ratingColumn == 'Comments' ? rating.answer : ratingColumn == 'Comments' ? '':division}</div></div>);
            })
        }else {
            return <div className="Awaiting"> Awaiting </div>
        }

        return divisionalColumn;
    }

    ratingsTable = (data) => {
        return (
            <ReactTable
                data={data.value}
                columns= {[
                    {
                        Header: "Quality",
                        accessor: "answers",
                        maxWidth: this.state.showComments ? 75 : 300,
                        Cell: row => this.getRatingColumn(row),
                    },
                    {
                        Header: "Delivery",
                        accessor: "answers",
                        maxWidth: this.state.showComments ? 75 : 300,
                        Cell: row => this.getRatingColumn(row)
                    },
                    {
                        Header: "Service",
                        accessor: "answers",
                        maxWidth: this.state.showComments ? 75 : 300,
                        Cell: row => this.getRatingColumn(row)

                    },
                    {
                        Header: "Other",
                        accessor: "answers",
                        maxWidth: this.state.showComments ? 75 : 300,
                        Cell: row => this.getRatingColumn(row)

                    },
                    {
                        Header: "Overall",
                        accessor: "answers",
                        maxWidth: this.state.showComments ? 75 : 300,
                        Cell: row => this.getRatingColumn(row)
                    },
                    {
                        Header: "Comments",
                        accessor: "answers",
                        minWidth: 500,
                        Cell: row => this.getRatingColumn(row),
                        show: this.state.showComments
                    },
                    {
                        Header: "Action",
                        accessor: "recipient",
                        Cell: row => <div className="text-center">
                            <a type="button" className="btn btn-success btn-edit-circle" href={`/survey/${row.original.surveyId}/response/${row.original.id}`}>
                                <span><span className="ion-edit text-bigger"></span></span>
                            </a>
                        </div>,
                        minWidth: 100
                    }
                ]}
                getTdProps={() => {
                    return { style:{
                        padding: 5,
                    } }
                }}
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
                sortable = {false}
                showPagination = {false}
                pageSize = {data.value.length}
                resizable = {false}
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
                                <div className="col-xs-12 ">
                                    <div className="col-xs-8 padding-0">
                                        <div className="pull-left mtop-10" style={{fontSize: 14}}>
                                            <div className="wrap"> This are your responses for {months[this.state.fiscalMonth]} {this.state.fiscalYear}.</div>
                                        </div>
                                    </div>
                                    <div className="col-xs-4 padding-0">
                                        <div className="pull-right">
                                            <input id="comments" name="comments" type="checkbox" onChange={event => this.showComments(event.target.checked)} value={this.state.showComments ? 'on':'off'} />
                                            <label htmlFor="comments" className="text-smaller"> Show comments </label>
                                        </div>
                                    </div>
                                </div>

                            </div>,
                            columns: [
                                {
                                    Header: "Customer",
                                    accessor: "customer",
                                    maxWidth: 200,
                                },
                                {
                                    Header: "Ratings",
                                    accessor: "responses",
                                    Cell: row => (this.ratingsTable(row)),
                                }
                            ]
                        }
                    ]}
                    getTdProps={() => {
                        return { style:{ wordBreak: 'break-word', whiteSpace: 'pre-line' } }
                    }}
                    onFetchData={() => {
                        this.setState(() => {
                            let contactId = `?contact=${userInterface.getUrlParam("contact")}`;
                            let fiscalMonth = `&fiscalMonth=${this.state.fiscalMonth}`;
                            let fiscalYear = `&fiscalYear=${this.state.fiscalYear}`;
                            let url = `${path}${contactId}${fiscalMonth}${fiscalYear}`;

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
                    filterable = {false}
                    sortable = {false}
                    defaultPageSize={10}
                    className="-striped -highlight"
                />
                <div className="mtop-40">
                    <span className="pull-left"><strong>Legend:</strong></span>
                    <div className="col-xs-10">
                        <span className="col-lg-3 col-sm-3 col-xs-12"><div className="legend-circle Needs-improvement col-xs-3"></div>  1 - Needs improvement</span>
                        <span className="col-lg-3 col-sm-3 col-xs-12"><div className="legend-circle Acceptable col-xs-3"></div>  2 - Acceptable</span>
                        <span className="col-lg-3 col-sm-3 col-xs-12"><div className="legend-circle Good col-xs-3"></div>  3 - Good</span>
                        <span className="col-lg-3 col-sm-3 col-xs-12"><div className="legend-circle Awaiting col-xs-3"></div>  Awaiting Response</span>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<PreReport/>, document.getElementById('report-table'));
