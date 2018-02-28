/*
    User Interface created with ReactJS to add/edit/remove Customer External Rating
    Date:           Winter 2017
    Created by:     Angel Cuenca
*/

'use strict';

const userInterface = SurveyEngine.commons.userInterface;

class RatingType extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            ratingTypeName: '',
        };
    };

    //Method executed after Render
    componentDidMount( ) {
        if( this.props.isEdit ){
            let typeRating = this.props.ratingType;
            this.setState({
                ratingTypeName: typeRating
            });
        }
    }

    handleSaveRatingType = () =>{

        if( this.state.ratingTypeName !== '' ){
            let url;
            let formData = new FormData();

            if(this.props.isEdit){
                url = '/admin/update/rating-type';
                formData.append("idRatingType", this.props.idRatingType );
            }else{
                url = '/admin/save/rating-type';
            }

            formData.append("ratingTypeName", this.state.ratingTypeName );

            let request = new XMLHttpRequest();
            request.open("POST", url, true);
            request.send(formData);
            request.onload = function() {
                if (request.status === 200) {
                    let status = JSON.parse(request.responseText);

                    if(status !== 'Rating type is already created.'){
                        //Hide add/edit user modal
                        $('#ModalRatingType').modal('hide');

                        //Shows notification
                        userInterface.notify('Rating type', status, 'success');

                        //Returns to child component to update table
                        this.props.onRenderTable();
                    }else{
                        //Shows notification
                        userInterface.notify('Rating Type', status, 'notice');
                    }
                }
            }.bind(this);
        }else{
            //Shows notification
            userInterface.notify('Rating Type', 'Please set a name for new rating type', 'notice');
        }
    };

    render(){
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
                                                    <div className="col-xs-6 col-xs-12"><h5>Rating Type</h5></div>
                                                    <div className="col-xs-6 col-xs-12 select-external-rating">
                                                        <input className="input form-control" type="text" value={this.state.ratingTypeName} placeholder="Name" onChange={(event) => this.setState({ ratingTypeName: event.target.value.toUpperCase() })} />
                                                    </div>
                                                </label>
                                                <br />
                                            </form>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-group">
                                        <span className="input-group-btn">
                                            <button className="btn btn-info btn-search-user pull-right mright-15 mtop-25" onClick={()=>this.handleSaveRatingType()} >
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

class RatingTypeTable extends React.Component {
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
            request.open("GET", '/admin/get/all/rating-type', true);
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
        //Re-render table
        ReactDOM.unmountComponentAtNode(document.getElementById('add-rating-type'));

        this.setState((prevState) => {
            let request = new XMLHttpRequest();
            request.open("GET", '/admin/get/all/rating-type', true);
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

    handleEditRatingType = (idRatingType, nameRatingType) => {
        //Mount React component in DOM
        ReactDOM.render(<RatingType onRenderTable={this.updateTable} modalTitle={"Edit Rating Type"} idRatingType={idRatingType} ratingType={nameRatingType} isEdit={true} />, document.getElementById('add-rating-type'));

        //Open Modal
        $("#ModalRatingType").modal();
    };

    handleDeleteRatingType = (idRatingType, nameRatingType) => {
        //Mount React component in DOM
        ReactDOM.render(<DeleteRatingType onRenderTable={this.updateTable} idRatingType={idRatingType} ratingType={nameRatingType} modalTitle={"Delete Rating Type"} />, document.getElementById('add-rating-type'));

        //Open Modal
        $("#ModalRatingType").modal();
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
                            Header: "Rating Type",
                            id: "ratingTypeName",
                            accessor: d => d.ratingTypeName,
                            filterMethod: (filter, rows) =>
                                matchSorter(rows, filter.value, { keys: ["ratingTypeName"] }),
                            filterAll: true,
                            Filter: ({ filter, onChange }) => (
                                <input className="form-control input-sm"  onChange={event => onChange(event.target.value)} value={filter ? filter.value : ''} />
                            )
                        },
                        {
                            Header: "Actions",
                            accessor: "id",
                            Cell: props => {
                                return  <div className="row">
                                    <div className="col-lg-6 col-sm-12 text-right">
                                        <button className="btn btn-success btn-edit-circle" onClick={()=>this.handleEditRatingType(props.value, props.original.ratingTypeName)} >
                                            <span><span className="ion-edit" style={{color: '#ffffff'}}/> </span>
                                        </button>
                                    </div>
                                    <div className="col-lg-6 col-sm-12 text-left">
                                        <button className="btn btn-danger btn-delete-circle" onClick={()=>this.handleDeleteRatingType(props.value, props.original.ratingTypeName)} >
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

class ButtonAddRatingType extends React.Component {

    updateTable = () => {
        //To re-render Rating Type (un mounting and mounting component)
        //Because there are no parent components
        ReactDOM.unmountComponentAtNode(document.getElementById('table-rating-type'));
        ReactDOM.render(<RatingTypeTable/>, document.getElementById('table-rating-type'));

        //Unmount Modal Map
        ReactDOM.unmountComponentAtNode(document.getElementById('add-rating-type'));
    };

    modalAddRatingType = () => {
        //Open Modal
        $("#ModalRatingType").modal();

        //Mount component Customer External Rating
        ReactDOM.render(<RatingType isEdit={false} modalTitle={"New Rating Type"} onRenderTable={this.updateTable} />, document.getElementById('add-rating-type'));
    };

    render() {
        return(
            <div>
                <button type="submit" onClick={()=>this.modalAddRatingType()} className="btn btn-success btn-lg btn-block navbar-btn uppercase text-bold btn-loading" >
                    <span className="content"><span className="ion-plus-circled"></span> ADD RATING TYPE</span>
                </button>
            </div>
        )
    }
}

class DeleteRatingType extends React.Component {

    removeRatingType = (result) => {
        if ( result ){
            let formData = new FormData();
            formData.append("idRatingType", this.props.idRatingType );

            let request = new XMLHttpRequest();
            request.open("POST", '/admin/delete/rating-type', true);
            request.send(formData);
            request.onload = function() {
                if (request.status === 200) {
                    let status = JSON.parse(request.responseText);

                    //Hide remove modal
                    $("#ModalRatingType").modal('hide');

                    //Shows notification
                    userInterface.notify('Rating Type', status, 'success');

                    //Returns to child component to update table
                    this.props.onRenderTable();

                }
            }.bind(this);
        }else{
            $("#ModalRatingType").modal('hide');
        }
    };

    render() {
        return(
            <div>
                <div className="modal-header">
                    <button type="button" id="btn-modal-edit" className="close" data-dismiss="modal" aria-hidden="true"><span className="ion-close-round"></span></button>
                    <h3 className="modal-title uppercase" id="myLargeModalLabel-edit" style={{color: 'white'}}>{this.props.modalTitle}</h3>
                </div>
                <div className="modal-body">

                    <div className="mtop-10">
                        <br />
                    </div>

                    <div className="col-sm-12">
                        <div className="remove-question">
                            <h4> Are you completely sure to delete {this.props.ratingType} Rating Type ? </h4>
                            <div className="btn-remove-user text-center">
                                <button className="btn-remove-yes" onClick={()=>this.removeRatingType(true)} >YES</button>
                                <button className="btn-remove-no" onClick={()=>this.removeRatingType(false)} >NO</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        )
    }
}

ReactDOM.render(<ButtonAddRatingType/>, document.getElementById('btn-add-rating-type'));

ReactDOM.render(<RatingTypeTable/>, document.getElementById('table-rating-type'));