/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

var React = require('react');

var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;


module.exports = React.createClass({

    componentDidMount: function(){

    },

    componentWillUnmount: function(){

    },


    render: function () {

        return (
            <div className="container-fluid">
                <div className="row">
                    <aside className="col-sm-3" >
                        <ul>
                            <li>Locale</li>
                            <li>Storage Location</li>
                            <li>Users</li>
                        </ul>
                    </aside>

                    <div className="col-sm-9">
                        <RouteHandler {...this.props}/>
                    </div>
                </div>
            </div>

        );
    }

});


