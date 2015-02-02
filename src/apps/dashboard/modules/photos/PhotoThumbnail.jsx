
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
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Glyphicon = require('react-bootstrap').Glyphicon;

var PhotoThumbnail = React.createClass({


    handleClick: function(event) {
        if (this.props.thumbnailEventHandler !== undefined){
           this.props.thumbnailEventHandler(event, this.props.photo);
        }
    },



    render: function() {
        return (
            <div className={this.props.photo.active?'thumbnailCard active':'thumbnailCard'}>
                    <img src={this.props.photo.src}
                        style={{'margin':'auto'}}
                        onClick={this.handleClick}/>
                <br/><br/>
                <div>
                    <img src="assets/icons/ic_star_24px.svg"
                        style={{'width': '18px', 'height': '18px'}}/>
                    <img src="assets/icons/ic_star_24px.svg"
                        style={{'width': '18px', 'height': '18px'}}/>
                    <img src="assets/icons/ic_star_24px.svg"
                        style={{'width': '18px', 'height': '18px'}}/>
                    <img src="assets/icons/ic_star_outline_24px.svg"
                        style={{'width': '18px', 'height': '18px'}}/>
                    <img src="assets/icons/ic_star_outline_24px.svg"
                        style={{'width': '18px', 'height': '18px'}}/>

                    <Link to="photoDetails" params={{photoId:this.props.photo.id}}>
                    <img src="assets/icons/ic_edit_24px.svg"
                        className="pull-right"
                        style={{'width': '24px', 'height': '24px'}}/></Link>
                </div>
            </div>
        );
    }
});

module.exports = PhotoThumbnail;
