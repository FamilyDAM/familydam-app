/*
 * Tag Input Field
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var Packery = require('isotope-packery');
var Isotope = require('isotope-layout');
var Thumbnail = require('./Thumbnail.jsx');

var ImageActions = require('../../actions/ImageActions');


module.exports = React.createClass({


    getDefaultProps: function () {
        return {
            id: 'isotope1',
            images: [],
            layoutMode: 'packery',
            options: {
                gutter: 4,
                isFitWidth: true
            }
        }
    },

    getInitialState: function () {
        return {
            cntrlPressed:false,
            shiftPressed:false
        }
    },

    shouldComponentUpdate(nextProps, nextState)
    {
        return this.props.images.length !== nextProps.images.length;
    },


    componentWillReceiveProps: function (nextProps) {
        this.props = nextProps;
        //this.initializeGrid();
    },

    componentDidMount: function () {
        var _this = this;
        this.initializeGrid();

        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
        window.addEventListener("keyup", this.handleOnKeyUp);
        window.addEventListener("keydown", this.handleOnKeyDown);

        this.selectImageSubscription = ImageActions.selectImage.subscribe(this.handleItemClick);
    },

    componentWillUnmount: function () {
        window.removeEventListener("resize", this.updateDimensions);
        window.removeEventListener("keyup", this.handleOnKeyUp);
        window.removeEventListener("keydown", this.handleOnKeyDown);

        if( this.selectImageSubscription !== undefined ){
            this.selectImageSubscription.dispose();
        }
    },

    componentDidUpdate: function () {
        this.initializeGrid();

    },


    updateDimensions: function () {
        this.setState({width: $(window).width(), height: ($(window).height() - 130) + 'px'});
        try
        {
            //console.log("isotope grid = " + $('#' + this.props.id).width());
            this.setState({bodyWidth: $('.isotope-grid').width()});
        } catch (err)
        {
            /*swallow*/
        }
    },


    handleOnKeyUp:function(e){
        var key = e.keyCode ? e.keyCode : e.which;
        if (key == 91 || key == 17) { //command or control
            this.state.cntrlPressed = false;
        }
        else if (key == 16) { //shift
            this.state.shiftPressed = false;
        }
    },


    handleOnKeyDown:function(e){
        var key = e.keyCode ? e.keyCode : e.which;
        if (key == 91 || key == 17) { //command or control
            this.state.cntrlPressed = true;
        }
        else if (key == 16) { //shift
            this.state.shiftPressed = true;
        }
    },




    imageClickedHandler: function(e)
    {
        ImageActions.selectImage.onNext(e);
    },


    handleItemClick: function(e)
    {
        var _lastIndex = -1;
        var _currentIndex = -1;

        // find last selected photo index
        for (var i = 0; i < this.props.images.length; i++)
        {
            var _file = this.props.images[i];
            if (_file == this.state.lastSelectedImage)
            {
                _lastIndex = i;
                break;
            }
        }

        // find current selected photo index
        for (var j = 0; j < this.props.images.length; j++)
        {
            var _file = this.props.images[j];
            if( _file == e ){
                _currentIndex = j;
                _file.active = true;
                this.state.lastSelectedImage = _file;
            }else if( !this.state.cntrlPressed && !this.state.shiftPressed ) {
                _file.active = false;
            }
        }


        //flag everything in between.
        if( this.state.shiftPressed && _lastIndex > -1 && _currentIndex > -1){
            for (var x = Math.min(_lastIndex, _currentIndex); x < Math.max(_lastIndex, _currentIndex); x++)
            {
                var _file2 = this.props.images[x];
                _file2.active = true;
            }
        }


        if( this.props.onToggle !== undefined ){
            this.props.onToggle();
        }

        if (this.isMounted()) this.forceUpdate();
    },

    initializeGrid: function () {

        var args = {
            itemSelector: '.' + this.props.id + '-item',
            layoutMode: this.props.layoutMode
        };
        args[this.props.layoutMode] = this.props.options;
        this.state.isotopeGrid = new Isotope('#' + this.props.id, args);

    },



    render: function () {

        try
        {
            return (
                <div id={this.props.id} ref="isotopeGrid" className="isotope-grid">
                    {this.props.images.map(function (item_) {
                        var _size = 200;
                        if (this.state.bodyWidth !== undefined)
                        {
                            var _segments = Math.floor(this.state.bodyWidth/_size);

                            _size = Math.max(_size, Math.floor((this.state.bodyWidth-(_segments*5)) / _segments));
                            //_size = Math.floor(this.state.bodyWidth / 5);
                        }
                        var _class = this.props.id + '-item' +" isotope-grid-item";
                        var _width = _size;
                        var _height = _size;
                        //portrait
                        if (item_.aspectRatio < 1)
                        {
                            _class = this.props.id + '-item' + " isotope-grid-item isotope-grid-item-portrait";
                            _height = Math.floor(_width / item_.aspectRatio);
                        }
                        //landscape
                        else if (item_.aspectRatio > 1)
                        {
                            _class = this.props.id + '-item' + " isotope-grid-item isotope-grid-item-wide";
                            _height = Math.floor(_width / item_.aspectRatio);
                        }

                        var _imgHeight = _height;// - 40;
                        var _imgWidth = _width;

                        return (
                            <div id={this.props.id +'-item'}
                                 key={item_.id}
                                 data-width={item_.width}
                                 data-height={item_.height}
                                 className={_class}
                                 style={{'width':_width+'px', 'height':_height+'px'}}>

                                <Thumbnail photo={item_}
                                           imgWidth={_imgWidth} imgHeight={_imgHeight}
                                           selected={item_.active}
                                            onImageClick={this.imageClickedHandler}/>

                            </div> );
                    }.bind(this))}
                </div>
            );
        } catch (err_)
        {
            debugger;
            console.log(err_);
        }
    }

});

