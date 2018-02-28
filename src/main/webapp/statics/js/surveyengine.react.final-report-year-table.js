const userInterface = SurveyEngine.commons.userInterface;
const path = '/reports/get/final-year-report';
const months = ['', 'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']
const ratingCategories = ['Overall', 'Quality', 'Delivery', 'Service', 'Other'];

class FinalYearReport extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            loading: true,
            fiscalYear: -1,
            customer: '',
            customerList:[],
            yearList: [],
        };
    }

    handleFilters = (newCustomer, year) => {
        this.setState(() => {
            let fiscalYear = `&fiscalYear=${year}`;
            let customer = `?customer=${encodeURIComponent(newCustomer)}`
            let url = `${path}${customer}${fiscalYear}`;

            let request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.send();
            request.onload = function () {
                if (request.status === 200) {
                    let response = JSON.parse(request.responseText);
                    this.setState({
                        data: response.responseByMonth,
                        customerList: response.dataCustomers,
                        fiscalYear: response.fiscalYear,
                        customer: response.customer,
                        yearList: response.yearList,
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

    getChartData = (data, columnCategory) => {

        let monthlyRatings = data.map(data =>
            data.responses.map(response => response.answers.filter(answer =>
                answer.questionText == columnCategory)))

        let ratings = monthlyRatings.map(response => response.map(rating => rating.length > 0 ? [rating[0].answer] : []))

        let ratingNumbers = ratings.map( response =>
            response.map( rating =>
                rating[0] == 'Good' ? [rating[0] = 3] :
                    rating[0] == 'Acceptable' ? [rating[0] = 2] :
                        [rating[0] = 1]))

        let averageMonthlyRatings = ratingNumbers.map(rating => rating.length > 0 ? (this.sumRatings(rating)/rating.length).toFixed(3) : 0)

        let formatData = {}

        for (const [index, value] of averageMonthlyRatings.entries()) {
            let date = `${this.state.fiscalYear}-${months[index+1]}`
            formatData[date] = value;
        }

        return formatData
    }

    getYearlyAverageRating = (row) => {
        let columnCategory = row.column.Header;
        let monthlyRatings = row.data.map(data =>
            data.responses.map(response => response.answers.filter(answer =>
                answer.questionText == columnCategory)));

        let ratingNumbers = monthlyRatings.map(response => response.map(rating => [rating[0].answer]));

        let averageMonthlyRatings = ratingNumbers.map(rating => rating.length > 0 ? [(this.sumRatings(rating)/rating.length).toFixed(3)] : [0]);

        let yearlyAverageRating = this.sumRatings(averageMonthlyRatings)/12;

        return yearlyAverageRating.toFixed(3);
    }

    getAverageRatingColumn = (row) => {
        if(row.value.length > 0){

            let overallRatingsFound = row.value.map(response =>
                response.answers.filter( answer =>
                    ratingCategories.indexOf(answer.questionText) >= 0 ));

            let categoryRatings = overallRatingsFound.map(response => matchSorter(response, row.column.Header, {keys: ['questionText']}))

            let ratingNumbers = categoryRatings.map( response =>
                response.map( rating =>
                    rating.answer == 'Good' ? rating.answer = 3 :
                        rating.answer == 'Acceptable' ? rating.answer = 2 :
                            rating.answer = 1))

            let sumOverallRating = this.sumRatings(ratingNumbers)

            let averageRating = sumOverallRating[0]/ratingNumbers.length;

            let ratingColor = String(averageRating).startsWith('3') ? 'Good':
                String(averageRating).startsWith('2') ? 'Acceptable':
                    'Needs-improvement';

            return <div className={ratingColor}><b className="rating">{averageRating.toFixed(3)}</b></div>
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
                                        <button onClick={event => this.handleFilters(this.state.customer, event.target.value)} role="button" className="btn btn-default btn-circle pull-left mright-15">
                                            <span className="glyphicon glyphicon-chevron-left"></span>
                                        </button>
                                        <small className="text-bold text-gray pull-left mright-10 mtop-10 hidden-sm hidden-xs">Previous Year</small>
                                    </div>

                                    <div className="form-group col-sm-3 col-xs-6">
                                        <div className="select">
                                            <select id="selectedCustomer" onChange={event => this.handleFilters(event.target.value, this.state.fiscalYear)} value={this.state.customer}>
                                                <option value='showAllCustomers'> ALL</option>
                                                {this.state.customer && this.state.customerList.map(customer => {
                                                    return <option value={customer.customerName}>{customer.customerName}</option>
                                                })}
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
                                        <button onClick={event => this.handleFilters(this.state.fiscalYear+1 > 12 ? 1 : this.state.fiscalYear+1)} className="btn btn-default btn-circle pull-right mleft-15">
                                            <span className="glyphicon glyphicon-chevron-right"></span>
                                        </button>
                                        <small className="text-bold text-gray pull-right mleft-10 mtop-10 hidden-sm hidden-xs">Next Year</small>
                                    </div>
                                </div>

                                <div className="col-xs-12">
                                    <div className=" padding-0">
                                        <div className="pull-left mtop-10" style={{fontSize: 14}}>
                                            <div className="wrap"> This is the overall average ratings report by month and customer for the year {months[this.state.fiscalMonth]} {this.state.fiscalYear}. (unsubmitted ratings are not shown here)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>,
                            columns: [
                                {
                                    Header: "Month",
                                    accessor: "month",
                                    Cell: row => <div className="rating">{months[row.value]}</div>,
                                    maxWidth: 150,
                                    filterable: false,
                                    Footer: (
                                        <span>
                                            <strong className="rating">OVERALL: </strong>
                                        </span>
                                    )
                                },
                                {
                                    Header: "Overall",
                                    accessor: 'responses',
                                    Cell: row => this.getAverageRatingColumn(row),
                                    Footer: row =>
                                        <span>
                                            <strong className="rating">{this.getYearlyAverageRating(row)}</strong>
                                        </span>

                                },
                                {
                                    Header: "Quality",
                                    accessor: 'responses',
                                    Cell: row => this.getAverageRatingColumn(row),
                                    Footer: row =>
                                        <span>
                                            <strong className="rating">{this.getYearlyAverageRating(row)}</strong>
                                        </span>
                                },
                                {
                                    Header: "Delivery",
                                    accessor: 'responses',
                                    Cell: row => this.getAverageRatingColumn(row),
                                    Footer: row =>
                                        <span>
                                            <strong className="rating">{this.getYearlyAverageRating(row)}</strong>
                                        </span>
                                },
                                {
                                    Header: "Service",
                                    accessor: 'responses',
                                    Cell: row => this.getAverageRatingColumn(row),
                                    Footer: row =>
                                        <span>
                                            <strong className="rating">{this.getYearlyAverageRating(row)}</strong>
                                        </span>
                                },
                                {
                                    Header: "Other",
                                    accessor: 'responses',
                                    Cell: row => this.getAverageRatingColumn(row),
                                    Footer: row =>
                                        <span>
                                            <strong className="rating">{this.getYearlyAverageRating(row)}</strong>
                                        </span>
                                },
                            ]
                        }
                    ]}
                    onFetchData={() => {
                        this.setState(() => {
                            let fiscalYear = `&fiscalYear=${this.state.fiscalYear}`;
                            let customer = `?customer=${encodeURIComponent(this.state.customer)}`
                            let url = `${path}${customer}${fiscalYear}`;

                            let request = new XMLHttpRequest();
                            request.open("GET", url, true);
                            request.send();
                            request.onload = function () {
                                if (request.status === 200) {
                                    let response = JSON.parse(request.responseText);
                                    this.setState({
                                        data: response.responseByMonth,
                                        customerList: response.dataCustomers,
                                        fiscalYear: response.fiscalYear,
                                        customer: response.customer,
                                        yearList: response.yearList,
                                        loading: false,
                                    });
                                }
                            }.bind(this);
                            return {loading: true}
                        })
                    }}
                    sortable={false}
                    defaultPageSize={12}
                    showPaginationBottom={false}
                    className="-striped -highlight"
                    manual
                />
                <div className="mtop-10">
                    <span className="pull-left"><strong>Legend:</strong></span>
                    <div className="col-xs-8">
                        <span className="col-lg-4 col-sm-4 col-xs-12"><div className="legend-circle Needs-improvement col-xs-3"></div>  1 - Needs improvement</span>
                        <span className="col-lg-4 col-sm-4 col-xs-12"><div className="legend-circle Acceptable col-xs-3"></div>  2 - Acceptable</span>
                        <span className="col-lg-4 col-sm-4 col-xs-12"><div className="legend-circle Good col-xs-3"></div>  3 - Good</span>
                    </div>
                </div>
                <div className="mtop-10 col-xs-12" style={{backgroundColor: '#f7f7f7'}}>
                    <LineChart
                        colors = {["#33b5e5", "#9c27b0", "#ff9800", "#e91e63", "#3f51b5" ]}
                        data = {[
                            {"name": "Overall", "data": this.getChartData(this.state.data, "Overall")},
                            {"name": "Quality", "data": this.getChartData(this.state.data, "Quality")},
                            {"name": "Delivery", "data": this.getChartData(this.state.data, "Delivery")},
                            {"name": "Service", "data": this.getChartData(this.state.data, "Service")},
                            {"name": "Other", "data": this.getChartData(this.state.data, "Other")}
                        ]}
                        legend="bottom"
                    />
                </div>
            </div>
        );
    }
}

ReactDOM.render(<FinalYearReport/>, document.getElementById('report-table'));
