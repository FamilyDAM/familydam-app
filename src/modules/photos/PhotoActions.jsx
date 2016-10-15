/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
/** jsx React.DOM */
var React = require('react');
import { Router, Link } from 'react-router';


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


    handleOnClose:function(e_){
        if( this.props.onClose !== undefined ){
            this.props.onClose(e_);
        }
    },


    handleOnPeopleAdd: function (people_) {

        var pos = this.state.peopleTags.indexOf(people_);
        if (pos == -1)
        {
            this.state.peopleTags.push(people_);
            if( this.isMounted() ) this.forceUpdate();
            this.save("people", this.state.peopleTags);
        }
    },


    handleOnPeopleRemove: function (people_) {

        var pos = this.state.peopleTags.indexOf(people_);
        if (pos > -1)
        {
            this.state.peopleTags.splice(pos, 1);
            if( this.isMounted() ) this.forceUpdate();
            this.save("people", this.state.peopleTags);
        }
    },


    handleOnTagAdd: function (tag_) {

        var pos = this.state.tags.indexOf(tag_);
        if (pos == -1)
        {
            this.state.tags.push(tag_);
            if( this.isMounted() ) this.forceUpdate();
            this.save("tags", this.state.tags);
        }
    },

    handleOnTagRemove: function (tag_) {
        var pos = this.state.tags.indexOf(tag_);
        if (pos > -1)
        {
            this.state.tags.splice(pos, 1);
            if( this.isMounted() ) this.forceUpdate();
            this.save("tags", this.state.tags);
        }
    },


    save: function (prop_, vals_) {

        for (var i = 0; i < this.props.images.length; i++)
        {
            var _img = this.props.images[i];
            var _data = {'path':_img.path, props:{}};
            _data.props['dam:' +prop_] = _img[prop_];

            for (var j = 0; j < vals_.length; j++)
            {
                var obj = vals_[j];
                if( _data.props['dam:' +prop_].indexOf( obj ) == -1 )
                {
                    _data.props['dam:' +prop_].push(obj);
                }
            }


            NodeActions.updateNode.source.onNext(_data);

            NodeActions.updateNode.sink.subscribe(
                function (id_) {
                    if( this.isMounted() ) this.forceUpdate();
                }.bind(this)
            );
        }

    },



    save2: function (property_) {
        var _path = this.state.photo.path;
        var _val = this.state.photo[property_];

        var _data = {'path':_path, props:{}};
        _data.props[property_] = _val;

        //$(this.refs.savingLabel.getDOMNode()).show();
        //window.status = "Saving Changes";

        NodeActions.updateNode.source.onNext(_data);

        NodeActions.updateNode.sink.subscribe(
            function (id_) {
                //do nothing on successful save
                //$(this.refs.savingLabel.getDOMNode()).hide();
            }.bind(this), function(err_){
                alert(err_.status +":" +err_.statusText +"\n" +err_.responseText);
            }.bind(this));
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
                        <Subheader>Add people tag to all images</Subheader>
                        <Tags
                            placeholder="Enter People"
                            title="People"
                            tags={this.state.peopleTags}
                            onAdd={this.handleOnPeopleAdd}
                            onRemove={this.handleOnPeopleRemove}/>
                        <p>
                            <strong>current people:</strong> {_people.join(",")}
                        </p>
                    </div>

                    <div style={{'padding': '5px'}}>
                        <Subheader>Add keyword tag to all images</Subheader>
                        <Tags
                            placeholder="Enter Tags"
                            title="&nbsp;&nbsp;&nbsp;Tags"
                            tags={this.state.tags}
                            onAdd={this.handleOnTagAdd}
                            onRemove={this.handleOnTagRemove}/>
                        <p>
                            <strong>current tags:</strong> {_tags.join(",")}
                        </p>
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

