
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var SectionTree = require('../../components/folderTree/SectionTree');
var FolderTree = require('../../components/folderTree/FolderTree');
var FileUploadView = require('../../components/fileUpload/FileUploadView')
var UploadActions = require('../../actions/UploadActions')

var UploadsView = React.createClass({
    
    componentWillMount: function(){
        var _this = this;
    },

    render: function() {

        return (
            <div className="container-fluid">
                <div className="row">
                    <aside className="col-xs-4 col-sm-3" >
                        <SectionTree title="Files" showAddFolder={true} navigateToFiles={true} baseDir="/dam:files/"/>
                    </aside>


                    <section className="col-sm-9" style={{'borderLeft':'1px solid #eee'}}>
                        <FileUploadView />
                    </section>
                </div>
            </div>
        );
    }

});

module.exports = UploadsView;
