
/**
 * Created by arlette_parra on 17/19/11.
 */
class InboxTable extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            loading: true,
            pageIndex: 0,
            pageSize: 10,
        };
    }

    render() {
        const path = '/inbox/get/responses'

        return (
            <div className={`tab-content col-lg-10 col-lg-offset-1 clearfix`}>
                <ReactTable
                    data={this.state.data}
                    loading={this.state.loading}
                    pages={this.state.pages}
                    columns={[
                        {
                            Header: "Response Id",
                            accessor: "id",
                            maxWidth: 150,
                            Cell: row => <a href={`/survey/${ row.original.surveyId }/response/${ row.original.id }`}>{ row.value }</a>,
                            filterMethod: (filter, rows) =>
                                matchSorter(rows, filter.value, { keys: ["id"] }),
                            filterAll: true,
                            Filter: ({ filter, onChange }) => (
                                <input className="form-control input-sm"  onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''}></input>
                            )
                        },
                        {
                            Header: "Customer Contact",
                            accessor: "recipient",
                            id: "recipient",
                            filterMethod: (filter, rows) =>
                                matchSorter(rows, filter.value, { keys: ["recipient"] }),
                            filterAll: true,
                            Filter: ({ filter, onChange }) => (
                                <input className="form-control input-sm"  onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''}></input>
                            )
                        },
                        {
                            Header: "Customer",
                            accessor: "customerCode",
                            id: "customerCode",
                            filterMethod: (filter, rows) =>
                                matchSorter(rows, filter.value, { keys: ["customerCode"] }),
                            filterAll: true,
                            Filter: ({ filter, onChange }) => (
                                <input className="form-control input-sm"  onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''}></input>
                            )
                        },
                        {
                            Header: "Creation Date",
                            accessor: "creationDate",
                            id: "responseDate",
                            maxWidth: 200,
                            Cell: row => {
                                let date  = moment.utc(row.value, 'LLL')
                                date.tz('America/Mexico_City');
                                return date.format("LLL");
                            },
                            filterMethod: (filter, rows) =>
                                matchSorter(rows, filter.value, { keys: ["responseDate"] }),
                            filterAll: true,
                            Filter: ({ filter, onChange }) => (
                                <input className="form-control input-sm"  onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''}></input>
                            )
                        },
                        {
                            Header: "Status",
                            accessor: "status",
                            id: "status",
                            maxWidth: 150,
                            Cell: row => (
                                <span>
                                    <span style={{
                                        color: row.value === 'SUBMITTED' ? '#48b576'
                                            : row.value === 'EXPIRED' ? '#e54949' : '#818a95',
                                        transition: 'all .3s ease',
                                        fontsize: 15
                                    }}> &#x25cf; </span> { row.value }
                                </span>
                            ),
                            getProps: () => {
                                return { style: { textAlign: 'left' } }
                            },
                            filterMethod: (filter, row) => {
                                if (filter.value === "ALL") {
                                    return true;
                                }
                                if (filter.value === "AWAITING") {
                                    return row.status === "AWAITING"
                                }
                                if (filter.value === "AWAITING_EXPIRED") {
                                    return row.status === "AWAITING_EXPIRED"
                                }
                                if (filter.value === "SUBMITTED") {
                                    return row.status === "SUBMITTED"
                                }
                                if (filter.value === "EXPIRED") {
                                    return row.status === "EXPIRED"
                                }
                            },
                            Filter: ({ filter, onChange }) => (
                                <div className="select select-sm">
                                    <select onChange={event => onChange(event.target.value)} value={filter ? filter.value : 'ALL'}>
                                        <option value="ALL">All</option>
                                        <option value="SUBMITTED">Submitted</option>
                                        <option value="AWAITING">Awaiting</option>
                                        <option value="AWAITING_EXPIRED">Awaiting Expired</option>
                                        <option value="EXPIRED">Expired</option>
                                    </select>
                                </div>
                            )
                        }
                    ]}
                    onFetchData={() => {
                        this.setState(() => {
                            let request = new XMLHttpRequest();
                            request.open("GET", path, true);
                            request.send();
                            request.onload = function () {
                                if (request.status === 200) {
                                    let response = JSON.parse(request.responseText);
                                    this.setState({
                                        data: response.dataResponses,
                                        loading: false,
                                    });
                                }
                            }.bind(this);
                            return {loading: true}
                        })
                    }}
                    filterable
                    defaultPageSize={10}
                    className="-striped -highlight"
                />
            </div>
        );
    }
}

ReactDOM.render(<InboxTable/>, document.getElementById('inbox-table'));
