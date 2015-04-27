/*
 * This file is part of FamilyDAM Project.
 *
 *     The FamilyDAM Project is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     The FamilyDAM Project is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with the FamilyDAM Project.  If not, see <http://www.gnu.org/licenses/>.
 */

/** @jsx React.DOM */
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
                'Model':{'description':''}
            },
            'Exif SubIFD':{
                'Focal_Length':{'description':''},
                'Lens_Specification':{'description':''},
                'F-Number':{'description':''},
                'Focal_Length':{'description':''},
                'Shutter_Speed_Value':{'description':''},
                'ISO_Speed_Ratings':{'description':''},
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


        return (
            <div className="ExifDataComponent" >

                <h5>Camera Settings:</h5>
                <table >
                    <tr>
                        <td style={{'width': '60px'}}>
                            <img src="assets/icons/ic_photo_camera_48px.svg" style={{'width': '48px', 'height': '48px'}}/>
                        </td>
                        <td colSpan="3" >
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
    }

});

module.exports = ExifData;
