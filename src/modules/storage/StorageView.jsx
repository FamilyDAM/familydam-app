
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var IntlMixin = require('react-intl');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var Glyphicon = require('react-bootstrap').Glyphicon;
var NavItemLink = require('react-router-bootstrap').NavItemLink;
var MenuItemLink = require('react-router-bootstrap').MenuItemLink;
var ButtonLink = require('react-router-bootstrap').ButtonLink;

var ConfigActions = require("./../../actions/ConfigActions");
var SettingsStore = require("./../../stores/SettingsStore");

module.exports = React.createClass({

    mixins: [IntlMixin],

    getInitialState: function(){
        return {'storagePath':""}
    },

    componentDidMount: function(){
        //console.log("StorageView");
        this.storageLocationSub = SettingsStore.storageLocation.subscribe(function(data_){
            this.state.storagePath = data_;
            if( this.isMounted()) this.forceUpdate();
        }.bind(this));


        this.isValidSubscription = SettingsStore.isValid.subscribe(function(data_){
            this.state.isValid = data_;
            if( this.isMounted() ) this.forceUpdate();
        }.bind(this));
    },

    componentWillUnmount: function(){
        if( this.storageLocationSub !== undefined ) this.storageLocationSub.dispose();
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
        var _files = event_.currentTarget.files;

        if( _files[0].path != undefined )
        {
            ConfigActions.storageFolderChange.onNext(_files[0].path);
        }else{
            ConfigActions.storageFolderChange.onNext("/");
        }
    },

    editFolderPath:function(event_){
        var _path = event_.target.value;
        this.setState({storagePath:_path});

        ConfigActions.storageFolderChange.onNext(_path);
    },


    handleSave:function(){
        ConfigActions.saveSettings.onNext(true);
    },


    render: function () {

        return (
            <div >
                <div className="main-section">
                    <div className="intro">
                        {this.getIntlMessage('storage.intro1a')}
                    </div>
                    <br/>
                    <div>
                        <label>{this.getIntlMessage('storage.location')}:</label><br/>
                        <input type="text"
                               value={this.state.storagePath}
                               onChange={this.editFolderPath}
                               style={{'width':'250px'}}/>
                        <button className="btn btn-default" onClick={this.clickFolderInputField}>{this.getIntlMessage('browse')}</button>
                        <input type="file"
                               ref="folderInputField"
                               style={{'display':'none'}}
                               onChange={this.handleFolderChange} />
                    </div>
                    <div>
                        <strong>{this.getIntlMessage('note')}: </strong>
                        {this.getIntlMessage('storage.intro1b')}
                    </div>
                </div>


                <div className="row footer">
                    <div className="col-xs-12">
                        <div className="right">
                            {this.state.isValid ?
                                <button onClick={this.handleSave}>{this.getIntlMessage('save')}</button>
                                :
                                <button disabled="disabled">{this.getIntlMessage('save')}</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});
