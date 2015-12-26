'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Treebeard} from 'react-treebeard';

var DirectoryActions = require('./../../actions/DirectoryActions');
var DirectoryStore = require('./../../stores/DirectoryStore');


const data = {
    name: 'root',
    toggled: true,
    children: [
        {
            name: 'parent',
            children: [
                { name: 'child1' },
                { name: 'child2' }
            ]
        },
        {
            name: 'loading parent',
            loading: true,
            children: []
        },
        {
            name: 'parent',
            children: [
                {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }
            ]
        }
    ]
};

class Tree extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            treeData: data
        };
        this.onToggle = this.onToggle.bind(this);

        refreshDirectories();
    }

    componentWillMount(){
        debugger;
    }

    componentWillReceiveProps(nextProps){
        debugger;
    }

    refreshDirectories() {
        // trigger a directory reload
        this.directoryStore = DirectoryActions.getDirectories.source.onNext(this.props.baseDir);

        // listen for trigger to reload for files in directory
        DirectoryActions.refreshDirectories.subscribe(function(data_){
            DirectoryActions.getDirectories.source.onNext( undefined );
            DirectoryActions.getDirectories.source.onNext( this.props.baseDir );
        }.bind(this) );

        //Listen for directory changes
        DirectoryStore.directories.subscribe(function (data_) {
            this.state.treeData = data_;
            if (this.isMounted()) this.forceUpdate();
        }.bind(this) );
    }


    onToggle(node, toggled){
        if(this.state.cursor){this.state.cursor.active = false;}
        node.active = true;
        if(node.children){ node.toggled = toggled; }
        this.setState({ cursor: node });
    }

    render(){
        return (
            <Treebeard
                data={this.state.treeData}
                onToggle={this.onToggle}
            />
        );
    }
}
