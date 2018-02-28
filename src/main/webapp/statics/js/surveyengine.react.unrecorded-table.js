const userInterface = SurveyEngine.commons.userInterface;
const path = '/reports/get/unrecorded-report'
const months = ['', 'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']

class UnrecordedReport extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            loading: true,
            fiscalMonth: -1,
            fiscalYear: -1,
            responsesByMonth: [],
            yearList: []
        };
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
                        responsesByMonth: response.responseByMonth,
                        loading: false,
                    });
                }
            }.bind(this);
            return {loading: true}
        })
    }

    sumRatings = (ratings) => {
        let sum = ratings.length > 0 ? ratings.reduce((accumulator, currentVal) => {
            currentVal.map((b, i) => {
                accumulator[i] = (accumulator[i] || 0) + b;
            });
            return accumulator;
        }) : 0

        return sum;
    }

    getAverageOverallRatingColumn = () => {

        let columnCategory = 'Overall'

        let monthlyRatings = this.state.responsesByMonth.map(data =>
            data.responses.map(response => response.answers.filter(answer =>
                answer.questionText == columnCategory)))

        let categoryRatings = monthlyRatings.map(response => response.map(rating => [rating[0].answer]))

        let ratingNumbers = categoryRatings.map( response =>
            response.map( rating =>
                rating[0] == 'Good' ? [rating[0] = 3] :
                    rating[0] == 'Acceptable' ? [rating[0] = 2] :
                        [rating[0] = 1]))

        let averageMonthlyRatings = ratingNumbers.map(rating => rating.length > 0 ? [(this.sumRatings(rating)/rating.length).toFixed(3)] : [0])

        return averageMonthlyRatings[0]
    }

    getPercentResponding = () => {
        let awaitingResponsesCount= 0;
        this.state.data.forEach(customer => awaitingResponsesCount = awaitingResponsesCount + customer.responses.length)

        let submittedResponsesCount = 0;

        this.state.responsesByMonth.forEach(month => submittedResponsesCount = submittedResponsesCount + month.responses.length)

        let percentResponding = ((submittedResponsesCount)/(awaitingResponsesCount+submittedResponsesCount))*100

        return percentResponding.toFixed(3)
    }

    unrecordedRatingsTable = (data) => {
        return (
            <ReactTable
                data={data.value}
                columns= {[
                    {
                        accessor: "recipient",
                        className: 'NA-rating',
                        Cell: row => <div className="rating">{row.value}</div>
                    },
                ]}
                getTdProps={() => {
                    return {
                        style:{
                            padding: 5,
                        }
                    }
                }}
                getTheadProps={() => {
                    return {
                        style: {
                            display: 'none'
                        }
                    }
                }}
                showPagination = {false}
                pageSize = {data.value.length}
                resizable = {false}
            />
        )
    }

    render() {
        return (
            <div className={`tab-content col-lg-12 clearfix ratings-table`}>
                <ReactTable
                    data={this.state.data}
                    responsesByMonth={this.state.responsesByMonth}
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
                                            <div className="wrap"> This is the list of unrecorded ratings by customer for {months[this.state.fiscalMonth]} {this.state.fiscalYear}.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>,
                            columns: [
                                {
                                    Header: "Customer",
                                    accessor: "customer",
                                    Cell: row => <div className="customer">{row.value}</div>,
                                    filterable: false,
                                    Footer: (
                                        <span>
                                            <strong className="rating">Average Overall Rating: {this.getAverageOverallRatingColumn()}</strong>
                                        </span>
                                    )
                                },
                                {
                                    Header: "Contact",
                                    accessor: "responses",
                                    Cell: row => (this.unrecordedRatingsTable(row)),
                                    filterable: false,
                                    Footer: (
                                        <span>
                                            <strong className="rating">Percent Responding: {this.getPercentResponding()}%</strong>
                                        </span>
                                    )
                                },
                            ]
                        }
                    ]}

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
                                        responsesByMonth: response.responseByMonth,
                                        yearList: response.yearList,
                                        loading: false,
                                    });
                                }
                            }.bind(this);
                            return {loading: true}
                        })
                    }}
                    sortable={false}
                    defaultPageSize={10}
                    className="-striped -highlight"
                />
            </div>
        );
    }
}

ReactDOM.render(<UnrecordedReport/>, document.getElementById('report-table'));
