/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
/** jsx React.DOM */
var React = require('react');
import {Router, Link} from 'react-router';
import CheckBoxIcon from 'material-ui/svg-icons/toggle/check-box';

import LazyLoad from 'react-lazy-load';
var ProgressiveImage = require('react-progressive-image').default;
var LoadingIcon = require('../../components/loadingIcon/LoadingIcon.jsx');


import {
    GridList,
    GridTile,
    Subheader,
    IconButton
} from 'material-ui';

var ImageActions = require('../../actions/ImageActions');

var GridGroup = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
        return {
            images: []
        }
    },


    componentDidMount: function () {
        this.state.images = document.getElementsByTagName('img');
        //console.log("{componentDidMount}found images:" + this.state.images.length);

        //this._lazyLoadImages();
        //window.onscroll = this._lazyLoadImages;
    },

    componentDidUpdate: function () {
        //console.log("{componentDidUpdate} images=" +this.state.images.length);
        //this._lazyLoadImages();
    },


    /**
     _lazyLoadImages: function () {
        //console.log("{_lazyLoadImages}");
        for (var i = 0; i < this.state.images.length; i++)
        {
            var _img = this.state.images[i];
            if (this._scrolledIntoView(_img))
            {
                if (_img.getAttribute('data-src'))
                {
                    //console.log("swap image:" + _img.getAttribute('data-src'));
                    _img.setAttribute('src', _img.getAttribute('data-src'));
                }
            } else
            {
                //set it back to empty when we scroll out of view, clear memory
                //_img.setAttribute('src', "data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=");
            }
        }
    },
     **/

    _scrolledIntoView: function (element) {
        var coords = element.getBoundingClientRect();
        return ((coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight));
    },


    imageClickedHandler: function (e) {
        ImageActions.selectImage.onNext(e);
    },


    render: function () {

        //console.log("{MaterialGallery.GridGroup} Start Render() | groups:" + this.props.groups.length);
        return (
            <div className="row" style={{'width': '100%', 'padding': '20px'}}>

                {this.props.groups.map(function (item_, indx_) {

                    return (
                        <div className="col-xs-12" key={item_.label} style={{'marginBottom': '40px'}}>
                            <Subheader>{item_.label}</Subheader>

                            <div className="row">
                                {item_.children.map(function (img_, indx_) {

                                    var imgBoxStyle = {
                                        'height': '200px',
                                        'border': '1px solid #eeeeee',
                                        'padding':'0px'
                                    };
                                    if (img_.active) {
                                        imgBoxStyle['border'] = '1px solid #cccccc';
                                    }

                                    var checkBoxStyle = {
                                        'width': '40px',
                                        'height': '40px',
                                        'position': 'absolute',
                                        'right': '10px',
                                        'top': '10px',
                                        'display': 'none'
                                    }
                                    if (img_.active) {
                                        checkBoxStyle['display'] = 'inline';
                                    }

                                    return (
                                        <div
                                            className="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xlg-2"
                                            key={img_.path}
                                            style={imgBoxStyle}>
                                            <div
                                                style={{
                                                    'width': '100%',
                                                    'height': '100%',
                                                    'position': 'relative',
                                                    'display': 'flex'
                                                }}>

                                                <ProgressiveImage src={img_.src} placeholder="assets/images/spinner-sm.gif">
                                                    {(src) => <img src={src}
                                                                   style={{
                                                                       'maxHeight': '100%',
                                                                       'maxWidth': '100%',
                                                                       'margin': 'auto'
                                                                   }}
                                                                   onClick={ ()=> {
                                                                       ImageActions.selectImage.onNext(img_);
                                                                   } }/>}
                                                </ProgressiveImage>

                                                <img src="assets/images/blue-checkbox.png"
                                                     style={checkBoxStyle}/>

                                                <div style={{
                                                    'position': 'absolute',
                                                    'left': '0px',
                                                    'right': '0px',
                                                    'bottom': '0px',
                                                    'height': '48px',
                                                    'display': 'flex',
                                                    'alignItems': 'center',
                                                    'background': 'rgba(0, 0, 0, 0.4)'
                                                }}>
                                                    <span style={{
                                                        'fontSize': '12px',
                                                        'fontSize': '1.2rem',
                                                        'color': 'white',
                                                        'position': 'absolute',
                                                        'left': '1rem',
                                                        'right': '5rem'
                                                    }}>{img_.name}</span>
                                                    <IconButton
                                                        iconClassName="material-icons"
                                                        style={{'position': 'absolute', 'right': '1rem'}}
                                                        onClick={() => {
                                                            this.context.router.push({
                                                                pathname: 'photos/details',
                                                                query: {path: img_.path}
                                                            })
                                                        }}
                                                        iconStyle={{'color': 'white'}}>launch</IconButton>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }.bind(this))}

                            </div>
                        </div>

                    );

                }.bind(this))}
            </div>
        );
    },

    renderOrig: function () {

        //console.log("{MaterialGallery.GridGroup} Start Render() | groups:" + this.props.groups.length);
        return (
            <div key="g1" style={{'width': '100%', 'padding': '20px'}}>

                {this.props.groups.map(function (item_, indx_) {
                    return (
                        <div key={item_.label}>
                            <Subheader>{item_.label}</Subheader>
                            <GridList
                                cols={5}
                                cellHeight={200}
                                style={{'overflowY': 'auto', 'marginBottom': '24px'}}>

                                {item_.children.map((img_) => (
                                    <GridTile
                                        key={img_.path}
                                        title={' '}
                                        style={img_.active ? {'border': '2px solid blue'} : {}}
                                        subtitle={<span>{img_.name}</span>}
                                        actionIcon={<IconButton
                                            iconClassName="material-icons"
                                            onClick={() => {
                                                this.context.router.push({
                                                    pathname: 'photos/details',
                                                    query: {path: img_.path}
                                                })
                                            }}
                                            iconStyle={{'color': 'white'}}>launch</IconButton>}>
                                        <img
                                            src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                                            data-src={img_.src}
                                            onClick={ ()=> {
                                                ImageActions.selectImage.onNext(img_);
                                            } }/>

                                    </GridTile>
                                ))}

                            </GridList>
                        </div>

                    );

                }.bind(this))}
            </div>
        );
    }
});


module.exports = React.createClass({

    getDefaultProps: function () {
        return {
            isLoading: false,
            files: []
        }
    },

    getInitialState: function () {
        return {
            cntrlPressed: false,
            shiftPressed: false
        }
    },

    componentDidMount: function () {
        window.addEventListener("keyup", this.handleOnKeyUp);
        window.addEventListener("keydown", this.handleOnKeyDown);

        this.selectImageSubscription = ImageActions.selectImage.subscribe(this.handleItemClick);
    },

    componentWillUnmount: function () {
        window.removeEventListener("keyup", this.handleOnKeyUp);
        window.removeEventListener("keydown", this.handleOnKeyDown);

        if (this.selectImageSubscription !== undefined) {
            this.selectImageSubscription.dispose();
        }
    },


    handleOnKeyUp: function (e) {
        var key = e.keyCode ? e.keyCode : e.which;
        if (key == 91 || key == 17) { //command or control
            this.state.cntrlPressed = false;
        }
        else if (key == 16) { //shift
            this.state.shiftPressed = false;
        }
    },


    handleOnKeyDown: function (e) {
        var key = e.keyCode ? e.keyCode : e.which;
        if (key == 91 || key == 17) { //command or control
            this.state.cntrlPressed = true;
        }
        else if (key == 16) { //shift
            this.state.shiftPressed = true;
        }
    },


    handleItemClick: function (e) {
        if (!this.state.shiftPressed) {
            this.state.lastSelectedImage = undefined;
        }

        // find current selected photo index
        var inSelectRange = false;
        for (var j = 0; j < this.props.files.length; j++) {
            var _group = this.props.files[j];

            for (var i = 0; i < _group.children.length; i++) {
                var _file = _group.children[i];
                if (this.state.lastSelectedImage && _file.path == this.state.lastSelectedImage.path) {
                    inSelectRange = true;
                }
                else if (_file.path == e.path) {
                    inSelectRange = false;
                    _file.active = true;
                    this.state.lastSelectedImage = _file;

                }
                else if (inSelectRange && this.state.shiftPressed) {
                    _file.active = true;
                }
                else if (!this.state.cntrlPressed || (this.state.shiftPressed && !inSelectRange)) {
                    _file.active = false;
                }
            }
        }


        if (this.props.onChange !== undefined) {
            this.props.onChange();
        }

        if (this.isMounted()) this.forceUpdate();
    },

    render(){

        //console.log("{MaterialGallery} Start Render() ");
        return (
            <div style={{'display': 'flex', 'flexWrap': 'wrap', 'justifyContent': 'center'}}>
                {(() => {
                    if (this.props.isLoading) {
                        return (
                            <div
                                style={{
                                    'display': 'flex',
                                    'flexWrap': 'wrap',
                                    'justifyContent': 'center',
                                    'alignItems': 'center',
                                    'height': '100vh',
                                }}>
                                <LoadingIcon/>
                            </div>
                        );

                    } else if (this.props.files.length > 0) {

                        return (
                            <GridGroup groups={this.props.files}/>
                        );
                    }
                    else {
                        return (
                            <Subheader>No items found</Subheader>
                        );
                    }
                })()}

            </div>
        );
    }
});
