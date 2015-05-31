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

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
var TokenField = require('bootstrap-tokenfield');


var Tags = React.createClass({

    propTypes: {
        tags: React.PropTypes.array,
        onRemove: React.PropTypes.func,
        onAdd: React.PropTypes.func
    },

    getDefaultProps: function(){
        return {'tags':[], title:"Tags"}
    },

    getInitialState: function(){
        return {}
    },

    componentDidMount: function(){
        var _this = this;
        $(this.refs.tokenField.getDOMNode()).tokenfield()
        $(this.refs.tokenField.getDOMNode()).on('tokenfield:createdtoken', function(event_){
            //console.dir(event_.attrs.value);

            if( _this.props.onAdd  != undefined ){
                _this.props.onAdd(event_.attrs.value);
            }

        });
        $(this.refs.tokenField.getDOMNode()).on('tokenfield:removedtoken', function(event_){
            //console.dir(event_.attrs.value);

            if( _this.props.onRemove != undefined ){
                _this.props.onRemove(event_.attrs.value);
            }
        });
    },

    componentWillReceiveProps: function(nextProps) {
        this.props = nextProps;

        if( nextProps['tags'] != undefined )
        {
            $(this.refs.tokenField.getDOMNode()).tokenfield('setTokens', nextProps['tags']);
        }
    },

    componentWillUnmount: function(){

    },

    handleOnChange: function(){
        //do nothing
    },


    render: function() {

        return (

            <div className="TagComponent input-group" >
                <span className="input-group-addon">{this.props.title}:</span>
                <input type="text" ref="tokenField"
                    placeholder="Enter Tags"
                    defaultValue={this.props.tags} />
            </div>

        );
    }

});

module.exports = Tags;
