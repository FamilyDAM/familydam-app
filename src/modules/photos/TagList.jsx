/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
/** jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;

var ImageActions = require('../../actions/ImageActions');
var PhotoStore = require('./../../stores/PhotoStore');

module.exports =  React.createClass({
    mixins: [ Router.Navigation ],

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
        PhotoStore.tags.subscribe(function(data){
            this.state.tags = data;
            if (this.isMounted()) this.forceUpdate();
        }.bind(this));

    },


    selectItem: function(obj, event, id){
        if( this.props.onSelect !== undefined ){
            obj.type="tag";
            this.props.onSelect(obj);
        }
    },


    render: function() {

        var list = [];

        try
        {
            this.state.tags.forEach(function(item){
                var boundClick = this.selectItem.bind(this, item);
                list.push(<li key={item.name}><a onClick={boundClick}>{item.name} ({item.count})</a></li>);
            }.bind(this));

            return (
                <div className="tagList">
                    <ul>
                        {list}
                    </ul>
                    <br/>
                </div>
            );
        }catch(err_){
            debugger;
            console.log(err_);
        }
    }

});

