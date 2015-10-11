

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


var ExifData = React.createClass({

    propTypes: {
        exif: React.PropTypes.object
    },


    getDefaultProps: function(){
        return {'exif': {
            'Exif IFD0':{
                'Make':{'description':''},
                'Model':{'description':''},
                'Focal_Length':{'description':''},
                'Lens_Specification':{'description':''},
                'F-Number':{'description':''},
                'Shutter_Speed_Value':{'description':''},
                'ISO_Speed_Ratings':{'description':''}
            },
            'Exif SubIFD':{
                'Flash':{'description':''}
            }
        }}
    },

    getInitialState: function(){
        return {}
    },

    componentWillMount: function() {

    },


    handleOnChange: function(){
        //do nothing
    },


    render: function() {
        var _this = this;
        try
        {
            if( this.props.exif == undefined ){
                this.props.exif = {};
            }

            if (this.props.exif['Exif IFD0'] === undefined)
            {
                this.props.exif['Exif IFD0'] = {};
            }
            if (this.props.exif['Exif SubIFD'] === undefined)
            {
                this.props.exif['Exif SubIFD'] = {};
            }

            if (this.props.exif['Exif IFD0']['Make'] === undefined)
            {
                this.props.exif['Exif IFD0']['Make'] = {};
            }
            if (this.props.exif['Exif IFD0']['Make'].description === undefined)
            {
                this.props.exif['Exif IFD0']['Make'].description = "";
            }

            if (this.props.exif['Exif IFD0']['Model'] === undefined)
            {
                this.props.exif['Exif IFD0']['Model'] = {};
            }
            if (this.props.exif['Exif IFD0']['Model'].description === undefined)
            {
                this.props.exif['Exif IFD0']['Model'].description = "";
            }

            if (this.props.exif['Exif IFD0']['Focal_Length'] === undefined)
            {
                this.props.exif['Exif IFD0']['Focal_Length'] = {};
            }
            if (this.props.exif['Exif IFD0']['Focal_Length'].description === undefined)
            {
                this.props.exif['Exif IFD0']['Focal_Length'].description = "";
            }

            if (this.props.exif['Exif IFD0']['Lens_Specification'] === undefined)
            {
                this.props.exif['Exif IFD0']['Lens_Specification'] = {};
            }
            if (this.props.exif['Exif IFD0']['Lens_Specification'].description === undefined)
            {
                this.props.exif['Exif IFD0']['Lens_Specification'].description = "";
            }

            if (this.props.exif['Exif IFD0']['F-Number'] === undefined)
            {
                this.props.exif['Exif IFD0']['F-Number'] = {};
            }
            if (this.props.exif['Exif IFD0']['F-Number'].description === undefined)
            {
                this.props.exif['Exif IFD0']['F-Number'].description = "";
            }

            if (this.props.exif['Exif IFD0']['Focal_Length'] === undefined)
            {
                this.props.exif['Exif IFD0']['Focal_Length'] = {};
            }
            if (this.props.exif['Exif IFD0']['Focal_Length'].description === undefined)
            {
                this.props.exif['Exif IFD0']['Focal_Length'].description = "";
            }

            if (this.props.exif['Exif IFD0']['Shutter_Speed_Value'] === undefined)
            {
                this.props.exif['Exif IFD0']['Shutter_Speed_Value'] = {};
            }
            if (this.props.exif['Exif IFD0']['Shutter_Speed_Value'].description === undefined)
            {
                this.props.exif['Exif IFD0']['Shutter_Speed_Value'].description = "";
            }

            if (this.props.exif['Exif IFD0']['ISO_Speed_Ratings'] === undefined)
            {
                this.props.exif['Exif IFD0']['ISO_Speed_Ratings'] = {};
            }
            if (this.props.exif['Exif IFD0']['ISO_Speed_Ratings'].description === undefined)
            {
                this.props.exif['Exif IFD0']['ISO_Speed_Ratings'].description = "";
            }

            if (this.props.exif['Exif SubIFD']['Flash'] === undefined)
            {
                this.props.exif['Exif SubIFD']['Flash'] = {};
            }
            if (this.props.exif['Exif SubIFD']['Flash'].description === undefined)
            {
                this.props.exif['Exif SubIFD']['Flash'].description = "";
            }


            return (
                <div className="ExifDataComponent">

                    <h5>Camera Settings:</h5>
                    <table >
                        <tr>
                            <td style={{'width': '60px'}}>
                                <img src="assets/icons/ic_photo_camera_48px.svg"
                                     style={{'width': '48px', 'height': '48px'}}/>
                            </td>
                            <td colSpan="3">
                                <h6>
                                    {this.props.exif['Exif IFD0']['Make'].description} {this.props.exif['Exif IFD0']['Model'].description}<br/>
                                    {this.props.exif['Exif SubIFD']['Focal_Length'].description}<br/>
                                    {this.props.exif['Exif SubIFD']['Lens_Specification'].description}<br/>
                                </h6>
                            </td>
                        </tr>
                    </table>
                    <br/>
                    <table style={{'width':'300px', 'borderSpacing':'0px', 'padding':'0px'}}>
                        <tr>
                            <td colSpan="2" style={{'width':'50%'}}>
                                <h6><img src="assets/icons/ic_photo_camera_48px.svg"
                                         style={{'width': '18px', 'height': '18px'}}/>
                                    &nbsp;{this.props.exif['Exif SubIFD']['F-Number'].description}</h6>
                            </td>
                            <td colSpan="2" style={{'width':'50%'}}>
                                <h6><img src="assets/icons/ic_photo_camera_48px.svg"
                                         style={{'width': '18px', 'height': '18px'}}/>
                                    &nbsp;{this.props.exif['Exif SubIFD']['Focal_Length'].description}</h6>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <h6><img src="assets/icons/ic_photo_camera_48px.svg"
                                         style={{'width': '18px', 'height': '18px'}}/>
                                    &nbsp;{this.props.exif['Exif SubIFD']['Shutter_Speed_Value'].description}</h6>
                            </td>
                            <td colSpan="2">
                                <h6><img src="assets/icons/ic_photo_camera_48px.svg"
                                         style={{'width': '18px', 'height': '18px'}}/>
                                    &nbsp;{this.props.exif['Exif SubIFD']['ISO_Speed_Ratings'].description} ISO</h6>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <h6><img src="assets/icons/ic_photo_camera_48px.svg"
                                         style={{'width': '18px', 'height': '18px'}}/>
                                    &nbsp;Flash: {this.props.exif['Exif SubIFD']['Flash'].description}</h6>
                            </td>
                            <td colSpan="2">

                            </td>
                        </tr>
                    </table>
                </div>
            )

        }catch(err_){
            //console.log("Error Rendering ExifData Component");
            //console.dir(err_);

            return (<div></div>)
        }
    }

});

module.exports = ExifData;
