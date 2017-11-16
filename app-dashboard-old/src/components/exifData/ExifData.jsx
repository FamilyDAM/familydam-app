

/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var proj4 = require('proj4');
var GeoPoint = require('./../../assets/js/GeoPoint');

import {
    Subheader
} from 'material-ui';

var ExifData = React.createClass({

    propTypes: {
        exif: React.PropTypes.object
    },


    getDefaultProps: function(){
        return {}
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

        if( !this.props.exif )return(<div/>);

        var exif = {
            "make":"",
            "model":"",
            "focal_length":"",
            "lens_specification":"",
            "f_number":"",
            "shutter_speed":"",
            "iso_speed":"",
            "flash":""
        };

        try
        {

            //pull out values
            if( this.props.exif['Exif IFD0'] && this.props.exif['Exif IFD0']['Make'] )
            {
                exif.make = this.props.exif['Exif IFD0']['Make'].description;
            }else if( this.props.exif['Exif SubIFD'] && this.props.exif['Exif SubIFD']['Make'] )
            {
                exif.make = this.props.exif['Exif SubIFD']['Make'].description;
            }else if( this.props.exif['Xmp'] && this.props.exif['Xmp']['Make'] )
            {
                exif.make = this.props.exif['Xmp']['Make'].description;
            }

            if( this.props.exif['Exif IFD0'] && this.props.exif['Exif IFD0']['Model'] )
            {
                exif.model = this.props.exif['Exif IFD0']['Model'].description;
            }else if( this.props.exif['Exif SubIFD'] && this.props.exif['Exif SubIFD']['Model'] )
            {
                exif.model = this.props.exif['Exif SubIFD']['Model'].description;
            }else if( this.props.exif['Xmp'] && this.props.exif['Xmp']['Model'] )
            {
                exif.model = this.props.exif['Xmp']['Model'].description;
            }

            if( this.props.exif['Exif IFD0'] && this.props.exif['Exif IFD0']['Focal_Length'] )
            {
                exif.focal_length = this.props.exif['Exif IFD0']['Focal_Length'].description;
            }else if( this.props.exif['Exif SubIFD'] && this.props.exif['Exif SubIFD']['Make'] )
            {
                exif.focal_length = this.props.exif['Exif SubIFD']['Focal_Length'].description;
            }else if( this.props.exif['Xmp'] && this.props.exif['Xmp']['Focal_Length'] )
            {
                exif.focal_length = this.props.exif['Xmp']['Focal_Length'].description;
            }

            if( this.props.exif['Exif IFD0'] && this.props.exif['Exif IFD0']['Lens_Specification'] )
            {
                exif.lens_specification = this.props.exif['Exif IFD0']['Lens_Specification'].description;
            }else if( this.props.exif['Exif SubIFD'] && this.props.exif['Exif SubIFD']['Lens_Specification'] )
            {
                exif.lens_specification = this.props.exif['Exif SubIFD']['Lens_Specification'].description;
            }else if( this.props.exif['Xmp'] && this.props.exif['Xmp']['Lens_Specification'] )
            {
                exif.lens_specification = this.props.exif['Xmp']['Lens_Specification'].description;
            }

            if( this.props.exif['Exif IFD0'] && this.props.exif['Exif IFD0']['F-Number'] )
            {
                exif.f_number = this.props.exif['Exif IFD0']['F-Number'].description;
            }else if( this.props.exif['Exif SubIFD'] && this.props.exif['Exif SubIFD']['F-Number'] )
            {
                exif.f_number = this.props.exif['Exif SubIFD']['F-Number'].description;
            }else if( this.props.exif['Xmp'] && this.props.exif['Xmp']['F-Number'] )
            {
                exif.f_number = this.props.exif['Xmp']['F-Number'].description;
            }

            if( this.props.exif['Exif IFD0'] && this.props.exif['Exif IFD0']['Shutter_Speed_Value'] )
            {
                exif.shutter_speed = this.props.exif['Exif IFD0']['Shutter_Speed_Value'].description;
            }else if( this.props.exif['Exif SubIFD'] && this.props.exif['Exif SubIFD']['Shutter_Speed_Value'] )
            {
                exif.shutter_speed = this.props.exif['Exif SubIFD']['Shutter_Speed_Value'].description;
            }else if( this.props.exif['Xmp'] && this.props.exif['Xmp']['Shutter_Speed_Value'] )
            {
                exif.shutter_speed = this.props.exif['Xmp']['Shutter_Speed_Value'].description;
            }

            if( this.props.exif['Exif IFD0'] && this.props.exif['Exif IFD0']['ISO_Speed_Ratings'] )
            {
                exif.iso_speed = this.props.exif['Exif IFD0']['ISO_Speed_Ratings'].description;
            }else if( this.props.exif['Exif SubIFD'] && this.props.exif['Exif SubIFD']['ISO_Speed_Ratings'] )
            {
                exif.iso_speed = this.props.exif['Exif SubIFD']['ISO_Speed_Ratings'].description;
            }else if( this.props.exif['Xmp'] && this.props.exif['Xmp']['ISO_Speed_Ratings'] )
            {
                exif.iso_speed = this.props.exif['Xmp']['ISO_Speed_Ratings'].description;
            }

            if( this.props.exif['Exif IFD0'] && this.props.exif['Exif IFD0']['Flash'] )
            {
                exif.flash = this.props.exif['Exif IFD0']['Flash'].description;
            }else if( this.props.exif['Exif SubIFD'] && this.props.exif['Exif SubIFD']['Flash'] )
            {
                exif.flash = this.props.exif['Exif SubIFD']['Flash'].description;
            }else if( this.props.exif['Xmp'] && this.props.exif['Xmp']['Flash'] )
            {
                exif.flash = this.props.exif['Xmp']['Flash'].description;
            }

            return (
                <div className="ExifDataComponent">

                    <Subheader style={{'display':'flex', 'alignItems':'flex-start'}}>Camera Info</Subheader>

                    <table >
                        <tbody>
                        <tr>
                            <td style={{'width': '60px'}}>
                                <img src="assets/icons/ic_photo_camera_48px.svg"
                                     style={{'width': '48px', 'height': '48px'}}/>
                            </td>
                            <td colSpan="3">
                                <h6>
                                    {exif.make} {exif.model}<br/>
                                    {exif.f_number}  {exif.focal_length}<br/>
                                    {exif.shutter_speed} {exif.iso_speed.length>0?exif.iso_speed+' ISO':''}<br/>
                                    {exif.lens_specification}<br/>
                                </h6>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            )

        }catch(err_){
            console.log("Error Rendering ExifData Component");
            console.dir(err_);

            return (<div></div>)
        }
    }

});

module.exports = ExifData;
