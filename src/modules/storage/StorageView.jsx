
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var Glyphicon = require('react-bootstrap').Glyphicon;
var NavItemLink = require('react-router-bootstrap').NavItemLink;
var MenuItemLink = require('react-router-bootstrap').MenuItemLink;
var ButtonLink = require('react-router-bootstrap').ButtonLink;

module.exports = React.createClass({

    getInitialState: function(){
        return {'storagePath':""}
    },

    componentDidMount: function(){
        console.log("StorageView");
        // update the breadcrumb
        //var _pathData = {'label':'Home', 'navigateTo':"dashboard", 'params':{}, 'level':0};
        //this.navigationActions = NavigationActions.currentPath.onNext( _pathData );
    },

    componentWillUnmount: function(){
        if( this.navigationActions !== undefined ) this.navigationActions.dispose();
    },


    /**
     * Use jquery to click a hiddle file input field
     */
    clickFolderInputField:function(){
        $(this.refs.folderInputField.getDOMNode()).attr("directory", "directory");
        $(this.refs.folderInputField.getDOMNode()).attr("webkitdirectory", "webkitdirectory");
        $(this.refs.folderInputField.getDOMNode()).click();
    },



    handleFolderChange: function(event_){
        var _this = this;
        //console.dir(event_);
        debugger;
        var _files = event_.currentTarget.files;

        if( _files[0].path != undefined )
        {
            this.setState({storagePath:_files[0].path});
        }else{
            this.setState({storagePath:"/"});
        }
    },


    render: function () {

        return (
            <div >
                <div className="main-section">
                    <div className="intro">
                        The FamilyD.A.M system needs a folder on your largest Hard Drive, USB Drive, or Mapped Network Drive.
                        This is were we will store all of the files, thumbnails, renditions, metadata, and other data.
                        <br/><br/>
                        <strong>Note:</strong> Everything is stored in this folder, so you can make complete backups of the FamilyD.A.M. data by backing up this folder.
                        Or if you need to move everything to a new folder/drive, you can do this by moving this folder and everything in it.
                    </div>
                    <br/>
                    <div>
                        <label>Storage Location:</label><br/>
                        <input type="text" value={this.state.storagePath} style={{'width':'250px'}}/>
                        <button className="btn btn-default" onClick={this.clickFolderInputField}>Browse</button>
                        <input type="file"
                               ref="folderInputField"
                               style={{'display':'none'}}
                               onChange={this.handleFolderChange} />
                    </div>
                </div>


                <div className="row footer">
                    <div className="col-xs-12">
                        <div className="left" >
                            <ButtonLink to="register">Back</ButtonLink>
                        </div>
                        <div className="right" >
                            <ButtonLink to="accounts">Next</ButtonLink>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});
