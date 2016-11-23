/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
/** jsx React.DOM */
var React = require('react');
import { Router, Link } from 'react-router';
import ChipInput from 'material-ui-chip-input';

import {
    Subheader,
    RaisedButton
} from 'material-ui';

var Glyphicon = require('react-bootstrap').Glyphicon;

var NodeActions = require('./../../actions/NodeActions');

var Tags = require('./../../components/tags/Tags.jsx');
var SectionTree = require('../../components/folderTree/SectionTree.jsx');

module.exports =  React.createClass({

    getInitialState: function(){
        return {
            peopleTags:[],
            tags:[]
        }
    },

    getDefaultProps: function(){
        return {
            images: []
        };
    },


    componentWillMount:function(){
        //debugger;
    },

    componentWillReceiveProps:function(nextProps, props){
        this.props = nextProps;

        var _people = [];
        var _tags = [];

        for (var i = 0; i < this.props.images.length; i++) {
            var _img = this.props.images[i];

            for (var j = 0; j < _img.people.length; j++) {
                var obj = _img.people[j];
                var pos = _people.indexOf(obj);
                if (pos == -1) {
                    _people.push(obj);
                }
            }

            for (var k = 0; k < _img.tags.length; k++) {
                var obj = _img.tags[k];
                var pos = _tags.indexOf(obj);
                if (pos == -1) {
                    _tags.push(obj);
                }
            }
        }

        this.setState({"peopleTags":_people, "tags":_tags});
    },


    handleOnClose:function(e_){
        if( this.props.onClose !== undefined ){
            this.props.onClose(e_);
        }
    },


    handleOnPeopleAdd: function (people_) {

        var pos = this.state.peopleTags.indexOf(people_);
        if (pos == -1)
        {
            var _peopleTags = this.state.peopleTags;
            _peopleTags.push(people_);
            this.setState({"peopleTags":_peopleTags});

            for (var i = 0; i < this.props.images.length; i++) {
                var img = this.props.images[i];
                img.people.push(people_);
            }

            this.save("dam:people", "+" +people_, true);
        }
    },


    handleOnPeopleRemove: function (people_) {

        var pos = this.state.peopleTags.indexOf(people_);
        if (pos > -1)
        {
            var _people = this.state.peopleTags;
            _people.splice(pos, 1);
            this.setState({"peopleTags":_people});

            for (var i = 0; i < this.props.images.length; i++) {
                var img = this.props.images[i];
                var pos = img.people.indexOf(people_);
                img.people.splice(pos,1);
            }


            this.save("dam:people", "-" +people_, true);
        }
    },


    handleOnTagAdd: function (tag_) {

        var pos = this.state.tags.indexOf(tag_);
        if (pos == -1)
        {
            var _tags = this.state.tags;
            _tags.push(tag_);
            this.setState({"tags":_tags});

            for (var i = 0; i < this.props.images.length; i++) {
                var img = this.props.images[i];
                img.tags.push(tag_);
            }

            this.save("dam:tags", "+" +tag_, true);
        }
    },


    handleOnTagRemove: function (tag_) {
        var pos = this.state.tags.indexOf(tag_);
        if (pos > -1)
        {
            var _tags = this.state.tags;
            _tags.splice(pos, 1);
            this.setState({"tags":_tags});

            for (var i = 0; i < this.props.images.length; i++) {
                var img = this.props.images[i];
                var pos = img.tags.indexOf(tag_);
                img.tags.splice(pos,1);
            }

            this.state.tags.splice(pos, 1);
            if( this.isMounted() ) this.forceUpdate();
            this.save("dam:tags", "-" +tag_, true);
        }
    },



    save: function (property_, val_, patch_) {

        for (var i = 0; i < this.props.images.length; i++) {
            var _img = this.props.images[i];
            var _path = _img.path;


            var _data = {'path': _path, props: {}};
            _data.props[property_] = val_;
            if (patch_) {
                _data.props[property_ + "@Patch"] = "true";
            }


            //$(this.refs.savingLabel.getDOMNode()).show();
            //window.status = "Saving Changes";
            NodeActions.updateNode.source.onNext(_data);

            NodeActions.updateNode.sink.subscribe(
                function (id_) {
                    //do nothing on successful save
                    //$(this.refs.savingLabel.getDOMNode()).hide();
                }.bind(this), function (err_) {
                    alert(err_.status + ":" + err_.statusText + "\n" + err_.responseText);
                }.bind(this));
        }
    },



    render: function() {

        var _people = [];
        var _tags = [];

        for (var i = 0; i < this.props.images.length; i++)
        {
            var img = this.props.images[i];
            for (var j = 0; j < img['people'].length; j++)
            {
                var _pTag = img['people'][j].toLowerCase();
                if( _people.indexOf(_pTag) == -1)
                {
                    _people.push(_pTag);
                }
            }
            for (var k = 0; k < img['tags'].length; k++)
            {
                var _tag = img['tags'][k].toLowerCase();
                if( _tags.indexOf(_tag) == -1)
                {
                    _tags.push(_tag);
                }
            }
        }


        try{
            return (
                <div className="photoActions" style={{'padding':'20px'}}>
                    <div>
                        <div className="pull-left">
                            <p>
                                <b>{this.props.images.length} Images Selected</b>
                            </p>
                        </div>
                        <div className="pull-right">
                            <Glyphicon glyph="eye-open" style={{'color':'#eeeeee', 'fontSize':'21px'}}/>
                            &nbsp;&nbsp;
                            <Glyphicon glyph="trash" style={{'color':'#eeeeee', 'fontSize':'21px'}}/>
                        </div>
                    </div>

                    <div style={{'padding': '5px', 'clear':'left'}}>
                        <Subheader style={{'display':'flex', 'alignItems':'flex-start'}}>People</Subheader>
                        <ChipInput
                            hintText="Add people to ALL selected images"
                            value={this.state.peopleTags}
                            onRequestAdd={(chip) => this.handleOnPeopleAdd(chip)}
                            onRequestDelete={(chip) => this.handleOnPeopleRemove(chip)}
                        />

                    </div>

                    <div style={{'padding': '5px'}}>
                        <Subheader style={{'display':'flex', 'alignItems':'flex-start'}}>Tags</Subheader>
                        <ChipInput
                            hintText="Add tag to ALL selected images"
                            value={this.state.tags}
                            onRequestAdd={(chip) => this.handleOnTagAdd(chip)}
                            onRequestDelete={(chip) => this.handleOnTagRemove(chip)}
                        />

                    </div>

                    <hr/>
                    <div style={{'display':'flex','flexDirection':'column','alignContent':'space-around'}}>
                        <RaisedButton disabled={true} style={{'marginBottom':'5px','color': '#ccc'}}>Share (Facebook, Twitter)</RaisedButton>
                        <RaisedButton disabled={true} style={{'marginBottom':'5px','color': '#ccc'}}>Add To Collection</RaisedButton>
                        <RaisedButton disabled={true} style={{'marginBottom':'5px','color': '#ccc'}}>Export</RaisedButton>
                        <RaisedButton disabled={true} style={{'marginBottom':'5px','color': '#ccc'}}>Zip & Download</RaisedButton>
                        <RaisedButton disabled={true} style={{'marginBottom':'5px','color': '#ccc'}}>Auto Tag (with Google)</RaisedButton>
                    </div>
                </div>
            );
        }catch(err_){
            console.log(err_);
        }
    }

});

