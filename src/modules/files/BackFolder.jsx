
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
var ButtonLink = require('react-router-bootstrap').ButtonLink;
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;

var FileActions = require('../../actions/FileActions');
var DirectoryActions = require('../../actions/DirectoryActions');

var BackFolder = React.createClass({

    getInitialProps:{
        path:''
    },

    componentWillReceiveProps: function (nextProps) {
        this.props = nextProps;
    },


    back: function(){

        if( this.props.path.lastIndexOf("/") > 0 ){
            var _path = this.props.path.substr(0,this.props.path.lastIndexOf("/"));

            DirectoryActions.selectFolder.onNext({'path':_path});
            FileActions.selectFile.onNext(undefined);
        }
        //history.go("-1");
    },



    render:function(){

        if( this.props.path !== "/content/dam-files" && this.props.path !== "/content/dam-files/" )
        {
            return (<div
                className="row"
                style={{'borderBottom':'1px solid #eee', 'padding':'5px', 'minHeight':'50px', 'cursor': 'pointer'}}
                onClick={this.back}>

                <div style={{'display': 'table-cell', 'width': '50px'}}>
                    <img src="assets/icons/ic_folder_48px.svg"
                         style={{'width':'48px', 'height':'48px', 'margin':'auto', 'cursor': 'pointer'}}/>
                </div>
                <div className="container-fluid" style={{'display': 'table-cell', 'width':'100%'}}>
                    <div className="row">
                        <div className="col-sm-12" style={{'verticalAlign':'middle', 'cursor': 'pointer', 'marginTop': '15px'}}><span>Parent Folder</span></div>
                    </div>
                </div>
            </div>);

        }else{
            return <div/>
        }
    }

});

module.exports = BackFolder;

