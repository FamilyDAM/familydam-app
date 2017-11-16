
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var moment = require('moment');


var ImageActions = require('./../../actions/ImageActions');


module.exports = React.createClass({


    getInitialState:function(){
        return {};
    },

    getDefaultProps:function()
    {
        return {
            element:'editableImage',
            imageId: '',
            imageUrl: ''
        }
    },

    componentWillMount: function(){

    },


    componentDidMount: function(){

        jQuery.getScript('./assets/js/aviary/editor.js', function(script, textStatus, jqXHR){
            this.state.featherEditor = new Aviary.Feather({
                apiKey: "11b315b504ce4692a384aa80ee8e81c8",
                theme: 'light', // Check out our new 'light' and 'dark' themes!
                tools: 'all',
                appendTo: '',
                onSave: function(imageID, newURL) {
                    var img = document.getElementById(this.props.element);
                    img.src = newURL;
                }.bind(this),
                onLoad(obj){
                    //debugger;
                },
                onReady(obj){
                    //debugger;
                },
                onError(err){
                    //debugger;
                }
            });
        }.bind(this));
    },

    
    launchEditor: function(){

        // invoke action to call server and get base64 for the full size image
        ImageActions.getBase64Url.source.onNext(this.props.imageId);

        //listen for the server result.
        ImageActions.getBase64Url.sink.subscribe(function(data_){
            var _element = this.props.element;

            this.launchedEditor = this.state.featherEditor.launch({
                image: _element,
                url: data_
            });

            console.dir(this.launchedEditor);
        }.bind(this));

    },


    render: function() {
        return (
            <span onClick={this.launchEditor.bind(this)}>
                <img src="assets/icons/ic_mode_edit_24px.svg" style={{'width': '36px','height': '36px'}}/>
            </span>
        );
    }

});


