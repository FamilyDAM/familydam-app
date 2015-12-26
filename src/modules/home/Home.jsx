
/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Button = require('react-bootstrap').Button;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Dropdown = require('react-bootstrap').Dropdown;
var MenuItem = require('react-bootstrap').MenuItem;
var LinkContainer = require('react-router-bootstrap').LinkContainer;

var SectionTree = require('../../components/folderTree/SectionTree');
var NavigationActions = require('../../actions/NavigationActions');

var AppSidebar = require('../../components/appSidebar/AppSidebar');

module.exports = React.createClass({

    componentDidMount: function(){
        // update the breadcrumb
        var _pathData = {'label':'Home', 'navigateTo':"dashboard", 'params':{}, 'level':0};
        this.navigationActions = NavigationActions.currentPath.onNext( _pathData );
    },

    componentWillUnmount: function(){
        if( this.navigationActions !== undefined ) this.navigationActions.dispose();
    },


    render: function () {

        var asideClass = "col-xs-3 box";
        var asideStyle = {};


        return (
            <div className="container-fluid">
                <div className="row">
                    <aside className={asideClass} style={asideStyle}>

                        <ButtonGroup className="boxRow header">

                            <LinkContainer to="/dashboard" >
                                <Button><Glyphicon glyph='home'/></Button>
                            </LinkContainer>
                            <LinkContainer to="/" >
                                <Button><Glyphicon glyph='user'/></Button>
                            </LinkContainer>
                            <LinkContainer to="/" >
                                <Button><Glyphicon glyph='search'/></Button>
                            </LinkContainer>


                            <Dropdown id='dropdown-custom-1'>
                                <Dropdown.Toggle>
                                    <Glyphicon glyph='cog'/>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className='super-colors'>
                                    <LinkContainer to="/" >
                                        <MenuItem eventKey="1" to="/">User Manager</MenuItem>
                                    </LinkContainer>
                                    <LinkContainer to="/" >
                                        <MenuItem eventKey="2" to="/">Logout</MenuItem>
                                    </LinkContainer>
                                </Dropdown.Menu>
                            </Dropdown>
                        </ButtonGroup>

                        <div className="boxRow content" style={{'minHeight':'200px'}}>
                            <SectionTree title="Apps"/>
                            <AppSidebar style="list"/>
                        </div>


                    </aside>

                    <div className="col-xs-9">
                        {this.props.children}
                    </div>
                </div>
            </div>

        );
    }

});

