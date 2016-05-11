/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
/** jsx React.DOM */
var React = require('react');
import { Router, Link } from 'react-router';

import {Subheader, List, ListItem, IconButton} from 'material-ui';

var ImageActions = require('../../actions/ImageActions');
var PhotoStore = require('./../../stores/PhotoStore');
var Tree = require('../../components/folderTree/Tree.jsx');

module.exports =  React.createClass({
   

    getDefaultProps: function(){
        return {
            tree: []
        };
    },
    
    getInitialState: function(){
        return {}
    },


    componentWillMount: function () {
        ImageActions.dateTree.source.onNext(true);


        PhotoStore.dateTree.subscribe(function(data){
            var root = [];
            for( var key in data ){
                root.push(data[key]);
            }

            this.state.tree = root;
            if (this.isMounted()) this.forceUpdate();
        }.bind(this));
    },


    _onSelectHandler: function(val_){
        if( this.props.onSelect  ){
            this.props.onSelect(  (JSON.parse(JSON.stringify(val_)))  );
        }
    },

    getListItem: function (items_) {

        var elements = [];
        $.each(items_, (indx_, item_)=> {
            elements.push(
                <ListItem key={item_.key}
                          primaryText={item_.name}
                          onTouchTap={()=>{this._onSelectHandler(item_)}}
                          nestedItems={this.getListItem(item_.children)}
                          style={{'fontSize':'13px', 'lineHeight':'13px'}}/>
            );
        });

        return elements;
        //leftIcon={<FolderIcon />}
        //leftIcon={<IconButton iconClassName="material-icons" >folder</IconButton>}
    },


    render(){
        return (
            <List>
                {this.getListItem(this.state.tree)}
            </List>
        );
    }


    /**
    renderOld: function() {
        try{
            return (
                <div className="dateTree">
                    <Tree
                        data={this.state.tree}
                        onSelect={this.selectItem}/>
                </div>
            );
        }catch(err_){
            console.log(err_);
        }
    }
     **/

});

