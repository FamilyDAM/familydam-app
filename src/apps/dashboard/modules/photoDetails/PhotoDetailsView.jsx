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
var Router = require('react-router');
var Link = Router.Link;

var FolderTree = require('../../components/folderTree/FolderTree');

var PhotoDetailsView = React.createClass({


    render: function() {

        return (
            <div className="photoDetailsView container-fluid">
                <div  className="row">
                    <aside className="col-sm-2" >
                        <FolderTree/>
                    </aside>

                    <section className="col-sm-10" style={{'borderLeft':'1px solid #eee'}}>
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-10">
                                    <img src="http://lorempixel.com/500/500/abstract/" className="center-block" />
                                </div>
                            </div>


                            <div className="row">
                                <br/>
                                <hr style={{'width':'100%'}}/>
                                <br/>
                            </div>


                            <div className="row">
                                <div className="col-sm-6" style={{'border':'1px solid #ccc'}}>
                                    Notes:
                                    <textarea style={{'width':'300px', 'height': '150px'}}/>


                                    <div style={{'padding':'5px'}}>
                                        <a href="http://"
                                            style={{'padding':'10px', 'fontSize':'12px', 'textDecoration':'none', 'color': '#87A800'}}>Landscape</a>
                                        <a href="http://"
                                            style={{'padding':'10px', 'fontSize':'12px', 'textDecoration':'none', 'color': '#87A800'}}>kids</a>
                                        <a href="http://"
                                            style={{'padding':'10px;', 'fontSize':'19px;', 'textDecoration':'none', 'color': '#87A800'}}>Hailey</a>
                                        <a href="http://"
                                            style={{'padding':'10px', 'fontSize':'16px', 'textDecoration':'none', 'color': '#039FAF'}}>Kayden</a>
                                        <a href="http://"
                                            style={{'padding':'10px', 'fontSize':'14px', 'textDecoration':'none', 'color': '#039FAF'}}>mike</a><br/>
                                        <a href="http://"
                                            style={{'padding':'10px', 'fontSize':'16px', 'textDecoration':'none', 'color': '#DE2159;'}}>Angie</a>
                                        <a href="http://"
                                            style={{'padding':'10px','fontSize':'12px','textDecoration':'none', 'color': '#DE2159'}}>Vacation</a>
                                        <a href="http://"
                                            style={{'padding':'10px','fontSize':'12px','textDecoration':'none', 'color': '#87A800;'}}>Work</a>
                                        <a href="http://"
                                            style={{'padding':'10px','fontSize':'16px','textDecoration':'none', 'color': '#FF7600'}}>Baseball</a><br/>
                                        <a href="http://"
                                            style={{'padding':'10px','fontSize':'19px','textDecoration':'none', 'color': '#87A800'}}>Birthday</a>
                                        <a href="http://"
                                            style={{'padding':'10px','fontSize':'16px','textDecoration':'none', 'color': '#039FAF'}}>School</a>
                                        <a href="http://"
                                            style={{'padding':'10px','fontSize':'14px','textDecoration':'none', 'color':'#039FAF'}}>B&W</a>
                                    </div>
                                </div>


                                <div className="col-sm-6">

                                    <div>
                                        <img src="https://maps.googleapis.com/maps/api/staticmap?center=Brooklyn+Bridge,New+York,NY&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7Clabel:C%7C40.718217,-73.998284"
                                            style={{'width':'300px'}}/>
                                        <br/>

                                        Naperville, IL<br/>
                                        48.12314 / -123.1235123
                                    </div>

                                    <hr style={{'margin-top': '15px', 'margin-bottom': '15px'}}/>

                                    <table >
                                        <tr>
                                            <td style={{'width': '50px'}}>
                                                <img src="assets/icons/ic_photo_camera_48px.svg"
                                                    style={{'width': '48px', 'height': '48px'}}/>
                                            </td>
                                            <td colspan="3" style={{'width':'100%'}}>
                                                Nikon D90<br/>
                                                10mm - 200mm<br/>
                                                f/3.5-5.6 IS
                                            </td>
                                        </tr>
                                    </table>

                                    <table >
                                        <tr>
                                            <td colspan="2" style={{'width':'50%'}}>
                                                <img src="assets/icons/ic_photo_camera_48px.svg"
                                                    style={{'width': '12px', 'height': '12px'}}/>
                                                    f/4.0
                                            </td>
                                            <td colspan="2" style={{'width':'50%'}}>
                                                <img src="assets/icons/ic_photo_camera_48px.svg"
                                                    style={{'width': '12px', 'height': '12px'}}/>
                                                    50mm
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="2">
                                                <img src="assets/icons/ic_photo_camera_48px.svg"
                                                    style={{'width': '12px', 'height': '12px'}}/>
                                                    1/400
                                            </td>
                                            <td colspan="2">

                                                <img src="assets/icons/ic_photo_camera_48px.svg"
                                                    style={{'width': '12px', 'height': '12px'}}/>
                                                    200ISO
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="2">
                                                <img src="assets/icons/ic_photo_camera_48px.svg"
                                                    style={{'width': '12px', 'height': '12px'}}/>
                                                    Flash:OFF
                                            </td>
                                            <td colspan="2">

                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </section>

                </div>
            </div>

        );
    }

});

module.exports = PhotoDetailsView;
