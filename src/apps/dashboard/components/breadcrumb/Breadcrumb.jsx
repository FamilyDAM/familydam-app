
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
var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var NavigationActions = require('../../actions/NavigationActions');

var Breadcrumb = React.createClass({
    
    
    getInitialState: function(){
        return {'paths':[
            {'label':'Home', 'navigateTo':"/", 'params':{}, level:0}
        ]}
    },
    
    
    componentDidMount: function(){
        var _this = this;


        NavigationActions.currentPath.subscribe(
            function (path_) {
                //console.log("new path");
                //console.dir(path_);
                var _level = path_.level;
                var _paths = [];
                for (var i = 0; i < _level; i++)
                {
                    if( _this.state.paths[i] !== undefined ){
                        _paths[i] = _this.state.paths[i];
                    }
                }
                _paths[_paths.length] = path_;
                //console.dir(_paths);
                _this.state.paths = _paths;
                _this.forceUpdate();
            }
        );

    },




    render: function () {
        return (
            <div className="row">

                <div className="col-sm-12">
                    <ol className="breadcrumb" style={{'marginBottom':'0px', 'backgroundColor': 'transparent'}}>
                        {this.state.paths.map(function(path_) {
                            return <li key={path_.label} ><Link to={path_.navigateTo}  params={path_.params}>{path_.label}</Link></li>;
                        })}
                    </ol>
                </div>
            </div>
        );
    }

});

module.exports = Breadcrumb;
