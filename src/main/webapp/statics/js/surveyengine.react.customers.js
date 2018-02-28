/*
    User Interface created with ReactJS to add/edit roles from Customers
    Date:           Winter 2017
    Created by:     Angel Cuenca
*/

'use strict';

const userInterface = SurveyEngine.commons.userInterface;

class CustomersTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            emailUerLogged: ''
        };
    };

    componentDidMount(){
        this.setState((prevState) => {
            let request = new XMLHttpRequest();
            request.open("GET", '/admin/get-all-customers', true);
            request.send();
            request.onload = function() {
                if (request.status === 200) {
                    let response = JSON.parse(request.responseText);
                    //let responseInfo = JSON.stringify(response);

                    //Get current email User from Session
                    let emailUerLogged = JSON.stringify(response.emailUerLogged).substring(1, JSON.stringify(response.emailUerLogged).length - 1);

                    this.setState({
                        data: response.dataCustomers,
                        loading: false,
                        emailUerLogged: emailUerLogged
                    });
                }
            }.bind(this);
            return{loading: true}
        });
    }

    toggleSwitchCustomer = (customerName) => {
        let customer = `?customerName=${encodeURIComponent(customerName)}`;
        this.setState((prevState) => {
            let url = `${'/admin/update/customer'}${customer}`;

            let request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.send();
            request.onload = function() {
                if (request.status === 200) {
                    let response = JSON.parse(request.responseText);
                    //let responseInfo = JSON.stringify(response);

                    this.setState({
                        data: response.dataCustomers,
                        loading: false
                    });

                    userInterface.notify('Customer Catalog', 'Customer '+ customerName + ' updated correctly.', 'success');
                }
            }.bind(this);
            return{loading: true}
        });
    };

    handleDeleteCustomer = (customerName) => {
        //Mount React component in DOM
        ReactDOM.render(<DeleteCustomer customerName={customerName} />, document.getElementById('delete-customer'));

        //Open Modal
        $("#DeleteCustomerModal").modal();
    };

    render() {
        return (
            <div>
                <ReactTable
                    data={this.state.data}
                    filterable
                    columns={[
                        {
                            Header: "Id",
                            id: "id",
                            accessor: d => d.id,
                            filterMethod: (filter, rows) =>
                                matchSorter(rows, filter.value, { keys: ["id"] }),
                            filterAll: true,
                            Filter: ({ filter, onChange }) => (
                                <input className="customer-code-input form-control input-sm" onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            ),
                            maxWidth: 300
                        },
                        {
                            Header: "Name",
                            id: "customerName",
                            accessor: d => d.customerName,
                            filterMethod: (filter, rows) =>
                                matchSorter(rows, filter.value, { keys: ["customerName"] }),
                            filterAll: true,
                            Filter: ({ filter, onChange }) => (
                                <input className="customer-code-input form-control input-sm" onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            )
                        },
                        {
                            Header: "Status",
                            id: "isActive",
                            accessor: "isActive",
                            Cell: row  => {
                                let isChecked = row.value;
                                let idSwitch = "switch-customer-"+row.original.id;

                                return  <div className="row">
                                            <div className="col-lg-12 col-sm-12 pull-center">
                                                <div className="onoffswitch-customer-add mtop-5 pull-left">
                                                    <input id={idSwitch}
                                                           type="checkbox" name="onoffswitch" className="onoffswitch-customer-checkbox-add"
                                                           checked={isChecked}
                                                           onChange={()=>this.toggleSwitchCustomer(row.original.customerName)} />
                                                    <label className="onoffswitch-customer-label-add" htmlFor={idSwitch}>
                                                        <div className="onoffswitch-customer-inner-add"></div>
                                                        <div className="onoffswitch-customer-switch-add"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                            },
                            filterMethod: (filter, row) =>  {
                                if (filter.value === "all") {
                                    return true;
                                }
                                if (filter.value === "active") {
                                    if(row.isActive){
                                        return row;
                                    }
                                }
                                if (filter.value === "inactive") {
                                    if(! row.isActive){
                                        return row;
                                    }
                                }
                            },
                            Filter: ({ filter, onChange }) => (
                                <div className="select select-sm">
                                    <select className="is-active-select" onChange={event => onChange(event.target.value)} value={filter ? filter.value : "all"} >
                                        <option value="all">ALL</option>
                                        <option value="active">ACTIVE</option>
                                        <option value="inactive">INACTIVE</option>
                                    </select>
                                </div>
                            ),
                            maxWidth: 150
                        }/*,
                        {
                            Header: "Actions",
                            accessor: "customerName",
                            Cell: props => {
                                return  <div className="row">
                                            <div className="col-lg-12 col-sm-12 pull-center">
                                                <button className="btn btn-danger" onClick={()=>this.handleDeleteCustomer(props.value)} >
                                                    <span><span className="ion-trash-a"/> Delete</span>
                                                </button>
                                            </div>
                                        </div>
                            },
                            maxWidth: 300,
                            filterable: false
                        } */
                    ]}
                    defaultPageSize={10}
                    className="-striped -highlight"
                />
            </div>
        );
    }
}

class DeleteCustomer extends React.Component {

    deleteCustomer = (result) => {
        if ( result ){
            let formData = new FormData();
            formData.append("customerName", this.props.customerName );

            let request = new XMLHttpRequest();
            request.open("POST", '/admin/remove/customer', true);
            request.send(formData);
            request.onload = function() {
                if (request.status === 200) {
                    if( JSON.parse(request.responseText) === 'success' ){
                        //Hide remove user modal
                        $("#DeleteCustomerModal").modal('hide');

                        //Update table
                        ReactDOM.unmountComponentAtNode(document.getElementById('customers-table'));
                        ReactDOM.render(<CustomersTable/>, document.getElementById('customers-table'));

                        //Shows notification
                        userInterface.notify('Customer Catalog', 'Customer correctly deleted.','success');
                    }else{
                        userInterface.notify('Customer Catalog', 'Error deleting customer.','error');
                    }
                }
            }.bind(this);
        }else{
            $("#DeleteCustomerModal").modal('hide');
        }
    };

    render() {
        let customerName = this.props.customerName;
        return(
            <div className="remove-question">
                <h4> Are you completely sure to delete {customerName} ? </h4>
                <div className="btn-remove-user text-center">
                    <button className="btn-remove-yes" onClick={()=>this.deleteCustomer(true)} >YES</button>
                    <button className="btn-remove-no" onClick={()=>this.deleteCustomer(false)} >NO</button>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<CustomersTable/>, document.getElementById('customers-table'));