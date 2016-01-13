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
var Thumbnail = require('./Thumbnail');

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
            imgScale: 0.10
        }
    },

    componentWillReceiveProps: function (nextProps) {
        this.props = nextProps;
        //this.initializeGrid();
    },

    componentDidMount: function () {
        this.initializeGrid();

        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);

    },

    componentWillUnmount: function () {
        window.removeEventListener("resize", this.updateDimensions);
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

    initializeGrid: function () {

        var args = {
            itemSelector: '.' + this.props.id + '-item',
            layoutMode: this.props.layoutMode
        };
        args[this.props.layoutMode] = this.props.options;
        this.state.isotopeGrid = new Isotope('#' + this.props.id, args);

    },

    initializeGrid2: function () {

        if (this.state.isotopeGrid == undefined && this.props.images.length > 0)
        {

            this.state.isotopeGrid = new Isotope('#group1', {
                itemSelector: '.group1-item',
                layoutMode: 'packery',
                packery:  {
                    gutter: 2,
                    isHorizontal: false
                }
            });

        } else if (this.props.images.length > 0)
        {
            this.state.isotopeGrid.layout();
        }
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
                        var _class = "isotope-grid-item";
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

                                <Thumbnail photo={item_} imgWidth={_imgWidth} imgHeight={_imgHeight}/>

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

