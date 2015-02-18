/*
 * This file is part of FamilyDAM Project.
 *
 *     The FamilyDAM Project is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     The FamilyDAM Project is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with the FamilyDAM Project.  If not, see <http://www.gnu.org/licenses/>.
 */

/** @jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var FolderTree = require('../../components/folderTree/FolderTree');
var FileUploadView = require('../../components/fileUpload/FileUploadView')
var UploadActions = require('../../actions/UploadActions')

var UploadsView = React.createClass({
    
    componentWillMount: function(){
        var _this = this;
        
        UploadActions.fileStatusAction.subscribe(function(d_){
            console.log("** fileStatusAction ** ")
            _this.forceUpdate();
        });
    },

    render: function() {

        return (
            <div className="container-fluid">
                <div className="row">
                    <aside className="col-sm-3" >
                        <FolderTree title="Upload Folder" navigateToFiles={false}/>
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
