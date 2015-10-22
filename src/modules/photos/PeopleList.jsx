/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
/** jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;

module.exports =  React.createClass({
    mixins: [ Router.Navigation ],

    getDefaultProps: function(){
        return {
            people:[]
        };
    },
    
    getInitialState: function(){
        return {}
    },

    selectItem: function(obj, event, id){
        if( this.props.onSelect !== undefined ){
            obj.type="people";
            this.props.onSelect(obj);
        }
    },

    render: function() {

        var list = [];
        this.props.people.forEach(function(item){
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
    }

});

