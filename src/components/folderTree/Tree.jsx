'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Treebeard = require('react-treebeard').Treebeard;
var Glyphicon = require('react-bootstrap').Glyphicon;

var FileActions = require('./../../actions/FileActions');
var DirectoryActions = require('./../../actions/DirectoryActions');
var DirectoryStore = require('./../../stores/DirectoryStore');


var animations = {
    toggle: (props) => {
        return {
            animation: {rotateZ: props.node.toggled ? 90 : 0},
            duration: 100
        };
    },
    drawer: (/* props */) => {
        return {
            enter: {
                animation: 'slideDown',
                duration: 100
            },
            leave: {
                animation: 'slideUp',
                duration: 100
            }
        };
    }
};


var styles = {
    tree: {
        base: {
            listStyle: 'none',
            backgroundColor: '#ffffff',
            margin: 0,
            padding: 0,
            color: '#333333'
        },
        node: {
            base: {
                position: 'relative'
            },
            link: {
                cursor: 'pointer',
                position: 'relative',
                padding: '0px 5px',
                display: 'block'
            },
            activeLink: {
                background: '#ffffff'
            },
            toggle: {
                base: {
                    position: 'relative',
                    display: 'inline-block',
                    verticalAlign: 'top',
                    marginLeft: '-5px',
                    height: '24px',
                    width: '24px'
                },
                wrapper: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    margin: '-7px 0 0 -7px',
                    height: '14px'
                },
                height: 14,
                width: 14,
                arrow: {
                    fill: '#333333',
                    strokeWidth: 0
                }
            },
            header: {
                base: {
                    display: 'inline-block',
                    verticalAlign: 'top',
                    color: '#0000'
                },
                connector: {
                    width: '2px',
                    height: '12px',
                    borderLeft: 'solid 2px black',
                    borderBottom: 'solid 2px black',
                    position: 'absolute',
                    top: '0px',
                    left: '-21px'
                },
                title: {
                    lineHeight: '24px',
                    verticalAlign: 'middle'
                }
            },
            subtree: {
                listStyle: 'none',
                paddingLeft: '19px'
            },
            loading: {
                color: '#000000'
            }
        }
    }
};


module.exports = React.createClass({


    getInitialState: function () {
        return {
            treeData: []
        }
    },


    componentWillMount: function () {
        // trigger a directory reload
        this.directoryStore = DirectoryActions.getDirectories.source.onNext(this.props.baseDir);

        // listen for trigger to reload for files in directory
        this.refreshDirectoriesSubscription = DirectoryActions.refreshDirectories.subscribe(function (data_) {
            DirectoryActions.getDirectories.source.onNext(undefined);
            DirectoryActions.getDirectories.source.onNext(this.props.baseDir);
        }.bind(this));

        //Listen for directory changes
        this.directoriesSubscription = DirectoryStore.directories.subscribe(function (data_) {
            this.state.treeData = data_;
            if (this.isMounted()) this.forceUpdate();
        }.bind(this));
    },


    componentWillUnmount: function () {
        if (this.refreshDirectoriesSubscription !== undefined)
        {
            this.refreshDirectoriesSubscription.dispose();
        }
        if (this.directoriesSubscription !== undefined)
        {
            this.directoriesSubscription.dispose();
        }
    },


    onToggle: function (node, toggled) {
        if (this.state.cursor)
        {
            this.state.cursor.active = false;
        }
        node.active = true;
        if (node.children)
        {
            node.toggled = toggled;
        }
        this.setState({cursor: node});

        // trigger the file list section
        FileActions.getFiles.source.onNext(node.path);
    },

    render(){
        return (
            <div>
               <Treebeard
                    animations={animations}
                    style={styles}
                    data={this.state.treeData}
                    onToggle={this.onToggle}
                />

            </div>
        );
    }

});

