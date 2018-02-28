/*
    User Interface created with ReactJS to add/edit/remove Customer External Rating
    Date:           Winter 2017
    Created by:     Angel Cuenca
*/

'use strict';

const userInterface = SurveyEngine.commons.userInterface;

class CustomerExternalRating extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            month: 'January',
            year: '',
            customerList: [],
            customerSelected: '',
            ratingType: 'CSS',
            rating: '',
            ratingPeriod: ''
        };
    };

    //Method executed after Render
    componentDidMount( ) {
        //Get Customers from Customer Catalog
        this.setState((prevState) => {
            let request = new XMLHttpRequest();
            request.open("GET", '/admin/get-all-customers', true);
            request.send();
            request.onload = function() {
                if (request.status === 200) {
                    let responseCustomers = JSON.parse(request.responseText);
                    responseCustomers = JSON.stringify(responseCustomers.dataCustomers);

                    //Iterate JSON
                    let customerList = [];
                    $(jQuery.parseJSON(responseCustomers)).each(function(index) {
                        customerList[index] = this.customerName;
                    });


                    //Set properties if is Edit Customer External Rating
                    if( this.props.isEdit ){
                        let request = new XMLHttpRequest();
                        let formData = new FormData();
                        formData.append("customer", this.props.customerName );
                        request.open("POST", '/admin/get/one/customer-external-rating', true);
                        request.send(formData);
                        request.onload = function() {
                            if (request.status === 200) {
                                let responseCustomer = JSON.parse(request.responseText);

                                this.setState({
                                    month: responseCustomer.month,
                                    year: responseCustomer.year,
                                    customerList: customerList,
                                    customerSelected: responseCustomer.customer,
                                    ratingType: responseCustomer.ratingType,
                                    rating: responseCustomer.rating,
                                    ratingPeriod: responseCustomer.ratingPeriod
                                });
                            }
                        }.bind(this);
                    }else{
                        this.setState({
                            customerList: customerList
                        });
                    }
                }
            }.bind(this);
            return{loading: true}
        });
    }

    validateFormRating = () => {
        let regexYear = '^[12][0-9]{3}$';
        let regexRating = '^(100(\\.0{1,2})?|([0-9]?[0-9](\\.[0-9]{1,2})))$';
        let regexRatingPeriod = '^(Q[1-4][1-9][0-9])$';

        if(! this.state.year.match(regexYear) ){
            userInterface.notify('Customer External Rating', 'Please set a valid year.','notice');
            return false;
        }else if( this.state.customerSelected === '' ){
            userInterface.notify('Customer External Rating', 'Please select a Customer.','notice');
            return false;
        }else if(! this.state.rating.match(regexRating) ){
            userInterface.notify('Customer External Rating', 'Please set a valid rating.','notice');
            return false;
        }else if(! this.state.ratingPeriod.match(regexRatingPeriod) ){
            userInterface.notify('Customer External Rating', 'Please set a valid rating period.','notice');
            return false;
        }

        return true;

    };

    handleSaveCustomerExternalRating = () =>{

        if( this.validateFormRating() ){
            let url;
            let formData = new FormData();

            if(this.props.isEdit){
                url = '/admin/update/customer-external-rating';
            }else{
                url = '/admin/save/customer-external-rating';
            }

            formData.append("month", this.state.month );
            formData.append("year", this.state.year );
            formData.append("customer", this.state.customerSelected );
            formData.append("ratingType", this.state.ratingType );
            formData.append("rating", this.state.rating );
            formData.append("ratingPeriod", this.state.ratingPeriod );

            let request = new XMLHttpRequest();
            request.open("POST", url, true);
            request.send(formData);
            request.onload = function() {
                if (request.status === 200) {
                    let status = JSON.parse(request.responseText);

                    if(status !== 'Customer External Rating is already created.'){
                        //Hide add/edit user modal
                        $('#AddCustomerExternalRating').modal('hide');

                        //Shows notification
                        userInterface.notify(this.state.customerSelected, status, 'success');

                        //Returns to child component to update table
                        this.props.onRenderTable();
                    }else{
                        //Shows notification
                        userInterface.notify(this.state.customerSelected, status, 'notice');
                    }
                }
            }.bind(this);
        }
    };

    render(){
        //Generate options for Customer List
        const customerList = this.state.customerList.map((Elem) => {
            return <option>{Elem}</option>
        });

        let customerSelect;
        if(!this.props.isEdit){
            customerSelect =  <label className="field-external-rating col-xs-12">
                                <div className="col-xs-6 col-xs-12"><h5>Customer</h5></div>
                                <div className="col-xs-6 col-xs-12 select-external-rating">
                                    <div className="select select-md">
                                        <select className="col-xs-6" type="text" value={this.state.customerSelected} onChange={(event) => this.setState({ customerSelected: event.target.value })}>
                                            <option>Select...</option>
                                            {customerList}
                                        </select>
                                    </div>
                                </div>
                            </label>
        }

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
                                        <div className="col-xs-12">
                                            <form className="mtop-20">
                                                <label className="field-external-rating col-xs-12">
                                                    <div className="col-xs-6"><h5>Month</h5></div>
                                                    <div className="col-xs-6 select-external-rating">
                                                        <div className="select select-md">
                                                            <select type="text" value={this.state.month} onChange={(event) => this.setState({ month: event.target.value })} >
                                                                <option>January</option>
                                                                <option>February</option>
                                                                <option>March</option>
                                                                <option>April</option>
                                                                <option>May</option>
                                                                <option>June</option>
                                                                <option>July</option>
                                                                <option>August</option>
                                                                <option>September</option>
                                                                <option>October</option>
                                                                <option>November</option>
                                                                <option>December</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </label>
                                                <label className="field-external-rating col-xs-12">
                                                    <div className="col-md-6 col-xs-12"><h5>Year</h5></div>
                                                    <div className="col-xs-6 col-xs-12 select-external-rating">
                                                        <input className="input form-control" type="text" maxLength={4} value={this.state.year} placeholder="2017" onChange={(event) => this.setState({ year: event.target.value })} />
                                                    </div>
                                                </label>
                                                {customerSelect}
                                                <label className="field-external-rating col-xs-12">
                                                    <div className="col-xs-6 col-xs-12"><h5>Rating Type</h5></div>
                                                    <div className="col-xs-6 col-xs-12 select-external-rating">
                                                        <input className="input form-control" type="text" value={this.state.ratingType} disabled={true} />
                                                    </div>
                                                </label>
                                                <label className="field-external-rating col-xs-12">
                                                    <div className="col-xs-6 col-xs-12"><h5>Rating</h5></div>
                                                    <div className="col-xs-6 col-xs-12 select-external-rating">
                                                        <input className="input form-control" type="text" value={this.state.rating} placeholder="95.7" onChange={(event) => this.setState({ rating: event.target.value })} />
                                                    </div>
                                                </label>
                                                <label className="field-external-rating col-xs-12">
                                                    <div className="col-xs-6 col-xs-12"><h5>Rating Period</h5></div>
                                                    <div className="col-xs-6 col-xs-12 select-external-rating">
                                                        <input className="input form-control" type="text" maxLength={4} value={this.state.ratingPeriod} placeholder="Q117" onChange={(event) => this.setState({ ratingPeriod: event.target.value.toUpperCase() })} />
                                                    </div>
                                                </label>
                                                <br />
                                            </form>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-group">
                                        <span className="input-group-btn">
                                            <button className="btn btn-info btn-search-user pull-right mright-15 mtop-25" onClick={()=>this.handleSaveCustomerExternalRating()} >
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

class CustomerExternalRatingTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true
        };
    };

    componentDidMount(){
        this.setState((prevState) => {
            let request = new XMLHttpRequest();
            request.open("GET", '/admin/get/all/customer-external-rating', true);
            request.send();
            request.onload = function() {
                if (request.status === 200) {
                    let response = JSON.parse(request.responseText);
                    //let responseInfo = JSON.stringify(response);

                    this.setState({
                        data: response,
                        loading: false
                    });
                }
            }.bind(this);
            return{loading: true}
        });
    }

    updateTable = () => {
        this.setState((prevState) => {
            let request = new XMLHttpRequest();
            request.open("GET", '/admin/get/all/customer-external-rating', true);
            request.send();
            request.onload = function() {
                if (request.status === 200) {
                    let response = JSON.parse(request.responseText);
                    //let responseInfo = JSON.stringify(response);

                    this.setState({
                        data: response,
                        loading: false
                    });
                }
            }.bind(this);
            return{loading: true}
        })
    };

    handleEditCustomerExternalRating = (customerName) => {
        //Mount React component in DOM
        ReactDOM.render(<CustomerExternalRating onRenderTable={this.updateTable} modalTitle={"Edit Customer External Rating"} customerName={customerName} isEdit={true} />, document.getElementById('add-customer-external-rating'));

        //Open Modal
        $("#AddCustomerExternalRating").modal();
    };

    handleDeleteCustomerExternalRating = (customerName) => {
        //Mount React component in DOM
        ReactDOM.render(<DeleteCustomerExternalRating customerName={customerName} />, document.getElementById('remove-customer-external-rating'));

        //Open Modal
        $("#DeleteCustomerExternalRatingModal").modal();
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
                            filterable: false,
                            maxWidth: 150
                        },
                        {
                            Header: "Month",
                            id: "month",
                            accessor: d => d.month,
                            filterMethod: (filter, rows) =>
                                matchSorter(rows, filter.value, { keys: ["month"] }),
                            filterAll: true,
                            Filter: ({ filter, onChange }) => (
                                <input className="form-control input-sm"  onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            )
                        },
                        {
                            Header: "Year",
                            accessor: "year",
                            filterMethod: (filter, rows) =>
                                matchSorter(rows, filter.value, { keys: ["year"] }),
                            filterAll: true,
                            Filter: ({ filter, onChange }) => (
                                <input className="form-control input-sm"  onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            )
                        },
                        {
                            Header: "Customer",
                            id: "customer",
                            accessor: d => d.customer,
                            filterMethod: (filter, rows) =>
                                matchSorter(rows, filter.value, { keys: ["customer"] }),
                            filterAll: true,
                            Filter: ({ filter, onChange }) => (
                                <input className="form-control input-sm"  onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            )
                        },
                        {
                            Header: "Rating Type",
                            id: "ratingType",
                            accessor: d => d.ratingType,
                            filterMethod: (filter, rows) =>
                                matchSorter(rows, filter.value, { keys: ["ratingType"] }),
                            filterAll: true,
                            Filter: ({ filter, onChange }) => (
                                <input className="form-control input-sm"  onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            )
                        },
                        {
                            Header: "Rating",
                            id: "rating",
                            accessor: d => d.rating,
                            filterMethod: (filter, rows) =>
                                matchSorter(rows, filter.value, { keys: ["rating"] }),
                            filterAll: true,
                            Filter: ({ filter, onChange }) => (
                                <input className="form-control input-sm"  onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            )
                        },
                        {
                            Header: "Rating Period",
                            id: "ratingPeriod",
                            accessor: d => d.ratingPeriod,
                            filterMethod: (filter, rows) =>
                                matchSorter(rows, filter.value, { keys: ["ratingPeriod"] }),
                            filterAll: true,
                            Filter: ({ filter, onChange }) => (
                                <input className="form-control input-sm"  onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            )
                        },
                        {
                            Header: "Actions",
                            accessor: "customer",
                            Cell: props => {
                                return  <div className="row">
                                    <div className="col-lg-6 col-sm-12 text-right">
                                        <button className="btn btn-success btn-edit-circle" onClick={()=>this.handleEditCustomerExternalRating(props.value)} >
                                            <span><span className="ion-edit" style={{color: '#ffffff'}}/> </span>
                                        </button>
                                    </div>
                                    <div className="col-lg-6 col-sm-12 text-left">
                                        <button className="btn btn-danger btn-delete-circle" onClick={()=>this.handleDeleteCustomerExternalRating(props.value)} >
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

class ButtonAddCustomerExternalRating extends React.Component {

    updateTable = () => {
        //To re-render Customer External Rating (un mounting and mounting component)
        //Because there are no parent components
        ReactDOM.unmountComponentAtNode(document.getElementById('customer-external-rating-table'));
        ReactDOM.render(<CustomerExternalRatingTable/>, document.getElementById('customer-external-rating-table'));

        //Unmount Modal Map
        ReactDOM.unmountComponentAtNode(document.getElementById('add-customer-external-rating'));
    };

    modalAddCustomerExternalRating = () => {
        //Open Modal
        $("#AddCustomerExternalRating").modal();

        //Mount component Customer External Rating
        ReactDOM.render(<CustomerExternalRating isEdit={false} modalTitle={"New Customer External Rating"} onRenderTable={this.updateTable} />, document.getElementById('add-customer-external-rating'));
    };

    render() {
        return(
            <div>
                <button type="submit" onClick={()=>this.modalAddCustomerExternalRating()} className="btn btn-success btn-lg btn-block navbar-btn uppercase text-bold btn-loading" >
                    <span className="content"><span className="ion-plus-circled"></span> ADD RATING</span>
                </button>
            </div>
        )
    }
}

class DeleteCustomerExternalRating extends React.Component {

    removeCustomerExternalRating = (result) => {
        if ( result ){
            let formData = new FormData();
            formData.append("customer", this.props.customerName );

            let request = new XMLHttpRequest();
            request.open("POST", '/admin/remove/customer-external-rating', true);
            request.send(formData);
            request.onload = function() {
                if (request.status === 200) {
                    let status = JSON.parse(request.responseText);

                    //Hide remove modal
                    $("#DeleteCustomerExternalRatingModal").modal('hide');

                    //Re-render table
                    ReactDOM.unmountComponentAtNode(document.getElementById('customer-external-rating-table'));
                    ReactDOM.render(<CustomerExternalRatingTable/>, document.getElementById('customer-external-rating-table'));

                    //Shows notification
                    userInterface.notify('Customer / Contact', status, 'success');

                }
            }.bind(this);
        }else{
            $("#DeleteCustomerExternalRatingModal").modal('hide');
        }
    };

    render() {
        return(
            <div className="remove-question">
                <h4> Are you completely sure to delete Customer External Rating from {this.props.customerName} ? </h4>
                <div className="btn-remove-user text-center">
                    <button className="btn-remove-yes" onClick={()=>this.removeCustomerExternalRating(true)} >YES</button>
                    <button className="btn-remove-no" onClick={()=>this.removeCustomerExternalRating(false)} >NO</button>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<ButtonAddCustomerExternalRating/>, document.getElementById('btn-add-customer-external-rating'));

ReactDOM.render(<CustomerExternalRatingTable/>, document.getElementById('customer-external-rating-table'));