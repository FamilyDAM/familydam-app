/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
import { RouteHandler} from 'react-router';
import {NavItemLink, MenuItemLink, ButtonLink} from 'react-bootstrap';
import {FormattedMessage, FormattedPlural, FormattedDate} from 'react-intl';

var ConfigActions = require("./../../actions/ConfigActions");
var SettingsStore = require("./../../stores/SettingsStore");


module.exports = React.createClass({

    getInitialState: function () {
        return {'storagePath': ""}
    },

    componentDidMount: function () {
        //console.log("StorageView");
        this.storageLocationSub = SettingsStore.storageLocation.subscribe(function (data_) {
            this.setState({'storagePath':data_});
            //if (this.isMounted()) this.forceUpdate();
        }.bind(this));


        this.isValidSubscription = SettingsStore.isValid.subscribe(function (data_) {
            this.setState({'isValid':data_});
            //if (this.isMounted()) this.forceUpdate();
        }.bind(this));
    },

    componentWillUnmount: function () {
        if (this.storageLocationSub !== undefined) this.storageLocationSub.dispose();
        if (this.isValidSubscription !== undefined) this.isValidSubscription.dispose();
    },


    /**
     * Use jquery to click a hidden file input field
     */
    clickFolderInputField: function () {
        $(this.refs.folderInputField).attr("directory", "directory");
        $(this.refs.folderInputField).attr("webkitdirectory", "webkitdirectory");
        $(this.refs.folderInputField).click();
    },


    handleFolderChange: function (event_) {
        var _this = this;
        //console.dir(event_);
        var _files = event_.currentTarget.files;

        if (_files[0].path != undefined)
        {
            ConfigActions.storageFolderChange.onNext(_files[0].path);
        } else
        {
            ConfigActions.storageFolderChange.onNext("/");
        }
    },

    editFolderPath: function (event_) {
        var _path = event_.target.value;
        this.setState({storagePath: _path});

        ConfigActions.storageFolderChange.onNext(_path);
    },


    handleSave: function () {
        ConfigActions.saveSettings.onNext(true);
    },


    render: function () {

        return (
            <div >
                <div className="main-section">
                    <div className="intro">
                        <FormattedMessage
                            id="storage.intro1a"
                            defaultMessage="storage.intro1a"
                        />
                    </div>
                    <br/>
                    <div>
                        <label><FormattedMessage
                            id="storage.location"
                            defaultMessage="Storage Location"
                            description='Location of internal repository'
                        />:</label><br/>
                        <input type="text"
                               value={this.state.storagePath}
                               onChange={this.editFolderPath}
                               style={{'width': '250px'}}/>
                        <button className="btn btn-default" onClick={this.clickFolderInputField}><FormattedMessage
                            id="browse"
                            defaultMessage="browse"
                        /></button>
                        <input type="file"
                               ref="folderInputField"
                               style={{'display': 'none'}}
                               onChange={this.handleFolderChange}/>
                    </div>
                    <div>
                        <strong><FormattedMessage
                            id="note"
                            defaultMessage="note"
                        />: </strong>
                        <FormattedMessage
                            id="storage.intro1b"
                            defaultMessage="storage.intro1b"
                        />
                    </div>
                </div>


                <div className="row footer">
                    <div className="col-xs-12">
                        <div className="right">
                            {this.state.isValid ?
                                <button onClick={this.handleSave}><FormattedMessage
                                    id="save"
                                    defaultMessage="save"
                                /></button>
                                :
                                <button disabled="disabled"><FormattedMessage
                                    id="save"
                                    defaultMessage="save"
                                /></button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});
