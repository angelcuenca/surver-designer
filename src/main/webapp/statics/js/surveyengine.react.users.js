/*
    User Interface created with ReactJS to add/edit/remove roles from User (Contact)
    Date:           Winter 2017
    Created by:     Angel Cuenca
*/

'use strict';

const userInterface = SurveyEngine.commons.userInterface;

class User extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            emailUserLogged: '',
            username: '',
            accessSelected: '',
            accessList: []
        };
    };

    //Method executed after Render
    componentDidMount( ) {
        //Hide roles multiselect
        $(".multiselect-roles").hide();

        let emailUserLogged = $('#emailUserLogged').val();
        this.setState({
            emailUserLogged: emailUserLogged
        });

        //Get All access name
        let accessList = $('#listRoles').val();
        let accessSelect = [];
        $(jQuery.parseJSON(accessList)).each(function(index) {
            if( this.name !== 'ROLE_ADMIN' ){
                accessSelect[accessSelect.length] = this.name.replace('ROLE_', '').replace(new RegExp('_', 'g'), ' ');
            }
        });

        this.setState({
            accessList: accessSelect
        });

        //Set email if comes from Edit User
        if(this.props.emailUser !== ''){
            this.setState({
                email: this.props.emailUser
            }, () => {
                this.handleSearchUser();
            });
        }
    }

    handleSearchAgain = () => {
        //Hide roles multiselect and set empty states
        $(".multiselect-roles").hide('slow');
        $('#email-user').prop('readonly', false);

        this.setState({
            username: '',
            accessSelected: ''
        });
    };

    handleSearchUserByEnter = (e) => {
        //Checks if input enter was pressed
        if( e.keyCode == 13 ){
            //Call function
            this.handleSearchUser();
        }
    };

    handleSearchUser = () => {
        let regexEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@sanmina.com$/;
        let emailUser = this.state.email;

        if( emailUser === '' || !regexEmail.test(emailUser) || emailUser === this.state.emailUserLogged ){
            if( emailUser === ''){
                userInterface.notify('Access Contact', 'Please set an email to find Contact.','notice');
            }else if( emailUser === this.state.emailUserLogged ){
                userInterface.notify('Access Contact', 'You cannot search your own email.','notice');
            }else{
                userInterface.notify('Access Contact', 'There is not a valid email.','notice');
            }
        }else{
            //Call Google Directory (surveyengine.google.directory.js)
            gapi.client.directory.users.list({
                'domain': 'sanmina.com',
                'query': emailUser,
                'orderBy': 'email',
                'viewType': 'domain_public'
            }).then(function(response) {
                let users = response.result.users;

                if ( users && users.length > 0 ) {
                    let user = users[0];

                    let formData = new FormData();
                    formData.append("userEmail", user.primaryEmail );
                    let request = new XMLHttpRequest();
                    request.open("POST", '/admin/find/user', true);
                    request.send(formData);
                    request.onload = function() {
                        if (request.status === 200) {
                            let response = JSON.parse(request.responseText);

                            let accessSaved = '';
                            if( response !== "null" ){
                                accessSaved = response.replace('ROLE_', '').replace(new RegExp('_', 'g'), ' ');
                            }

                            //Set data
                            this.setState({
                                username: user.name.fullName,
                                accessSelected: accessSaved
                            });
                        }
                    }.bind(this);
                } else {
                    userInterface.notify('Contact Catalog', 'User not found in Sanmina directory.','notice');
                }
            }.bind(this));
        }//end if validation (correct email)

    };

    handleSaveContact = () =>{

        //Validate multi select contains at least one role
        if( this.state.accessSelected !== '' ){
            if( this.state.email !== '' ){
                let formData = new FormData();
                formData.append("userEmail", this.state.email );
                formData.append("userFullName", this.state.username );
                let accessUser = this.state.accessSelected;
                if( accessUser === 'TAKER'  ){
                    accessUser = 'ROLE_TAKER'
                }else if( accessUser === 'EXECUTIVE' ){
                    accessUser = 'ROLE_EXECUTIVE'
                }else{
                    accessUser = 'ROLE_OTHER_REPORTEE'
                }
                formData.append("accessUser",  accessUser);

                let request = new XMLHttpRequest();
                request.open("POST", '/admin/save/user', true);
                request.send(formData);
                request.onload = function() {
                    if (request.status === 200) {
                        if( JSON.parse(request.responseText) === 'success' ){
                            //Hide add/edit user modal
                            $('#EditContactModal').modal('hide');

                            //Returns to child component to update table
                            this.props.onRenderTable();

                            //Shows notification
                            userInterface.notify('Role User', 'Contact ' + this.state.username + ' saved.','success');
                        }else{
                            userInterface.notify('Role User', 'Error.','error');
                        }
                    }
                }.bind(this);
            }else{
                userInterface.notify('Access Contact', 'Please, set an email to find a User.','notice');
            }
        }else{
            userInterface.notify('Access Contact', 'Please, select at least one role.','notice');
        }
    };

    render(){
        //Generate options for Access List
        const accessList = this.state.accessList.map((Elem) => {
            return <option>{Elem}</option>
        });

        let buttonFindUser;
        let btnSaveContact;
        if( this.state.username !== '' ){
            $(".multiselect-roles").show('slow');
            $('#email-user').prop('readonly', true);

            if( this.props.modalTitle !== 'Edit contact' ){
                buttonFindUser = <button id="user-form" className="btn btn-info btn-search-user pull-right mleft-10" onClick={()=>this.handleSearchAgain()} >
                                    <span className="content"><span className="ion-search"/> New Search</span>
                                </button>;
            }

            btnSaveContact = <button id="user-form" className="btn btn-info btn-search-user pull-right mtop-20 mleft-10" onClick={()=>this.handleSaveContact()} >
                                <span className="content"><span className="ion-checkmark"/> Save</span>
                            </button>;

        }else{
            buttonFindUser = <button id="user-form" className="btn btn-info btn-search-user pull-right mleft-10" onClick={()=>this.handleSearchUser()} >
                                <span className="content"><span className="ion-search"/> Search</span>
                            </button>;
        }

        return(
            <div>
                <div className="modal-header">
                    <button type="button" id="btn-modal-edit" className="close" data-dismiss="modal" aria-hidden="true"><span className="ion-close-round"></span></button>
                    <h3 className="modal-title uppercase" id="myLargeModalLabel-edit" style={{color: 'white'}}>{ this.props.modalTitle }</h3>
                </div>
                <div className="modal-body">
                    <div className="col-sm-12">
                        <div className="col-lg-10 col-lg-offset-1 col-sm-7 col-md-10 col-md-offset-1">
                            <div className="form-group">
                                <div className="row">
                                    <label className="uppercase mleft-15 mbottom-15">Email</label>
                                    <div className="input-group col-lg-12 col-sm-6">
                                        <div className="col-lg-10 col-sm-10">
                                            <input type="text" id="email-user" name="email-user" className="form-control"
                                                   placeholder="username@sanmina.com" autoComplete="off" maxLength="50"
                                                   value={this.state.email}
                                                   onChange={(event) => this.setState({ email: event.target.value.toLowerCase() })}
                                                   onKeyDown={this.handleSearchUserByEnter} />
                                        </div>
                                        <div className="col-lg-2 col-sm-2">
                                            <span className="input-group-btn">
                                                {buttonFindUser}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="multiselect-roles form-group mtop-25">
                                    <label className="uppercase">Access</label>
                                    <div className="row">
                                        <label className="field-external-rating col-xs-10">
                                            <div className="select select-md">
                                                <select className="col-xs-12" type="text" value={this.state.accessSelected} onChange={(event) => this.setState({ accessSelected: event.target.value })}>
                                                    <option>Select...</option>
                                                    {accessList}
                                                </select>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <div className="btn-save-contact form-group">
                                    <div className="input-group">
                                        <span className="input-group-btn">
                                            {btnSaveContact}
                                        </span>
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

class UsersTable extends React.Component {
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
            request.open("GET", '/admin/get/users', true);
            request.send();
            request.onload = function() {
                if (request.status === 200) {
                    let response = JSON.parse(request.responseText);
                    //let responseInfo = JSON.stringify(response);

                    //Get current email User from Session
                    let emailUerLogged = JSON.stringify(response.emailUerLogged).substring(1, JSON.stringify(response.emailUerLogged).length - 1);

                    this.setState({
                        data: response.dataUsers,
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
            request.open("GET", '/admin/get/users', true);
            request.send();
            request.onload = function() {
                if (request.status === 200) {
                    let response = JSON.parse(request.responseText);
                    //let responseInfo = JSON.stringify(response);

                    this.setState({
                        data: response.dataUsers,
                        loading: false
                    });
                }
            }.bind(this);
            return{loading: true}
        })
    };

    handleEditUser = (email) => {
        //Mount React component in DOM
        ReactDOM.render(<User onRenderTable={this.updateTable} modalTitle={'Edit contact'} emailUser={email} />, document.getElementById('edit-user'));

        //Open Modal
        $("#EditContactModal").modal();
    };

    handleDeleteUser = (email) => {
        //Mount React component in DOM
        ReactDOM.render(<RemoveUser onRenderTable={this.updateTable} emailUser={email} />, document.getElementById('remove-user'));

        //Open Modal
        $("#RemoveContactModal").modal();
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
                            filterMethod: (filter, rows) =>
                                matchSorter(rows, filter.value, { keys: ["id"] }),
                            filterAll: true,
                            defaultSortDesc: true,
                            Filter: ({ filter, onChange }) => (
                                <input className="form-control input-sm"  onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            ),
                            maxWidth: 150
                        },
                        {
                            Header: "Name",
                            id: "name",
                            accessor: d => d.name.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); }),
                            Cell: row => {
                                return <div className="rt-td-custom">{row.value}</div>
                            },
                            filterMethod: (filter, rows) =>
                                matchSorter(rows, filter.value, { keys: ["name"] }),
                            filterAll: true,
                            Filter: ({ filter, onChange }) => (
                                <input className="form-control input-sm"  onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            )
                        },
                        {
                            Header: "Email",
                            accessor: "email",
                            Cell: row => {
                                return <div className="rt-td-custom">{row.value}</div>
                            },
                            filterMethod: (filter, rows) =>
                                matchSorter(rows, filter.value, { keys: ["email"] }),
                            filterAll: true,
                            Filter: ({ filter, onChange }) => (
                                <input className="form-control input-sm"  onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            )
                        },
                        {
                            Header: "Access",
                            id: "roles",
                            accessor: d => d.roles,
                            Cell: row  => {
                                let rolesList = [];
                                for (let i = 0; i < row.original.roles.length; i++){
                                    let obj = row.original.roles[i];
                                    let attrValue = obj["name"];
                                    rolesList.push(attrValue.replace('ROLE_', '').replace(new RegExp('_', 'g'), ' '));
                                }

                                const optionsRole= rolesList.map((Elem, index) => {
                                    return <div className="rt-td">{Elem}</div>
                                });

                                return <div>{optionsRole}</div>;
                            },
                            filterMethod: (filter, row) =>  {
                                let rolesList = [];
                                for (let i = 0; i < row.roles.length; i++){
                                    let obj = row.roles[i];
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
                                    if(rolesList.join('').indexOf("REPORTEE") !== -1){
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
                            accessor: "email",
                            Cell: row => {
                                //Remove Delete button when is your own session
                                let btnEditDeleteUser;
                                let rolesList = [];
                                for (let i = 0; i < row.original.roles.length; i++){
                                    let obj = row.original.roles[i];
                                    let attrValue = obj["name"];
                                    rolesList.push(attrValue);
                                }
                                if( (rolesList.join('').indexOf("ADMIN") === -1) ){
                                    btnEditDeleteUser = <div>
                                                        <div className="col-lg-6 col-sm-12 text-right">
                                                            <button className="btn btn-success btn-edit-circle" onClick={()=>this.handleEditUser(row.original.email)} >
                                                                <span><span className="ion-edit" style={{color: '#ffffff'}}/> </span>
                                                            </button>
                                                        </div>
                                                        <div className="col-lg-6 col-sm-12 text-left">
                                                            <button className="btn btn-danger btn-delete-circle" onClick={()=>this.handleDeleteUser(row.original.email)} >
                                                                <span><span className="ion-trash-a"/> </span>
                                                            </button>
                                                        </div>
                                                    </div>;
                                }

                                return  <div className="row rt-td-custom">
                                            {btnEditDeleteUser}
                                        </div>
                            },
                            maxWidth: 150,
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

class BtnAddUser extends React.Component {

    updateTable = () => {
        //To re-render Contacts table (un mounting and mounting component)
        //Because there are no parent components
        ReactDOM.unmountComponentAtNode(document.getElementById('users-table'));
        ReactDOM.render(<UsersTable/>, document.getElementById('users-table'));
    };

    modalAddUser = () => {
        //Open Modal
        $("#EditContactModal").modal();

        //Mount component User
        ReactDOM.render(<User onRenderTable={this.updateTable} modalTitle={'Add contact'} emailUser={''} />, document.getElementById('edit-user'));
    };

    render() {
        return(
            <div>
                <button type="submit" onClick={()=>this.modalAddUser()} className="btn btn-success btn-lg btn-block navbar-btn uppercase text-bold btn-loading" >
                    <span className="content"><span className="ion-plus-circled"></span> ADD CONTACT</span>
                </button>
            </div>
        )
    }
}

class RemoveUser extends React.Component {

    removeQuestion = (result) => {
        if ( result ){
            let formData = new FormData();
            formData.append("userEmail", this.props.emailUser );

            let request = new XMLHttpRequest();
            request.open("POST", '/admin/remove/user', true);
            request.send(formData);
            request.onload = function() {
                if (request.status === 200) {
                    if( JSON.parse(request.responseText) === 'success' ){
                        //Hide remove user modal
                        $("#RemoveContactModal").modal('hide');

                        //Re-render table
                        ReactDOM.unmountComponentAtNode(document.getElementById('users-table'));
                        ReactDOM.render(<UsersTable/>, document.getElementById('users-table'));

                        //Shows notification
                        userInterface.notify('Contact Catalog', 'Contact ' + this.props.emailUser + ' correctly deleted.','success');
                    }else{
                        userInterface.notify('Contact Catalog', 'Error deleting user.','error');
                    }
                }
            }.bind(this);
        }else{
            $("#RemoveContactModal").modal('hide');
        }
    };

    render() {
        let userName = this.props.emailUser.replace('.', ' ').replace('@sanmina.com', '').replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
        return(
            <div className="remove-question">
                <h4> Are you completely sure to delete {userName} ? (Also Contact mappings will be removed) </h4>
                <div className="btn-remove-user text-center">
                    <button className="btn-remove-yes" onClick={()=>this.removeQuestion(true)} >YES</button>
                    <button className="btn-remove-no" onClick={()=>this.removeQuestion(false)} >NO</button>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<BtnAddUser/>, document.getElementById('btn-add-user'));

ReactDOM.render(<UsersTable/>, document.getElementById('users-table'));