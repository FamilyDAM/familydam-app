/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
/** jsx React.DOM */
var React = require('react');
import { Router, Link } from 'react-router';
import { TagCloud } from "react-tagcloud";

var ImageActions = require('../../actions/ImageActions');
var PhotoStore = require('./../../stores/PhotoStore');

module.exports =  React.createClass({

    getDefaultProps: function(){
        return {
            tags:{}
        };
    },

    getInitialState: function(){
        return {}
    },


    componentWillMount: function () {
        ImageActions.tagsList.source.onNext(true);

        // subscribe to changes
        this.tagSubscription = PhotoStore.tags.subscribe(function(data){

            for( var key in data ){
                data[key]['value'] = data[key].name;
            }
            this.state.tags = data;

            if (this.isMounted()) this.forceUpdate();
        }.bind(this));

    },


    componentWillUnmount: function(){
        if( this.tagSubscription ){
            this.tagSubscription.dispose();
        }
    },


    selectItem: function(obj, event, id){
        if( this.props.onSelect !== undefined ){
            obj.type="tag";
            this.props.onSelect(obj);
        }
    },


    render: function() {

        if( !this.state.tags ){
            this.state.tags = {};
        }

        return (

            <TagCloud minSize={12}
                      maxSize={35}
                      colorOptions={{
                          luminosity: 'light',
                          hue: 'blue'
                      }}
                      tags={this.state.tags}
                      style={{'padding':'5px'}}
                      onClick={tag => this.selectItem(tag)} />
        )
    },



    renderOld: function() {

        var list = [];
        try
        {
            this.state.tags.forEach(function(item){
                var boundClick = this.selectItem.bind(this, item);
                list.push(<li key={item.name}><a onClick={boundClick}>{item.name} ({item.count})</a></li>);
            }.bind(this));

            return (
                <div className="tagList">
                    <ul >
                        {list}
                    </ul>
                    <br/>
                </div>
            );
        }catch(err_){
            console.log(err_);
        }
    }

});

