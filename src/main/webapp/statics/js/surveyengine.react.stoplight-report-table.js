const userInterface = SurveyEngine.commons.userInterface;
const path = '/reports/get/stoplight-report';
const months = ['', 'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']
const divisions = ["EMS", "PWB", "ISS/PMC", "ENC", "BPA/CAB"]

class StoplightReport extends React.Component {
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

    handleDateFilters = (month, year) => {
        this.setState(() => {
            let contactId = `?contact=${userInterface.getUrlParam("contact")}`;
            let fiscalMonth = `&fiscalMonth=${month}`
            let fiscalYear = `&fiscalYear=${year}`
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

    getOverallRatingColumn = (row) => {
        if(row.value.length > 0){

            let divisional = divisions.indexOf(row.column.Header) >= 0;

            const rating = 'Overall'

            let overallRatingsFound = row.value.map(response =>
                response.answers.filter( answer => divisional ? answer.questionText.includes(rating) && answer.questionText.includes(row.column.Header) :
                    answer.questionText == rating));

            let ratingNumbers = overallRatingsFound.map( response =>
                response.map( rating =>
                    rating.answer == 'Good' ? rating.answer = 3 :
                        rating.answer == 'Acceptable' ? rating.answer = 2 :
                            rating.answer == 'Needs improvement' ? rating.answer = 1 :
                                rating.answer = 0)
            )

            let sumOverallRating = ratingNumbers.reduce((accumulator, currentVal) => {
                currentVal.map((b, i) => {
                    accumulator[i] = (accumulator[i] || 0) + b;
                });
                return accumulator;
            });

            let averageOverallRating = Math.round(sumOverallRating/ratingNumbers.length);

            let ratingColor = String(averageOverallRating).startsWith('3') ? 'Good':
                String(averageOverallRating).startsWith('2') ? 'Acceptable':
                    String(averageOverallRating).startsWith('1') ? 'Needs-improvement': 'NA-rating';

            return <div className={`rating-circle ${ratingColor}`}  style={{ whiteSpace: 'nowrap', display: 'flex', justifyContent:'center', alignItems:'center'}}><div className="rating">{averageOverallRating ? averageOverallRating : 'N/A'}</div></div>
        }
    }

    render() {
        return (
            <div className={`tab-content col-lg-12 clearfix ratings-table`}>
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
                                            <div className="wrap"> This is the customer satisfaction stoplight report for {months[this.state.fiscalMonth]} {this.state.fiscalYear}. (unsubmitted ratings are not shown here)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>,
                            columns: [
                                {
                                    Header: "Customer",
                                    accessor: "customer",
                                    minWidth: 300,
                                    filterable: false,
                                    Cell: row => <div className="rating">{row.value}</div>

                                },
                                {
                                    Header: "Overall CSO",
                                    accessor: 'responses',
                                    Cell: row => this.getOverallRatingColumn(row)
                                },
                                {
                                    Header: "EMS",
                                    accessor: 'responses',
                                    Cell: row => this.getOverallRatingColumn(row)
                                },
                                {
                                    Header: "BPA/CAB",
                                    accessor: 'responses',
                                    Cell: row => this.getOverallRatingColumn(row)
                                },
                                {
                                    Header: "ENC",
                                    accessor: 'responses',
                                    Cell: row => this.getOverallRatingColumn(row)
                                },
                                {
                                    Header: "ISS/PMC",
                                    accessor: 'responses',
                                    Cell: row => this.getOverallRatingColumn(row)
                                },
                                {
                                    Header: "PWB",
                                    accessor: 'responses',
                                    Cell: row => this.getOverallRatingColumn(row)
                                }
                            ]
                        }
                    ]}
                    getTdProps={() => {
                        return { style:{ wordBreak: 'break-word', whiteSpace: 'pre-line', display: 'flex', justifyContent: 'center' } }
                    }}
                    onFetchData={() => {
                        this.setState(() => {
                            let contactId = `?contact=${userInterface.getUrlParam("contact")}`;
                            let fiscalMonth = `&fiscalMonth=${this.state.fiscalMonth}`;
                            let fiscalYear= `&fiscalYear=${this.state.fiscalYear}`;
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
                    defaultPageSize={10}
                    className="-striped -highlight"
                    resizable = {false}
                    sortable= {false}
                />
                <div className="mtop-40">
                    <div className="col-xs-12 padding-0">
                        <span className="pull-left"><strong>Legend:</strong></span>
                        <span className="col-lg-2 col-sm-2 col-xs-12"><div className="legend-circle Needs-improvement col-xs-3"></div>  1 - Needs improvement</span>
                        <span className="col-lg-2 col-sm-2 col-xs-12"><div className="legend-circle Acceptable col-xs-3"></div>  2 - Acceptable</span>
                        <span className="col-lg-2 col-sm-2 col-xs-12"><div className="legend-circle Good col-xs-3"></div>  3 - Good</span>
                        <span className="col-lg-2 col-sm-2 col-xs-12"><div className="legend-circle NA-rating col-xs-3"></div>  N/A</span>
                    </div>
                    <div className="col-lg-12 padding-0"><strong>Data: </strong>Data shown is calculated as an average of the Overall Ratings for each customer from all raters for the time frame shown. Similarly, the Divisional ratings are calculated as an average of the Overall Ratings for each customer for each division.</div>
                    <div className="col-lg-12 padding-0"><strong>Note: </strong>Averages are rounded up to the next higher integer when greater than *.5001 and rounded down when lower or equal to *.5001.</div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<StoplightReport/>, document.getElementById('report-table'));
