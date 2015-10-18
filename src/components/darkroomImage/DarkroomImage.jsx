
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var Darkroom = window.Darkroom;


var ImageActions = require('./../../actions/ImageActions');


module.exports = React.createClass({


    getInitialState:function(){
        return {};
    },

    getDefaultProps:function()
    {
        return {
            src: ''
        }
    },

    componentWillMount: function(){

    },


    componentDidMount: function(){
debugger;
        //this.dkrm = new Darkroom(this.refs.targetImage.getDOMNode(), {
        this.dkrm = new Darkroom('#targetImage', {
            // Size options
            minWidth: 100,
            minHeight: 100,
            maxWidth: 600,
            maxHeight: 500,
            ratio: 4/3,
            backgroundColor: '#fff',

            // Plugins options
            plugins: {
                //save: false,
                crop: {
                    quickCropKey: 67, //key "c"
                    //minHeight: 50,
                    //minWidth: 50,
                    //ratio: 4/3
                }
            },

            // Post initialize script
            initialize: function() {
                debugger;
                var cropPlugin = this.plugins['crop'];
                // cropPlugin.selectZone(170, 25, 300, 300);
                cropPlugin.requireFocus();
            }
        });

        console.dir(this.dkrm);
    },



    render: function() {
        return (
            <div className="image-container target">
                <img id="targetImage" ref="targetImage" src={this.props.src}/>
            </div>
        );
    }

});


