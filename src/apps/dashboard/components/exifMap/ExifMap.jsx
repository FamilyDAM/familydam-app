

/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var proj4 = require('proj4');
var GeoPoint = require('./../../assets/js/GeoPoint');
var TokenField = require('bootstrap-tokenfield');


var ExifMap = React.createClass({

    propTypes: {
        gps: React.PropTypes.object
    },


    getDefaultProps: function(){
        return {'zoom': 8}
    },

    getInitialState: function(){
        return {}
    },

    componentWillMount: function() {
        this.parseGps();
    },


    componentWillReceiveProps: function(nextProps) {
        this.parseGps();
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return nextProps.latitude !== this.props.latitude
            || nextProps.longitude !== this.props.longitude;
    },

    parseGps: function() {
        if (this.props.gps != undefined)
        {
            try
            {
                var lat = this.props.gps['GPS_Latitude'].description + " " + this.props.gps['GPS_Latitude_Ref'].description;
                var lon = this.props.gps['GPS_Longitude'].description + " " + this.props.gps['GPS_Longitude_Ref'].description;

                if( this.isMounted() )
                {
                    this.setState({
                        'latitude': parseFloat(GeoPoint.getLatDec(lat)).toFixed(6),
                        'longitude': parseFloat(GeoPoint.getLonDec(lon)).toFixed(6)
                    });
                }
            } catch (err) {
                console.dir(err);
            }
        }
    },


    handleOnChange: function(){
        //do nothing
    },


    render: function() {
        var _this = this;

        var staticMap = function(){
            if( _this.state.latitude !== undefined )
            {
                return <div >
                            <h5>Location:</h5>
                            <img src={'https://maps.googleapis.com/maps/api/staticmap?center=' + _this.state.latitude + ',' + _this.state.longitude + '&zoom=' + _this.props.zoom + '&size=600x300&maptype=roadmap&sensor=false&markers=' + _this.state.latitude + ',' + _this.state.longitude + '|color:green'}
                                style={{'width': '100%'}}/>
                            <br/>
                            <h6>
                            {_this.state.latitude} / {_this.state.longitude}
                            </h6>
                        </div>
            }

        };

        return (
            <div className="PhotoMapComponent" >
            {staticMap()}
            </div>
        )
    }

});

module.exports = ExifMap;
