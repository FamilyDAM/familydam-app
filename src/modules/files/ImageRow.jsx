
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var ButtonGroup = require('react-bootstrap').ButtonGroup;
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;
var LinkContainer = require('react-router-bootstrap').LinkContainer;

var FileActions = require('../../actions/FileActions');
var NodeActions = require('../../actions/NodeActions');
var UserStore = require('./../../stores/UserStore');
var PreferenceStore = require('./../../stores/PreferenceStore');

module.exports = React.createClass({
    
    getInitialState:function()
    {
        return{
            file:{},
            name:''
        }
    },

    componentWillMount: function(){
        this.state.file = this.props.file;
    },

    componentWillReceiveProps: function (nextProps) {
        this.props = nextProps;
        
        this.state.file = nextProps.file;
        if (this.isMounted()) this.forceUpdate();
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return true;
    },

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
            this.history.pushState(null, "photos/" +this.props.file.id );
        }else{
            FileActions.selectFile.onNext(this.props.file);
            //load the data
            NodeActions.getNode.source.onNext(this.props.file.id);
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

    render:function(){

        return  <div className="row" onClick={this.handleRowClick} style={{'borderBottom':'1px solid #eee', 'padding':'5px', 'minHeight':'60px'}}>
                    <div style={{'display': 'table-cell', 'width': '50px'}}>
                        <Link to="photoDetails" params={{'id': this.state.file.id}}>
                            <img src={PreferenceStore.getBaseUrl() +this.state.file.path +"?rendition=thumbnail.200&token=" +UserStore.token.value}
                                 style={{'width':'50px', 'height':'50px'}}/></Link>
                    </div>
                    <div className="container-fluid" style={{'display': 'table-cell', 'width':'100%'}}>
                        <div className="row">
                            <div className="col-sm-6 col-lg-7" style={{'overflow':'hidden'}}>
                                <Link to={'photos/' +this.state.file.id} >{this.state.file.name}</Link>
                            </div>
                            <div className="col-sm-6 col-lg-5 text-right">
                                {(() => {
                                    if( this.state.file.mixins.indexOf("dam:image") > -1 )
                                    {
                                        return(
                                        <ButtonGroup bsSize="small" style={{'width':'250px','verticalAlign':'middle'}}>
                                            <LinkContainer to={'photos/' +this.state.file.id}>
                                                <Button style={{'padding':'5px 10px', 'margin':0}}>
                                                    <Glyphicon glyph="eye-open"/> view
                                                </Button>
                                            </LinkContainer>
                                            <LinkContainer to={'photos/' +this.state.file.id +'/edit'} >
                                                <Button style={{'padding':'5px 10px', 'margin':0}}>
                                                    <img src="assets/icons/ic_mode_edit_24px.svg" style={{'width':'14px', 'height':'14px', 'margin':'auto'}}/> edit
                                                </Button>
                                            </LinkContainer>
                                            <Button onClick={this.handleNodeDelete} data-id={this.state.file.id}
                                                    data-path={this.state.file.path}
                                                    style={{'padding':'5px 10px', 'margin':0}}>
                                                <Glyphicon glyph="remove"/> delete
                                            </Button>
                                        </ButtonGroup>
                                        );
                                    }else{
                                        return (
                                        <ButtonGroup  bsSize="small">
                                            <Button onClick={this.handleNodeDelete} data-id={this.state.file.id} data-path={this.state.file.path}>
                                                <Glyphicon glyph="remove"/> delete
                                            </Button>
                                        </ButtonGroup>
                                        );
                                    }
                                })()}

                            </div>
                        </div>
                    </div>

                </div>

    }

});


