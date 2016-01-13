/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
/** jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;

var ImageActions = require('../../actions/ImageActions');
var PhotoStore = require('./../../stores/PhotoStore');
var Tree = require('../../components/folderTree/Tree');

module.exports =  React.createClass({
    mixins: [ Router.Navigation ],

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


    selectItem: function(node, toggled){
        if( this.props.onSelect !== undefined ){
            node.type="date";
            this.props.onSelect(node);
        }
    },


    render: function() {

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

});

