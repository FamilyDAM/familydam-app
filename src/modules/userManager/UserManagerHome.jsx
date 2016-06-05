/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
/** jsx React.DOM */

var React = require('react');
import { Router, Link } from 'react-router';


var NavigationActions = require('../../actions/NavigationActions');
var UserActions = require('../../actions/UserActions');


module.exports = React.createClass({

    getInitialState: function () {
        return {
            user: {}
        }
    },


    componentDidMount: function () {
        console.log("{UserManagerDetailView} componentWillMount");

    },


    componentWillUnmount: function () {

    },


    render: function () {
        var _this = this;

        return (
            <div className="row">
                <div className="col-sm-offset-3 col-sm-6">
                    <p className="text-center" style={{'marginTop':'30px', 'width':'100%'}}>
                        The FamilyD.A.M System allows members of your family their own view of the data.
                        Allowing everyone to manage the files, photos, and music anyway they want. </p>
                    <br/>
                </div>
            </div>
        );
    }

});


