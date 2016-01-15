/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
/** jsx React.DOM */
var React = require('react');
var Router = require('react-router');

var ButtonGroup = require('react-bootstrap').ButtonGroup;
var Button = require('react-bootstrap').Button;

var SectionTree = require('../../components/folderTree/SectionTree');

module.exports =  React.createClass({

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

    render: function() {

        try{
            return (
                <div className="photoActions">
                    <SectionTree title="Photo Actions" buttonGlyph="remove" buttonClick={this.handleOnClose}/>
                    <p>
                        <b>{this.props.images.length} Images Selected</b>
                    </p>
                    <ButtonGroup vertical block>
                        <Button disabled="true" block>Share (FB, TWIT)</Button>
                        <Button disabled="true" block>Add to Collection</Button>
                        <Button disabled="true" block>Export</Button>
                        <Button disabled="true" block>Zip & Download</Button>
                    </ButtonGroup>
                </div>
            );
        }catch(err_){
            console.log(err_);
        }
    }

});

