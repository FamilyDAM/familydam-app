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


module.exports = React.createClass({

    componentDidMount: function(){
        console.log("{UserManagerView} componentDidMount");
    },

    componentWillUnmount: function(){
        //if( this.navigationActions !== undefined ) this.navigationActions.dispose();
    },


    render: function () {
        var _this = this;

        return (

            <div>
            <div className="container-fluid">
                <div className="row">
                    <aside className="col-xs-3">
                        <SectionTree title="Users" showAddUser={true}/>
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
                                                           style={{'fontSize': '24px;'}}></Glyphicon>
                                            <i className="fa fa-pencil fa-stack-1x fa-inverse fab-secondary"></i>
                                        </span>
                        </button>
                    </div>
                    <ul className="dropdown-menu dropdown-menu-right" role="menu">
                        <li>Add User</li>
                    </ul>
                </div>
            </div>
            </div>
        );
    }

});


