/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
/** jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var Glyphicon = require('react-bootstrap').Glyphicon;
var SectionTree = require('../../components/folderTree/SectionTree');
var Button = require('react-bootstrap').Button;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var Modal = require('react-bootstrap').Modal;
var ModalHeader = require('react-bootstrap').Modal.Header;
var ModalTitle = require('react-bootstrap').Modal.Title;
var ModalBody = require('react-bootstrap').Modal.Body;
var ModalFooter = require('react-bootstrap').Modal.Footer;

module.exports = React.createClass({

    getInitialState:function(){
        return {
            'showCreateUserModal':false
        }
    },

    componentDidMount: function(){
        console.log("{UserManagerView} componentDidMount");
    },

    componentWillUnmount: function(){
        //if( this.navigationActions !== undefined ) this.navigationActions.dispose();
    },

    handleAddUser: function(event_)
    {
        this.openCreateUser();
    },

    closeCreateUser(){
        this.setState({ showCreateUserModal: false });
    },

    openCreateUser(){
        this.setState({ showCreateUserModal: true });
    },

    render: function () {
        var _this = this;

        return (

            <div>
                <div className="container-fluid">
                    <div className="row">
                        <aside className="col-xs-3">
                            <SectionTree title="Users" showAdd={true} onAdd={this.handleAddUser}/>
                        </aside>

                        <section className="col-xs-9">
                            [User Manager]
                        </section>
                    </div>
                </div>



                <div id="fab-button-group" style={{'position':'absolute','top': '150px','right': '0px', 'display':'none'}}>
                    <div className="fab  show-on-hover dropup">
                        <div data-toggle="tooltip" data-placement="left" title="Compose">
                            <button type="button" className="btn btn-danger btn-io dropdown-toggle"
                                    data-toggle="dropdown">
                                    <span className="fa-stack fa-2x">
                                        <i className="fa fa-circle fa-stack-2x fab-backdrop"></i>
                                         <Glyphicon glyph="plus"
                                                       className="fa fa-plus fa-stack-1x fa-inverse fab-primary"
                                                       style={{'fontSize': '24px'}}></Glyphicon>
                                        <i className="fa fa-pencil fa-stack-1x fa-inverse fab-secondary"></i>
                                    </span>
                            </button>
                        </div>
                        <ul className="dropdown-menu dropdown-menu-right" role="menu">
                            <li>Add User</li>
                        </ul>
                    </div>
                </div>


                <Modal title="Add Folder" show={this.state.showCreateUserModal} onHide={this.closeCreateUser}>
                    <div className="modal-body">
                        <table>
                            <tr>
                                <td><h4>Name</h4></td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="text" ref="firstName" label="First Name"/>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <div className="modal-footer">
                        <ButtonGroup>
                            <Button onClick={this.closeCreateUser}>Close</Button>
                            <Button onClick={this.handleCreateFolder}>Create</Button>
                        </ButtonGroup>
                    </div>
                </Modal>
            </div>
        );
    }

});


