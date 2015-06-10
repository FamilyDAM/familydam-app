
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Glyphicon = require('react-bootstrap').Glyphicon;

var PhotoThumbnail = React.createClass({


    handleClick: function(event) {
        if (this.props.thumbnailEventHandler !== undefined){
           this.props.thumbnailEventHandler(event, this.props.photo);
        }
    },



    render: function() {
        return (
            <div className={this.props.photo.active?'thumbnailCard active':'thumbnailCard'}>
                    <img src={this.props.photo.src}
                        style={{'margin':'auto'}}
                        onClick={this.handleClick}/>
                <br/><br/>
                <div>
                    <img src="assets/icons/ic_star_24px.svg"
                        style={{'width': '18px', 'height': '18px'}}/>
                    <img src="assets/icons/ic_star_24px.svg"
                        style={{'width': '18px', 'height': '18px'}}/>
                    <img src="assets/icons/ic_star_24px.svg"
                        style={{'width': '18px', 'height': '18px'}}/>
                    <img src="assets/icons/ic_star_outline_24px.svg"
                        style={{'width': '18px', 'height': '18px'}}/>
                    <img src="assets/icons/ic_star_outline_24px.svg"
                        style={{'width': '18px', 'height': '18px'}}/>

                    <Link to="photoDetails" params={{photoId:this.props.photo.id}}>
                    <img src="assets/icons/ic_edit_24px.svg"
                        className="pull-right"
                        style={{'width': '24px', 'height': '24px'}}/></Link>
                </div>
            </div>
        );
    }
});

module.exports = PhotoThumbnail;
