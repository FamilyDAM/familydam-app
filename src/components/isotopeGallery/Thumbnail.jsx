/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var LazyLoad = require('react-lazy-load');

var Glyphicon = require('react-bootstrap').Glyphicon;
var LinkContainer = require('react-router-bootstrap').LinkContainer;

module.exports = React.createClass({

    getInitialState:function(){
        return {
            active: false,
            selected: false
        }
    },

    getDefaultProps: function () {
        return {
            photo: {
                id: "",
                src: ""
            },
            selected:false
        }
    },


    shouldComponentUpdate(nextProps) {
        return this.props.photo.id !== nextProps.photo.id || this.props.selected !== nextProps.selected;
    },


    handleClick: function (event) {
        if (this.props.onImageClick !== undefined)
        {
            this.props.onImageClick(this.props.photo);
        }
    },


    render: function () {

        var styles = {
            images:{
                zIndex:1,
                margin: '5px'
            },
            overlays:{
                zIndex:2,
                position:'absolute',
                bottom:'0px',
                right:'0px',
                left:'0px',
                height:'50px',
                marginTop:'20px',
                padding:'4px',
                color:'#ffffff',
                backgroundColor:'#000000',
                opacity:.7,
                display:this.state.active?'block':'none'
            }
        };


        return (
            <div className={this.props.selected?'thumbnail-card active':'thumbnail-card'}
                 onMouseOver={ ()=>{this.setState({'active':true})} }
                 onMouseOut={ ()=>{this.setState({'active':false})} }>

                <div style={styles.images} className="text-center">
                    <LazyLoad offset="600" debounce={false}>
                    <img src={this.props.photo.src}
                         data-width={this.props.photo.width}
                         data-height={this.props.photo.height}
                         data-aspectratio={this.props.photo.aspectRatio}
                         className="lazy"
                         style={{'margin':'0 auto', 'maxWidth':this.props.imgWidth, 'maxHeight':this.props.imgHeight}}
                         onClick={this.handleClick}/>
                    </LazyLoad>
                </div>

                <div style={styles.overlays}>
                    <div className="pull-left">
                        <span>{this.props.photo.name} </span>
                    </div><br/>
                    <div className="pull-left">
                        <LinkContainer to="photos/details" query={{'path':this.props.photo.path}}>
                            <Glyphicon glyph="eye-open" style={{'color':'#ffffff', 'fontSize':'24px'}}/></LinkContainer>
                    </div>
                </div>
            </div>
        );
    }
});



