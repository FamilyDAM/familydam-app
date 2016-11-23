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
var LoadingIcon = require('../../components/loadingIcon/LoadingIcon.jsx');

module.exports =  React.createClass({


    getDefaultProps: function(){
        return {
            tree: []
        };
    },

    getInitialState: function(){
        return {
            isLoading:true
        }
    },


    componentWillMount: function () {

        this.dateTreeSubscription = PhotoStore.dateTree.subscribe(function(data){
            var root = [];
            for( var key in data ){
                root.push(data[key]);
            }

            this.state.tree = root;
            this.state.isLoading = false;
            if (this.isMounted()) this.forceUpdate();
        }.bind(this));


        this.state.isLoading = true;
        ImageActions.dateTree.source.onNext(true);

    },


    componentWillUnmount: function () {
        if (this.dateTreeSubscription !== undefined) this.dateTreeSubscription.dispose();
    },


    _onSelectHandler: function(val_){
        if( this.props.onSelect  ){
            this.props.onSelect( Object.assign({}, val_) );// (JSON.parse(JSON.stringify(val_)))  );
        }
    },

    getListItem: function (items_) {

        var elements = [];
        $.each(items_, (indx_, item_)=> {

            if( typeof(item_) == "object" ) {

                var children = [];
                for (var key in item_) {
                    if (["count", "key", "name", "year", "month", "day", "jcr:primaryType", "nt:unstructured"].indexOf(key) == -1) {
                        children.push(item_[key]);
                    }
                };

                elements.push(
                    <ListItem key={item_.key}
                              primaryText={item_.name}
                              onTouchTap={() => {
                                  this._onSelectHandler(item_)
                              }}
                              nestedItems={this.getListItem(children)}
                              style={{'fontSize': '13px', 'lineHeight': '13px'}}/>
                );
            }
        });

        return elements;
        //leftIcon={<FolderIcon />}
        //leftIcon={<IconButton iconClassName="material-icons" >folder</IconButton>}
    },


    render(){

        return (
            <div style={{'display':'flex', 'flexDirection':'column', 'flexGrow':'1'}}>
                <div style={{'display':'flex', 'flexDirection':'row', 'alignItems':'center'}}>
                    <Subheader style={{'display':'flex', 'alignItems':'flex-start'}}>{this.props.title}</Subheader>
                    {(() => {
                        if( this.state.isLoading )
                        {
                            return(<div style={{'display':'flex', 'alignItems':'flex-end'}}>
                                <LoadingIcon color="#757575" style={{'width':'36px', 'height':'36px'}}/>
                            </div>);
                        }
                    })()}
                </div>
                <List>
                    {this.getListItem(this.state.tree)}
                </List>
            </div>
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

