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
            tree: {}
        };
    },
    
    getInitialState: function(){
        return {}
    },

    selectItem: function(obj, event, id){
        if( this.props.onSelect !== undefined ){
            obj.type="date";
            this.props.onSelect(obj);
        }
    },

    list: function(items_)
    {
        var _this = this;
        if( items_ == undefined ){
            items_ = this.props.tree;
        }

        var list = [];
        Object.keys(items_).sort(function(a, b){
            if( items_[a].key < items_[b].key ) return -1;
            else if( items_[a].key > items_[b].key ) return 1;
            else return 0;
        }).forEach(function(key){
            var item = items_[key];
            var boundClick = this.selectItem.bind(this, item);
            list.push(
                <li>
                    <a onClick={boundClick} key={item.label}>{item.label}</a>
                    {Object.keys(item.children).length?
                        <ul>{this.list(item.children)}</ul>
                    :''}
                </li>);
        }.bind(this));

        return list;
    },


    render: function() {
        return (
            <div className="dateTree">
                <ul>
                    {this.list(this.props.tree)}
                </ul>
                <br/>   
            </div>
        );
    }

});

