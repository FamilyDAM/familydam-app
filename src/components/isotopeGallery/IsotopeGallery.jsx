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
            packery: {
                gutter: 2,
                isHorizontal: false
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
            console.log("isotope grid = " + $('#' + this.props.id).width());
            this.setState({bodyWidth: $('.isotope-grid').width()});
        } catch (err)
        {
            /*swallow*/
        }
    },

    initializeGrid: function () {
        if (this.state.isotopeGrid == undefined && this.props.images.length > 0)
        {
            this.state.isotopeGrid = new Isotope('#' + this.props.id, {
                itemSelector: '.' + this.props.id + '-item',
                layoutMode: this.props.layoutMode,
                packery: this.props.packery
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
                        var _size = 150;
                        if (this.state.bodyWidth !== undefined)
                        {
                            _size = Math.max(150, Math.floor(this.state.bodyWidth * this.state.imgScale))
                        }
                        var _class = "isotope-grid-item";
                        var _width = _size;
                        var _height = _size;
                        //portrait
                        if (item_.aspectRatio < .75)
                        {
                            _class = this.props.id + '-item' + " isotope-grid-item isotope-grid-item-portrait";
                            _height = Math.floor(_width * item_.aspectRatio);
                        }
                        //landscape
                        else if (item_.aspectRatio > 1.25)
                        {
                            _class = this.props.id + '-item' + " isotope-grid-item isotope-grid-item-wide";
                            _width = Math.floor(_height * item_.aspectRatio);
                        } else
                        {
                            //make the sq. ones bigger
                            // todo: pick a better rule to pick which ones are enlarged (5-star rating, favorites, perhaps)
                            _width = _width * 2;
                            _height = _height * 2;
                        }

                        var _imgHeight = _height;// - 40;
                        var _imgWidth = _width;

                        return (
                            <div id={this.props.id +'-item'}
                                 key={item_.id}
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

