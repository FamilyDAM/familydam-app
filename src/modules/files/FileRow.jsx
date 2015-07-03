
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Navigation = Router.Navigation;

var ButtonGroup = require('react-bootstrap').ButtonGroup;
var ButtonLink = require('react-router-bootstrap').ButtonLink;
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;

var FileActions = require('../../actions/FileActions');
var NodeActions = require('../../actions/NodeActions');
var UserStore = require('./../../stores/UserStore');
var PreferenceStore = require('./../../stores/PreferenceStore');

var ImageRow = require('./ImageRow');
var MusicRow = require('./MusicRow');

var FileRow = React.createClass({
    mixins : [Navigation],

    handleRowClick: function(event, component)
    {

        if( $(event.target).attr('type') != "button" )
        {
            $(".active").removeClass("active");
            $(event.currentTarget).addClass("active");
            var _id = $("[data-reactid='" + component + "']").attr("data-id");
        }


        if( $('.device-xs').is(':visible') || $('.device-sm').is(':visible'))
        {
            FileActions.selectFile.onNext(undefined);
            this.context.transitionTo("photoDetails", {'id': this.props.file.id});
        }else{
            FileActions.selectFile.onNext(this.props.file);
        }
        // IF DBL CLick
        //var _id = $( "[data-reactid='" +component +"']" ).attr("data-id");
        //transitionTo('photoDetails', {'photoId': _id});
    },


    handleNodeDelete: function(event, component)
    {
        var _this = this;
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();

        var _id = $("[data-reactid='" + component + "']").attr("data-id");
        var _path = $("[data-reactid='" + component + "']").attr("data-path");

        NodeActions.deleteNode.source.onNext({'id':_id, 'path':_path});
    },


    handleDownloadOriginal:function(event, component){
        var _id = $("[data-reactid='" + component + "']").attr("data-id");
        var _location = PreferenceStore.getBaseUrl() +"/api/files/" +_id +"?token=" +UserStore.token.value;


        window.open(this.state.location);//, "_blank");
    },




    render:function(){

        if( this.props.file.mixins !== undefined && this.props.file.mixins.indexOf("dam:image") > -1 ){
            return <ImageRow file={this.props.file}></ImageRow>
        }
        else if( this.props.file.mixins !== undefined && this.props.file.mixins.indexOf("dam:music") > -1 ){
            return <MusicRow file={this.props.file}></MusicRow>
        }
        //else if( this.props.file.mixins !== undefined && this.props.file.mixins.indexOf("dam:movie") > -1  ){}
        else
        {

            return <div className="row"
                        style={{'borderBottom':'1px solid #eee', 'padding':'5px', 'minHeight':'60px'}}>

                <div style={{'display': 'table-cell', 'width': '50px;'}}>
                    <img src="assets/icons/ic_insert_drive_file_black_48px.svg"
                         style={{'width':'48px', 'height':'48px', 'margin':'auto', 'cursor': 'pointer'}}/>
                </div>

                <div className="container-fluid" style={{'display': 'table-cell', 'width':'100%'}}>
                    <div className="row">
                        <div className="col-sm-6 col-lg-7" style={{'overflow':'hidden'}}>
                            <Link to="photoDetails" params={{'id': this.props.file.id}}>{this.props.file.name}</Link>
                        </div>
                        <div className="col-sm-6 col-lg-5 text-right">
                            <ButtonGroup  bsSize="small" style={{'width':'250px','verticalAlign':'middle'}}>
                                <Button onClick={this.handleDownloadOriginal} data-id={this.props.file.id}
                                        data-path={this.props.file.path}>
                                    <Glyphicon glyph="download"/> download
                                </Button>
                                <Button onClick={this.handleNodeDelete} data-id={this.props.file.id}
                                        data-path={this.props.file.path}>
                                    <Glyphicon glyph="remove"/> delete
                                </Button>
                            </ButtonGroup>

                        </div>
                    </div>
                </div>

            </div>
        }

    }

});

module.exports = FileRow;

