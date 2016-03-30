/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
/** jsx React.DOM */
var React = require('react');
import { Router, Link } from 'react-router';

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


        PhotoStore.people.subscribe(function(data){
            this.state.people = data;
            if (this.isMounted()) this.forceUpdate();
        }.bind(this));
    },

    selectItem: function(obj, event, id){
        if( this.props.onSelect !== undefined ){
            obj.type="people";
            this.props.onSelect(obj);
        }
    },

    render: function() {

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

