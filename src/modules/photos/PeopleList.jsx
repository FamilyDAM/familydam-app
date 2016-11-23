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
            people:[]
        };
    },

    getInitialState: function(){
        return {}
    },

    componentWillMount: function () {
        ImageActions.peopleList.source.onNext(true);


        this.peopleSubscription = PhotoStore.people.subscribe(function(data){
            for( var key in data ){
                data[key]['value'] = data[key].name;
            }
            this.state.people = data;
            this.setState({'people':data});
        }.bind(this));

    },

    componentWillUnmount: function(){
        if( this.peopleSubscription ){
            this.peopleSubscription.dispose();
        }
    },


    selectItem: function(obj, event, id){
        if( this.props.onSelect !== undefined ){
            obj.type="people";
            this.props.onSelect(obj);
        }
    },

    render: function() {

        return (
            <TagCloud minSize={12}
                      maxSize={35}
                      colorOptions={{
                          hue: 'blue'
                      }}
                      tags={this.state.people}
                      style={{'padding':'5px'}}
                      onClick={tag => this.selectItem(tag)} />
        );
    },

    renderOld: function() {

        var list = [];
        try
        {
            this.state.people.forEach(function(item){
                var boundClick = this.selectItem.bind(this, item);
                list.push(<li key={item.name}><a onClick={boundClick}>{item.name} ({item.count})</a></li>);
            }.bind(this));

            return (
                <div className="peopleList">
                    <ul>
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

