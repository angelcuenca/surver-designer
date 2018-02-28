const userInterface = SurveyEngine.commons.userInterface;
const path = '/reports/get/3-month-report';
const months = ['', 'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']

class ThreeMonthReport extends React.Component {
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

    getRatingColumn = (row) => {
        let ratingColumn = row.column.Header;
        if(row.value.length > 0){
            let rating = row.value.filter(answer => answer.questionText === ratingColumn)[0];
            return <div>
                <div className="visible-lg">
                    <div className={this.state.showComments ? 'hidden' : ''}>
                        <div className={ratingColumn != 'Comments' ? rating.answer.replace(' ', '-'): 'Comment'}><div className="rating">{rating.answer}</div></div>
                    </div>
                    <div className={this.state.showComments ? '' : 'hidden'}>
                        <div className={ratingColumn != 'Comments' ? rating.answer.replace(' ', '-'): 'Comment'}>{rating.answer == 'Needs improvement' ? '1' : rating.answer == 'Acceptable' ? '2' : rating.answer == 'Good' ? '3' : rating.answer}</div>
                    </div>
                </div>
                <div className="hidden-lg">
                    <div className={ratingColumn != 'Comments' ? rating.answer.replace(' ', '-'): 'Comment'}>{rating.answer == 'Needs improvement' ? '1' : rating.answer == 'Acceptable' ? '2' : rating.answer == 'Good' ? '3' : rating.answer}</div>
                </div>
            </div>
        }
    }

    ratingsTable = (data) => {
        return (
            <div className="ratings-table">
                <ReactTable
                    data={data.value}
                    columns= {[
                        {
                            Header: "Month-Year",
                            Cell: row => (
                                <div className="info-cell rating">{months[row.original.fiscalMonth]}-{row.original.fiscalYear}</div>
                            ),
                            maxWidth: 130,
                            minWidth: 125
                        },
                        {
                            Header: "Quality",
                            accessor: "answers",
                            maxWidth: this.state.showComments ? 57 : 200,
                            Cell: row => this.getRatingColumn(row)
                        },
                        {
                            Header: "Delivery",
                            accessor: "answers",
                            maxWidth: this.state.showComments ? 57 : 200,
                            Cell: row => this.getRatingColumn(row)
                        },
                        {
                            Header: "Service",
                            accessor: "answers",
                            maxWidth: this.state.showComments ? 57 : 200,
                            Cell: row => this.getRatingColumn(row)

                        },
                        {
                            Header: "Other",
                            accessor: "answers",
                            maxWidth: this.state.showComments ? 57 : 200,
                            Cell: row => this.getRatingColumn(row)

                        },
                        {
                            Header: "Overall",
                            accessor: "answers",
                            maxWidth: this.state.showComments ? 57 : 200,
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
                        }
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
                                maxWidth: 55
                            },
                            {
                                Header: "Rating (Date)",
                                accessor: "rating",
                                Cell: row => <div>{`${row.original.rating}% ${row.original.ratingPeriod}`}</div>,
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
                pageSize = {1}
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
                                    <div className="col-lg-9 col-xs-12 padding-0">
                                        <div className="pull-left mtop-10" style={{fontSize: 14}}>
                                            <div className="wrap"> This is the customer satisfaction overview report for the 3 months ending {months[this.state.fiscalMonth]} {this.state.fiscalYear}. (unsubmitted ratings are not shown here)</div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-xs-12">
                                        <div className="pull-right padding-0">
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
                                        row.value ? rowExternalRating.push(row.value) : rowExternalRating.push({});
                                        return row.value ? <div className="customer">{row.original.customer}<div>{this.externalRatingsTable(rowExternalRating)}</div></div>: <div className="customer">{row.original.customer}</div>;
                                    },
                                    filterable: false,
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
                            let fiscalYear = `&fiscalYear=${this.state.fiscalYear}`;
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
                    sortable = {false}
                    defaultPageSize={10}
                    className="-striped -highlight"
                />
                <div className="mtop-40">
                    <div className="col-xs-12 padding-0">
                        <span className="pull-left"><strong>Legend:</strong></span>
                        <span className="col-lg-3 col-sm-3 col-xs-12"><div className="legend-circle Needs-improvement col-xs-3"></div>  1 - Needs improvement</span>
                        <span className="col-lg-3 col-sm-3 col-xs-12"><div className="legend-circle Acceptable col-xs-3"></div>  2 - Acceptable</span>
                        <span className="col-lg-3 col-sm-3 col-xs-12"><div className="legend-circle Good col-xs-3"></div>  3 - Good</span>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<ThreeMonthReport/>, document.getElementById('report-table'));
