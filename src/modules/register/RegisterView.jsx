
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var ButtonLink = require('react-router-bootstrap').ButtonLink;

module.exports = React.createClass({

    getInitialState: function(){
        return {}
    },

    componentDidMount: function(){
        console.log("RegisterView");
        // update the breadcrumb
        //var _pathData = {'label':'Home', 'navigateTo':"dashboard", 'params':{}, 'level':0};
        //this.navigationActions = NavigationActions.currentPath.onNext( _pathData );
    },

    componentWillUnmount: function(){
        //if( this.navigationActions !== undefined ) this.navigationActions.dispose();
    },



    render: function () {

        return (
            <div >
                <div className="main-section">
                    <div className="intro">
                        Register
                    </div>
                    <br/>
                    <div>
                        <label>Pick a name for your family:</label><br/>
                        <input type="text" ref="familyName"  style={{'width':'250px'}}/>
                        <button className="btn btn-default" >Check</button>
                    </div>
                    <div>
                        <label>Email:</label><br/>
                        <input type="text" ref="emailReg"  style={{'width':'250px'}}/>
                    </div>
                </div>


                <div className="row footer">
                    <div className="col-xs-12">
                        <div className="left" >
                            <ButtonLink to="welcome">Back</ButtonLink>
                        </div>
                        <div className="right" >
                            <ButtonLink to="storage">Next</ButtonLink>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});
