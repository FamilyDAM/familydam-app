/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
/** jsx React.DOM */
var React = require('react');
var Router = require('react-router');

var Glyphicon = require('react-bootstrap').Glyphicon;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var Button = require('react-bootstrap').Button;

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
            var _data = {'jcr:uuid':_img.id};
            _data['dam:' +prop_] = _img[prop_];

            for (var j = 0; j < vals_.length; j++)
            {
                var obj = vals_[j];
                if( _data['dam:' +prop_].indexOf( obj ) == -1 )
                {
                    _data['dam:' +prop_].push(obj);
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
                <div className="photoActions">
                    <SectionTree title="Photo Actions" buttonGlyph="remove" buttonClick={this.handleOnClose}/>
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
                        <p>Add people tag to all images</p>
                        <Tags
                            placeholder="Enter People"
                            title="People"
                            tags={this.state.peopleTags}
                            onAdd={this.handleOnPeopleAdd}
                            onRemove={this.handleOnPeopleRemove}/>
                        <p tooltip="current people on some or all images">
                            <strong>current people:</strong> {_people.join(",")}
                        </p>
                    </div>

                    <div style={{'padding': '5px'}}>
                        <p>Add keyword tag to all images</p>
                        <Tags
                            placeholder="Enter Tags"
                            title="&nbsp;&nbsp;&nbsp;Tags"
                            tags={this.state.tags}
                            onAdd={this.handleOnTagAdd}
                            onRemove={this.handleOnTagRemove}/>
                        <p tooltip="current tags on some or all images">
                            <strong>current tags:</strong> {_tags.join(",")}
                        </p>
                    </div>

                    <hr/>
                    <ButtonGroup vertical block>
                        <Button disabled="true" block>Share (Facebook, Twitter)</Button>
                        <Button disabled="true" block>Add To Collection</Button>
                        <Button disabled="true" block>Export</Button>
                        <Button disabled="true" block>Zip & Download</Button>
                        <Button disabled="true" block>Auto Tag (with Google)</Button>
                    </ButtonGroup>
                </div>
            );
        }catch(err_){
            console.log(err_);
        }
    }

});

