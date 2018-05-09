const userInterface = SurveyEngine.commons.userInterface;
let reportType = document.getElementById('report-table').getAttribute('name');
const path = '/reports/get/'+reportType;
const months = ['', 'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']
const divisions = ["EMS", "PWB", "ISS/PMC", "ENC", "BPA/CAB"]

class FinalReport extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            loading: true,
            showComments: false,
            fiscalMonth: -1,
            fiscalYear: -1,
            yearList: []
        };
    }

    showComments = (checked) => {
        this.setState({
            showComments: checked,
        });
    }

    handleDateFilters = (month, year) => {
        this.setState(() => {
            let contactId = `?contact=${userInterface.getUrlParam("contact") ? userInterface.getUrlParam("contact") : document.getElementById('contactId').getAttribute('name')}`;
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

    getRatingColumn = (row) => {
        let ratingColumn = row.column.Header;
        let divisionalColumn = []

        if(row.value.length > 0){
            let rating = row.value.filter(answer => answer.questionText === ratingColumn)[0];
            divisionalColumn.push(<div>
                <div className="visible-lg">
                    <div className={this.state.showComments ? 'hidden' : ''} style={rating && rating.answer.length > 0 && this.state.showComments ? {height: '11%'}: {height: '35'}}>
                        <div className={rating && rating.answer ? ratingColumn == 'Comments' ? 'Comment' : rating.answer.replace(' ', '-') : ''}><div className="rating">{rating && rating.answer ? rating.answer : ''}</div></div>
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
                divisionalColumn.push(<div style={rating && rating.answer.length > 0 && this.state.showComments ? {height: '11%'}: {height: '35'}}><div className={rating && rating.answer ? ratingColumn == 'Comments' ? 'Comment' : rating.answer.replace(' ', '-') : ratingColumn != 'Comments' ? 'NA-rating': ''}><div className={`rating-divisional-${division.substr(0,3)}`}>{rating && rating.answer && ratingColumn == 'Comments' ? rating.answer : ratingColumn == 'Comments' ? '':division}</div></div></div>);
            })
        }

        return divisionalColumn;
    }


    ratingsTable = (data) => {
        return (
            <div className="ratings-table">
                <ReactTable
                    data={data.value}
                    columns= {[
                        {
                            Header: "Quality",
                            accessor: "answers",
                            maxWidth: this.state.showComments ? 70 : 225,
                            Cell: row => this.getRatingColumn(row)
                        },
                        {
                            Header: "Delivery",
                            accessor: "answers",
                            maxWidth: this.state.showComments ? 70 : 225,
                            Cell: row => this.getRatingColumn(row)
                        },
                        {
                            Header: "Service",
                            accessor: "answers",
                            maxWidth: this.state.showComments ? 70 : 225,
                            Cell: row => this.getRatingColumn(row)

                        },
                        {
                            Header: "Other",
                            accessor: "answers",
                            maxWidth: this.state.showComments ? 70 : 225,
                            Cell: row => this.getRatingColumn(row)

                        },
                        {
                            Header: "Overall",
                            accessor: "answers",
                            maxWidth: this.state.showComments ? 70 : 225,
                            Cell: row => this.getRatingColumn(row)
                        },
                        {
                            Header: "Contact",
                            accessor: "recipient",
                            Cell: row => <div className="rating">{row.value}</div>
                        },
                        {
                            Header: "Comments",
                            accessor: "answers",
                            minWidth: 400,
                            Cell: row => this.getRatingColumn(row),
                            show: this.state.showComments
                        },
                    ]}
                    getTdProps={() => {
                        return { style:{ padding: 5 } }
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
            </div>
        )
    }

    externalRatingsTable = (data) => {
        console.log(data)
        return (
            <ReactTable
                data={data}
                columns= {[
                    {
                        Header: () => <div style={{fontSize: 14}}>Customer Feedback</div>,
                        columns:[
                            {
                                Header: "Type",
                                accessor: "ratingType",
                                maxWidth: 55,
                                Cell: row => <div className="external-rating">{row.original.ratingType}</div>
                            },
                            {
                                Header: "Rating (Date)",
                                accessor: "rating",
                                Cell: row => <div className="external-rating">{`${row.original.rating}% ${row.original.ratingPeriod}`}</div>,
                            }
                        ]
                    },

                ]}
                getTdProps={() => {
                    return { style:{ padding: 0 } }
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
                pageSize = {data.length}
                resizable = {false}
            />
        )
    }

    render() {
        return (
            <div className={`tab-content col-lg-12  clearfix`}>
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
                                            <select id="fiscalMonth" onChange={event => this.handleDateFilters(event.target.value, this.state.fiscalYear)} value={this.state.fiscalMonth}>
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
                                            <select id="fiscalYear" onChange={event => this.handleFilters(this.state.fiscalMonth, event.target.value)} value={this.state.fiscalYear}>
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
                                    <div className="col-lg-8 col-xs-12 padding-0">
                                        <div className="pull-left mtop-10" style={{fontSize: 14}}>
                                            <div className="wrap"> This are your responses for {months[this.state.fiscalMonth]} {this.state.fiscalYear}.</div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-xs-12">
                                        <div className="pull-right mtop-5">
                                            <input id="comments" name="comments" type="checkbox" onChange={event => this.showComments(event.target.checked)} value={this.state.showComments ? 'on':'off'} />
                                            <label htmlFor="comments" className="text-smaller"> Show comments </label>
                                        </div>
                                    </div>
                                </div>
                            </div>,
                            columns: [
                                {
                                    Header: "Customer",
                                    accessor: "customerExternalRating",
                                    maxWidth: 200,
                                    Cell: row => {
                                        let rowExternalRating = [];
                                        row.value ? rowExternalRating= [row] : rowExternalRating.push({});
                                        console.log(row)
                                        return row.value ? <div><div className="customer">{row.original.customer}</div><div>{this.externalRatingsTable(rowExternalRating)}</div></div> : <div className="customer">{row.original.customer}</div>;
                                    },
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
                            let contactId = `?contact=${userInterface.getUrlParam("contact") ? userInterface.getUrlParam("contact") : document.getElementById('contactId').getAttribute('name')}`;
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
                <!--<div className="mtop-40">
                    <span className="pull-left"><strong>Legend:</strong></span>
                    <div className="col-xs-10">
                        <span className="col-lg-3 col-sm-3 col-xs-12"><div className="legend-circle Needs-improvement col-xs-3"></div>  1 - Needs improvement</span>
                        <span className="col-lg-3 col-sm-3 col-xs-12"><div className="legend-circle Acceptable col-xs-3"></div>  2 - Acceptable</span>
                        <span className="col-lg-3 col-sm-3 col-xs-12"><div className="legend-circle Good col-xs-3"></div>  3 - Good</span>
                    </div>
                </div>-->
            </div>
        );
    }
}

ReactDOM.render(<FinalReport/>, document.getElementById('report-table'));
