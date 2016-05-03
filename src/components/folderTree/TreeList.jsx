'use strict';

var React = require('react');

import {Subheader, List, ListItem, IconButton} from 'material-ui';
import FolderIcon from 'material-ui/svg-icons/file/folder';

var FileActions = require('./../../actions/FileActions');
var DirectoryActions = require('./../../actions/DirectoryActions');
var DirectoryStore = require('./../../stores/DirectoryStore');


module.exports = React.createClass({

    getDefaultProps:function(){
        return {
            title:""
        }
    },

    getInitialState: function () {
        return {
            addNodeRefs: [],
            treeData: [],
            selectedPath: "/content/dam-files"
        }
    },


    componentWillMount: function () {
        // trigger a directory reload
        if (this.props.baseDir !== undefined)
        {
            this.loadDirectoryTree();
        }


        if (this.props.data !== undefined)
        {
            this.state.treeData = this.props.data;
        }
    },


    componentWillUnmount: function () {
        if (this.getFilesSubscription !== undefined)
        {
            this.getFilesSubscription.dispose();
        }

        if (this.refreshDirectoriesSubscription !== undefined)
        {
            this.refreshDirectoriesSubscription.dispose();
        }

        if (this.directoriesSubscription !== undefined)
        {
            this.directoriesSubscription.dispose();
        }
    },


    componentWillReceiveProps: function (nextProps_) {
        if (nextProps_.data !== undefined)
        {
            this.state.treeData = nextProps_.data;
        }
    },


    loadDirectoryTree: function () {
        DirectoryActions.getDirectories.source.onNext(this.props.baseDir);

        var getFilesSubscription = FileActions.getFiles.source.subscribe(function (path_) {
            this.state.selectedPath = path_;
        }.bind(this));

        // listen for trigger to reload for files in directory
        this.refreshDirectoriesSubscription = DirectoryActions.refreshDirectories.subscribe(function (data_) {
            DirectoryActions.getDirectories.source.onNext(undefined);
            DirectoryActions.getDirectories.source.onNext(this.props.baseDir);
        }.bind(this));

        //Listen for directory changes
        this.directoriesSubscription = DirectoryStore.directories.subscribe(function (data_) {
            var isChild = false;
            for (var i = 0; i < this.state.addNodeRefs.length; i++)
            {
                var obj = this.state.addNodeRefs[i];

                for (var j = 0; j < data_.length; j++)
                {
                    var dataObj = data_[j];
                    if (obj.path == dataObj.parent)
                    {
                        isChild = true;
                        obj.children.push(dataObj);

                        this.state.addNodeRefs.push(dataObj);

                    }
                }
            }

            if (!isChild && data_ !== undefined && data_.length > 0)
            {
                this.state.treeData = data_;
                for (var i = 0; i < data_.length; i++)
                {
                    this.state.addNodeRefs.push(data_[i]);
                }
            }
            if (this.isMounted()) this.forceUpdate();
        }.bind(this));
    },


    _onClickHandler:function(path_){
        FileActions.getFiles.source.onNext(path_);
    },


    getListItem: function (items_) {
        return items_.map((item_)=> {
            return (
                <ListItem key={item_.path}
                          primaryText={item_.name}
                          onTouchTap={()=>{this._onClickHandler(item_.path)}}
                          nestedItems={this.getListItem(item_.children)}
                          style={{'fontSize':'13px', 'lineHeight':'13px'}}/>
            );
        })

        //leftIcon={<FolderIcon />}
        //leftIcon={<IconButton iconClassName="material-icons" >folder</IconButton>}
    },


    render(){

        return (
            <List>
                <Subheader>{this.props.title}</Subheader>
                {this.getListItem(this.state.treeData)}
            </List>
        );
    }

});

