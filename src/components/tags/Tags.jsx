/*
 * Tag Input Field
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var TokenField = require('bootstrap-tokenfield');


module.exports = React.createClass({


    getDefaultProps: function () {
        return {'tags': [], title: "Tags", placeholder: "Enter Tags"}
    },

    getInitialState: function () {
        return {}
    },

    componentDidMount: function () {
        var _this = this;
        $(this.refs.tokenField).tokenfield();
        $(this.refs.tokenField).on('tokenfield:createdtoken', function (event_) {
            //console.dir(event_.attrs.value);

            if (_this.props.onAdd != undefined)
            {
                _this.props.onAdd(event_.attrs.value);
            }

        });
        $(this.refs.tokenField).on('tokenfield:removedtoken', function (event_) {
            //console.dir(event_.attrs.value);

            if (_this.props.onRemove != undefined)
            {
                _this.props.onRemove(event_.attrs.value);
            }
        });
    },

    componentWillReceiveProps: function (nextProps) {
        this.props = nextProps;

        if (nextProps['tags'] != undefined && nextProps['tags'].constructor == Array)
        {
            $(this.refs.tokenField).tokenfield('setTokens', nextProps['tags']);
        }
        if (nextProps['tags'] != undefined && nextProps['tags'].constructor == Object)
        {
            var vals = [];
            for (var key in nextProps['tags'])
            {
                var _items = nextProps['tags'][key];
                if (_items.constructor == Array)
                {
                    for (var i = 0; i < _items.length; i++)
                    {
                        var obj = _items[i];
                        vals.push(obj.type + ":" + obj.name);
                    }
                }
            }
            $(this.refs.tokenField).tokenfield('setTokens', vals);
        }
    },

    componentWillUnmount: function () {

    },

    handleOnChange: function () {
        //do nothing
    },


    render: function () {

        if( !this.props.tags ){
            this.props.tags = [];
        }

        return (

            <div className="TagComponent input-group">
                <span className="input-group-addon" style={{'fontSize':'inherit', 'lineHeight':'1.4'}}>{this.props.title}:</span>
                <input type="text" ref="tokenField"
                       placeholder={this.props.placeholder}
                       defaultValue={this.props.tags}
                       style={{'fontSize':'inherit'}}/>
            </div>

        );
    }

});

