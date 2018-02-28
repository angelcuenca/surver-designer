/**
 * Created by arlette_parra on 17/19/11.
 */
class DashboardTable extends React.Component {
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
        const path = '/dashboard/get/surveys'

        return (
            <div className={`tab-content col-lg-10 col-lg-offset-1 clearfix`}>
                <ReactTable
                    data={this.state.data}
                    loading={this.state.loading}
                    pages={this.state.pages}
                    columns={[
                        {
                            Header: "Survey Name",
                            accessor: "name",
                            id: "name",
                            Cell: row => <a href={`/survey/${ row.original.id }`}>{ row.value }</a>,
                            filterMethod: (filter, rows) =>
                                matchSorter(rows, filter.value, { keys: ["name"] }),
                            filterAll: true,
                            Filter: ({ filter, onChange }) => (
                                <input className="form-control input-sm"  onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''}></input>
                            )
                        },
                        {
                            Header: "Created By",
                            accessor: "createdBy",
                            id: "id",
                            filterMethod: (filter, rows) =>
                                matchSorter(rows, filter.value, { keys: ["id"] }),
                            filterAll: true,
                            Filter: ({ filter, onChange }) => (
                                <input className="form-control input-sm"  onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''}></input>
                            )
                        },
                        {
                            Header: "Creation Date",
                            accessor: "creationDate",
                            id: "creationDate",
                            maxWidth: 200,
                            filterMethod: (filter, rows) =>
                                matchSorter(rows, filter.value, { keys: ["creationDate"] }),
                            filterAll: true,
                            Filter: ({ filter, onChange }) => (
                                <input className="form-control input-sm"  onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''}></input>
                            )
                        },
                        {
                            Header: "Status",
                            accessor: "status",
                            id: "status",
                            maxWidth: 100,
                            Cell: row => (
                                <span>
                                    <span style={{
                                        color: row.value === 'PUBLISHED' ? '#33b5e5'
                                            : row.value === 'CANCELED' ? '#ff6262'
                                                : '#818a95',
                                        transition: 'all .3s ease',
                                        fontsize: 15
                                    }}> &#x25cf; </span> { row.value.substr() }
                                </span>
                            ),
                            getProps: () => {
                                return { style: { textAlign: 'left' } }
                            },
                            filterMethod: (filter, row) => {
                                if (filter.value === "ALL") {
                                    return true;
                                }
                                if (filter.value === "DRAFT") {
                                    return row.status === "DRAFT"
                                }
                                if (filter.value === "PUBLISHED") {
                                    return row.status === "PUBLISHED";
                                }
                                return row.status === "CANCELED"
                            },
                            Filter: ({ filter, onChange }) => (
                                <div className="select select-sm">
                                    <select className="is-active-select" onChange={event => onChange(event.target.value)} value={filter ? filter.value : "ALL"}>
                                        <option value="ALL">All</option>
                                        <option value="DRAFT">Draft</option>
                                        <option value="PUBLISHED">Published</option>
                                        <option value="CANCELED">Canceled</option>
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
                                        data: response.dataSurveys,
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

ReactDOM.render(<DashboardTable/>, document.getElementById('dashboard-table'));
