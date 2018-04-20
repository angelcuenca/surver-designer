/*
    User Interface created with ReactJS to add/edit/remove Customer / Contact mappings
    Date:           Winter 2017
    Created by:     Angel Cuenca
*/

'use strict';

const userInterface = SurveyEngine.commons.userInterface;

class CustomerContactMap extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dataCustomers: [],
            dataContacts: [],
            dataCustomersSelected: [],
            contactSelected: '',
            customerSelected: '',
            customerPrevious: '',
            contactEmail: ''
        };
    };

    //Method executed after Render
    componentDidMount( ) {

            let request = new XMLHttpRequest();
            request.open("GET", '/admin/get/users-map', true);
            request.send();
            request.onload = function() {
                if (request.status === 200) {
                    let responseUsers = JSON.parse(request.responseText);
                    //let responseInfo = JSON.stringify(response);

                    request.open("GET", '/admin/get/customers-from-star', true);
                    request.send();
                    request.onload = function() {
                        if (request.status === 200) {
                            let responseCustomers = JSON.parse(request.responseText);
                            //let responseInfo = JSON.stringify(response);

                            let customerName = '';
                            let contactName = '';
                            let contactEmail = '';
                            let customerPrevious = '';
                            if( this.props.customerName !== undefined ){
                                customerName = this.props.customerName;
                                customerPrevious = this.props.customerName;
                                contactName = this.props.contactName.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
                                contactEmail = this.props.contactEmail;
                            }

                            this.setState({
                                dataContacts: responseUsers.dataUsers,
                                dataCustomers: responseCustomers,
                                loading: false,
                                customerPrevious: customerPrevious,
                                customerSelected: customerName,
                                contactSelected: contactName,
                                contactEmail: contactEmail
                            });
                        }
                    }.bind(this);
                }
            }.bind(this);
            return{loading: true}

    }

    handleValidationsSubmitMap = () => {
        if( this.props.isEditMap ){
            if(  this.state.customerSelected === this.state.customerPrevious ){
                userInterface.notify('Survey / Group', 'Please select different Group to edit.','notice');

                return false;
            }

        }else{
            if( this.state.contactSelected === '' || this.state.dataCustomersSelected.length === 0 ){
                if( this.state.contactSelected === '' ){
                    userInterface.notify('Survey / Group', 'Please, select at least one Contact.','notice');
                }else{
                    userInterface.notify('Survey / Group', 'Please, select at least one Group.','notice');
                }

                return false;
            }
        }

        return true;
    };

    handleSaveCustomerContact = () =>{

        //Validate select at least one contact and customer to map
        if( this.handleValidationsSubmitMap() ){
            //Check if is Edit or New Mapping
            let url;
            let formData = new FormData();
            if( this.props.isEditMap ){
                url = '/admin/edit/customer/contact/mapping';
                formData.append("customerPrevious", this.state.customerPrevious );
                formData.append("customerSelected", this.state.customerSelected );
            }else{
                url = '/admin/save/customer/contact/mapping';
                formData.append("dataCustomersSelected", this.state.dataCustomersSelected );
            }

            formData.append("contactEmail", this.state.contactEmail );

            let request = new XMLHttpRequest();
            request.open("POST", url, true);
            request.send(formData);
            request.onload = function() {
                if (request.status === 200) {
                    let status = JSON.parse(request.responseText);

                    if( status === 'Mapping correctly saved.' || status === 'Mapping correctly edited.' ){
                        //Hide add/edit user modal
                        $('#AddCustomerContactMapModal').modal('hide');

                        //Shows notification
                        userInterface.notify('Survey / Group', status, 'success');

                        //Returns to child component to update table
                        this.props.onRenderTable();
                    }else{
                        //Hide add/edit user modal
                        $('#AddCustomerContactMapModal').modal('hide');

                        //Shows notification
                        userInterface.notify('Survey / Group', status, 'notice');

                        //Returns to child component to update table
                        this.props.onRenderTable();
                    }
                }
            }.bind(this);
        }
    };

    render(){
        let contactsTable;
        let customersTable;
        if( ! this.props.isEditMap ){
            contactsTable = <div className="col-xs-6">
                                    <div className="text-center">
                                        <label className="uppercase mbottom-10">Contacts</label>
                                    </div>
                                    <ReactTable
                                        data={this.state.dataContacts}
                                        showPageSizeOptions= {false}
                                        filterable
                                        getTrProps={(state, rowInfo) => {
                                            if(rowInfo !== undefined){
                                                return {
                                                    onClick: (e) =>  {
                                                        this.setState({
                                                            contactSelected: rowInfo.row.name,
                                                            contactEmail: rowInfo.original.email
                                                        });
                                                    },
                                                    style: {
                                                        background: rowInfo.row.name === this.state.contactSelected ? '#e2e2e2' : 'white'
                                                    }
                                                }
                                            }else{
                                                return {
                                                    style: {
                                                        background: 'white'
                                                    }
                                                }
                                            }
                                        }}
                                        columns={[
                                            {
                                                Header: "Name",
                                                id: "name",
                                                accessor: d => d.name.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); }),
                                                filterMethod: (filter, rows) =>
                                                    matchSorter(rows, filter.value, { keys: ["name"] }),
                                                filterAll: true,
                                                Filter: ({ filter, onChange }) => (
                                                    <input className="customer-code-input form-control input-sm" placeholder="Filter" onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                                                )
                                            }
                                        ]}
                                        /*onFilteredChange={(column, value) => {
                                            this.setState({
                                                contactSelected: ''
                                            });
                                        }} */
                                        defaultPageSize={10}
                                        className="-striped -highlight"
                                    />
                                </div>;

            customersTable = <div className="col-xs-6">
                                <div className="text-center">
                                    <label className="uppercase mbottom-10">Surveys</label>
                                </div>
                                <ReactTable
                                    data={this.state.dataCustomers}
                                    showPageSizeOptions= {false}
                                    filterable
                                    getTrProps={(state, rowInfo) => {
                                        if(rowInfo !== undefined){
                                            return {
                                                onClick: (e) =>  {
                                                    this.setState({
                                                        dataCustomersSelected: handleClickRow(rowInfo.row.customerName)
                                                    });
                                                },
                                                style: {
                                                    background: handlePrintRow(rowInfo.row.customerName) ? '#e2e2e2' : 'white'
                                                }
                                            }
                                        }else{
                                            return {
                                                style: {
                                                    background: 'white'
                                                }
                                            }
                                        }
                                    }}
                                    columns={[
                                        {
                                            Header: "Name",
                                            id: "customerName",
                                            accessor: d => d.customerName,
                                            filterMethod: (filter, rows) =>
                                                matchSorter(rows, filter.value, { keys: ["customerName"] }),
                                            filterAll: true,
                                            Filter: ({ filter, onChange }) => (
                                                <input className="customer-code-input form-control input-sm" placeholder="Filter" onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                                            )
                                        }
                                    ]}
                                    /*onFilteredChange={(column, value) => {
                                        this.setState({
                                            customerSelected: ''
                                        });
                                    }} */
                                    defaultPageSize={10}
                                    className="-striped -highlight"
                                />
                            </div>;
        }else{
            //Edit Mapping (only customers table is showed)
            customersTable = <div className="col-xs-12">
                                <div className="text-center">
                                    <label className="uppercase mbottom-10">Customers</label>
                                    <div className="col-xs-12">
                                        <div className="col-xs-6">
                                            <h5>Contact: {this.state.contactSelected}</h5>
                                        </div>
                                        <div className="col-xs-6">
                                            <h5>Group selected: {this.state.customerSelected}</h5>
                                        </div>
                                    </div>

                                </div>
                                <ReactTable
                                    data={this.state.dataCustomers}
                                    showPageSizeOptions= {false}
                                    filterable
                                    getTrProps={(state, rowInfo) => {
                                        if(rowInfo !== undefined){
                                            return {
                                                onClick: (e) =>  {
                                                    this.setState({
                                                        customerSelected: rowInfo.row.customerName
                                                    });
                                                },
                                                style: {
                                                    background: rowInfo.row.customerName === this.state.customerSelected ? '#e2e2e2' : 'white'
                                                }
                                            }
                                        }else{
                                            return {
                                                style: {
                                                    background: 'white'
                                                }
                                            }
                                        }
                                    }}
                                    columns={[
                                        {
                                            Header: "Name",
                                            id: "customerName",
                                            accessor: d => d.customerName,
                                            filterMethod: (filter, rows) =>
                                                matchSorter(rows, filter.value, { keys: ["customerName"] }),
                                            filterAll: true,
                                            Filter: ({ filter, onChange }) => (
                                                <input className="customer-code-input form-control input-sm" placeholder="Filter" onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                                            )
                                        }
                                    ]}
                                    /*onFilteredChange={(column, value) => {
                                        this.setState({
                                            customerSelected: ''
                                        });
                                    }} */
                                    defaultPageSize={10}
                                    className="-striped -highlight"
                                />
                            </div>;
        }

        const handleClickRow = ( rowSelected ) =>{
            let customerSelectedList = this.state.dataCustomersSelected;
            let found = false;
            let i;
            for (i = 0; i < customerSelectedList.length; i++){
                if( rowSelected === customerSelectedList[i] ){
                    found = true;
                    break;
                }
            }

            //Add or remove row
            if( ! found ){
                customerSelectedList[customerSelectedList.length] = rowSelected;
            }else{
                customerSelectedList.splice(i, 1);
            }

            return customerSelectedList;
        };

        const handlePrintRow = ( rowSelected ) => {
            let customerSelectedList = this.state.dataCustomersSelected;
            let found = false;
            for (let i = 0; i < customerSelectedList.length; i++){
                if( rowSelected === customerSelectedList[i] ){
                    found = true;
                    break;
                }
            }

            return found;
        };

        return(
            <div>
                <div className="modal-header">
                    <button type="button" id="btn-modal-edit" className="close" data-dismiss="modal" aria-hidden="true"><span className="ion-close-round"></span></button>
                    <h3 className="modal-title uppercase" id="myLargeModalLabel-edit" style={{color: 'white'}}>{this.props.modalTitle}</h3>
                </div>
                <div className="modal-body">
                    <div className="col-sm-12">
                        <div className="col-lg-10 col-lg-offset-1 col-sm-7 col-md-10 col-md-offset-1">
                            <div className="form-group">
                                <div className="form-group">
                                    <div className="row">
                                        { contactsTable }
                                        { customersTable }
                                    </div>
                                    <div className="row">
                                        <div className="input-group">
                                        <span className="input-group-btn">
                                            <button id="user-form" className="btn btn-info btn-search-user pull-right mright-15 mtop-25" onClick={()=>this.handleSaveCustomerContact()} >
                                                <span className="content"><span className="ion-checkmark"/> Save</span>
                                            </button>
                                        </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class CustomerContactTable extends React.Component {
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
            request.open("GET", '/admin/get/customer/contact/mapping', true);
            request.send();
            request.onload = function() {
                if (request.status === 200) {
                    let response = JSON.parse(request.responseText);
                    //let responseInfo = JSON.stringify(response);

                    //Get current email User from Session
                    let emailUerLogged = JSON.stringify(response.emailUerLogged).substring(1, JSON.stringify(response.emailUerLogged).length - 1);

                    this.setState({
                        data: response.dataCustomerContact,
                        loading: false,
                        emailUerLogged: emailUerLogged
                    });
                }
            }.bind(this);
            return{loading: true}
        });
    }

    updateTable = () => {
        this.setState((prevState) => {
            let request = new XMLHttpRequest();
            request.open("GET", '/admin/get/customer/contact/mapping', true);
            request.send();
            request.onload = function() {
                if (request.status === 200) {
                    let response = JSON.parse(request.responseText);
                    //let responseInfo = JSON.stringify(response);

                    //Get current email User from Session
                    let emailUerLogged = JSON.stringify(response.emailUerLogged).substring(1, JSON.stringify(response.emailUerLogged).length - 1);

                    this.setState({
                        data: response.dataCustomerContact,
                        loading: false,
                        emailUerLogged: emailUerLogged
                    });
                }
            }.bind(this);
            return{loading: true}
        })
    };

    handleEditCustomerContactMap = (contactEmail, contactName, customerName) => {
        //Mount React component in DOM
        ReactDOM.render(<CustomerContactMap onRenderTable={this.updateTable} modalTitle={"Edit Survey / Group Map"} isEditMap={true} contactEmail={contactEmail} contactName={contactName} customerName={customerName} />, document.getElementById('add-customer-contact-map'));

        //Open Modal
        $("#AddCustomerContactMapModal").modal();
    };

    handleDeleteCustomerContactMap = (email, customerName) => {
        //Mount React component in DOM
        ReactDOM.render(<DeleteCustomerContactMap contactEmail={email} customerName={customerName} />, document.getElementById('remove-customer-contact-map'));

        //Open Modal
        $("#DeleteCustomerContactMapModal").modal();
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
                            Cell: row => {
                                return <div className="rt-td-custom">{row.value}</div>
                            },
                            filterable: false,
                            maxWidth: 150
                        },
                        {
                            Header: "Survey",
                            id: "contactName",
                            accessor: d => d.contactName.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); }),
                            Cell: row => {
                                return <div className="rt-td-custom">{row.value}</div>
                            },
                            filterMethod: (filter, rows) =>
                                matchSorter(rows, filter.value, { keys: ["contactName"] }),
                            filterAll: true,
                            Filter: ({ filter, onChange }) => (
                                <input className="form-control input-sm"  onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            )
                        },
                        {
                            Header: "Email",
                            accessor: "contactEmail",
                            Cell: row => {
                                return <div className="rt-td-custom">{row.value}</div>
                            },
                            filterMethod: (filter, rows) =>
                                matchSorter(rows, filter.value, { keys: ["contactEmail"] }),
                            filterAll: true,
                            Filter: ({ filter, onChange }) => (
                                <input className="form-control input-sm"  onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            )
                        },
                        {
                            Header: "Group",
                            id: "customerName",
                            accessor: d => d.customerName,
                            Cell: row => {
                                return <div className="rt-td-custom">{row.value}</div>
                            },
                            filterMethod: (filter, rows) =>
                                matchSorter(rows, filter.value, { keys: ["customerName"] }),
                            filterAll: true,
                            Filter: ({ filter, onChange }) => (
                                <input className="form-control input-sm"  onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            )
                        },
                        {
                            Header: "Access",
                            id: "contactRoles",
                            accessor: d => d.contactRoles,
                            Cell: row  => {
                                let rolesList = [];
                                for (let i = 0; i < row.original.contactRoles.length; i++){
                                    let obj = row.original.contactRoles[i];
                                    let attrValue = obj["name"];
                                    rolesList.push(attrValue.replace('ROLE_', ' '));
                                }

                                const optionsRole= rolesList.map((Elem, index) => {
                                    return <div className="rt-td">{Elem}</div>
                                });

                                return <div>{optionsRole}</div>;
                            },
                            filterMethod: (filter, row) =>  {
                                let rolesList = [];
                                for (let i = 0; i < row.contactRoles.length; i++){
                                    let obj = row.contactRoles[i];
                                    let attrValue = obj["name"];
                                    rolesList.push(attrValue);
                                }

                                if (filter.value === "all") {
                                    return true;
                                } else if (filter.value === "admin") {
                                    if(rolesList.join('').indexOf("ADMIN") !== -1){
                                        return row;
                                    }
                                } else if (filter.value === "executive") {
                                    if(rolesList.join('').indexOf("EXECUTIVE") !== -1){
                                        return row;
                                    }
                                } else if (filter.value === "taker") {
                                    if(rolesList.join('').indexOf("TAKER") !== -1){
                                        return row;
                                    }
                                } else if (filter.value === "reportee") {
                                    if(rolesList.join('').indexOf("OTHER_REPORTEE") !== -1){
                                        return row;
                                    }
                                }
                            },
                            Filter: ({ filter, onChange }) => (
                                <div className="select select-sm">
                                    <select onChange={event => onChange(event.target.value)} value={filter ? filter.value : 'all'}>
                                        <option value="all">ALL</option>
                                        <option value="admin">ADMIN</option>
                                        <option value="executive">EXECUTIVE</option>
                                        <option value="taker">TAKER</option>
                                        <option value="reportee">OTHER REPORTEE</option>
                                    </select>
                                </div>
                            )
                        },
                        {
                            Header: "Actions",
                            accessor: "contactEmail",
                            Cell: props => {
                                return  <div className="row rt-td-custom">
                                            <div className="col-lg-6 col-sm-12 text-right">
                                                <button className="btn btn-success btn-edit-circle" onClick={()=>this.handleEditCustomerContactMap(props.value, props.original.contactName, props.original.customerName)} >
                                                    <span><span className="ion-edit" style={{color: '#ffffff'}}/> </span>
                                                </button>
                                            </div>
                                            <div className="col-lg-6 col-sm-12 text-left">
                                                <button className="btn btn-danger btn-delete-circle" onClick={()=>this.handleDeleteCustomerContactMap(props.value, props.original.customerName)} >
                                                    <span><span className="ion-trash-a"/> </span>
                                                </button>
                                            </div>
                                        </div>
                            },
                            maxWidth: 300,
                            filterable: false
                        }
                    ]}
                    defaultPageSize={10}
                    className="-striped -highlight"
                />
            </div>
        );
    }
}

class ButtonAddMapping extends React.Component {

    updateTable = () => {
        //To re-render Customer Contacts table (un mounting and mounting component)
        //Because there are no parent components
        ReactDOM.unmountComponentAtNode(document.getElementById('customer-contact-table'));
        ReactDOM.render(<CustomerContactTable/>, document.getElementById('customer-contact-table'));

        //Unmount Modal Map
        ReactDOM.unmountComponentAtNode(document.getElementById('add-customer-contact-map'));
    };

    modalAddMapping = () => {
        //Open Modal
        $("#AddCustomerContactMapModal").modal();

        //Mount component User
        ReactDOM.render(<CustomerContactMap isEditMap={false} modalTitle={"New Survey / Group Map"} onRenderTable={this.updateTable} />, document.getElementById('add-customer-contact-map'));
    };

    render() {
        return(
            <div>
                <button type="submit" onClick={()=>this.modalAddMapping()} className="btn btn-success btn-lg btn-block navbar-btn uppercase text-bold btn-loading" >
                    <span className="content visible-lg"><span className="ion-plus-circled"></span> ADD MAPPING</span>
                </button>
            </div>
        )
    }
}

class DeleteCustomerContactMap extends React.Component {

    removeMapping = (result) => {
        if ( result ){
            let formData = new FormData();
            formData.append("contactEmail", this.props.contactEmail );
            formData.append("customerName", this.props.customerName );

            let request = new XMLHttpRequest();
            request.open("POST", '/admin/delete/customer/contact/mapping', true);
            request.send(formData);
            request.onload = function() {
                if (request.status === 200) {
                    let status = JSON.parse(request.responseText);

                    //Hide remove user modal
                    $("#DeleteCustomerContactMapModal").modal('hide');

                    //Re-render table
                    ReactDOM.unmountComponentAtNode(document.getElementById('customer-contact-table'));
                    ReactDOM.render(<CustomerContactTable/>, document.getElementById('customer-contact-table'));

                    //Shows notification
                    userInterface.notify('Survey / Group', status, 'success');
                }
            }.bind(this);
        }else{
            $("#DeleteCustomerContactMapModal").modal('hide');
        }
    };

    render() {
        let userName = this.props.contactEmail.replace('.', ' ').replace('@sanmina.com', '').replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
        return(
            <div className="remove-question">
                <h4> Are you completely sure to delete map {userName} / {this.props.customerName} ? </h4>
                <div className="btn-remove-user text-center">
                    <button className="btn-remove-yes" onClick={()=>this.removeMapping(true)} >YES</button>
                    <button className="btn-remove-no" onClick={()=>this.removeMapping(false)} >NO</button>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<ButtonAddMapping/>, document.getElementById('btn-add-mapping'));

ReactDOM.render(<CustomerContactTable/>, document.getElementById('customer-contact-table'));