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

var decorators = {
    Loading: function(props) {
        return (
            <div style={props.style}>
                loading 1234...
            </div>
        );
    },
    Toggle: function(props) {
        return (
            <div style={props.style}>
                <svg height={props.height} width={props.width}>
                    <polygon
                        points={props.points}
                        style={props.style.arrow}
                    />
                </svg>
            </div>
        );
    },
    Header: function(props) {
        return (
            <div style={props.style}>
                {props.name}
            </div>
        );
    },
    Container: function(props) {
        return (
            <div onClick={props.onClick}>
                // Hide Toggle When Terminal Here
                <props.decorators.Toggle/>
                <props.decorators.Header/>
            </div>
        );
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
            arrow:{
                fill: '#333333',
                'strokeWidth':'0'
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
            addNodeRefs: [],
            treeData: [],
            selectedPath: "/content/dam-files"
        }
    },


    componentWillMount: function () {
        // trigger a directory reload
        if( this.props.baseDir !== undefined )
        {
            this.loadDirectoryTree();
        }


        if( this.props.data !== undefined ){
            this.state.treeData = this.props.data;
        }
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


    componentWillReceiveProps: function(nextProps_){
        if( nextProps_.data !== undefined ){
            this.state.treeData = nextProps_.data;
        }
    },


    loadDirectoryTree: function(){
        DirectoryActions.getDirectories.source.onNext(this.props.baseDir);

        var getFilesSubscription = FileActions.getFiles.source.subscribe(function (path_) {
            this.state.selectedPath = path_;
        }.bind(this));

        // listen for trigger to reload for files in directory
        this.refreshDirectoriesSubscription = DirectoryActions.refreshDirectories.subscribe(function (data_) {
            DirectoryActions.getDirectories.source.onNext(undefined);
            DirectoryActions.getDirectories.source.onNext(this.props.baseDir);
        }.bind(this));

        //Listen for directory changes
        this.directoriesSubscription = DirectoryStore.directories.subscribe(function (data_) {

            var isChild = false;
            for (var i = 0; i < this.state.addNodeRefs.length; i++)
            {
                var obj = this.state.addNodeRefs[i];

                for (var j = 0; j < data_.length; j++)
                {
                    var dataObj = data_[j];
                    if (obj.path == dataObj.parent)
                    {
                        isChild = true;
                        obj.children.push(dataObj);

                        this.state.addNodeRefs.push(dataObj);

                    }
                }
            }

            if (!isChild && data_.length > 0)
            {
                this.state.treeData = data_;
                for (var i = 0; i < data_.length; i++)
                {
                    this.state.addNodeRefs.push(data_[i]);
                }
            }
            if (this.isMounted()) this.forceUpdate();
        }.bind(this));
    },


    onToggle: function (node, toggled) {

        if( node.loading !== undefined && node.loading )
        {
            node.active = true;
            node.toggled = toggled;
            node.loading = false;
            // load child directories
            if( this.props.baseDir !== undefined )
            {
                DirectoryActions.getDirectories.source.onNext(node.path);
            }
        }else{

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
        }

        // trigger the file list section
        if( this.props.onSelect !== undefined )
        {
            this.props.onSelect(node);
        }

    },

    render(){

        if( this.state.cursor !== undefined && this.state.cursor.children !== undefined && !(this.state.cursor.children instanceof Array) ){
            var children = [];
            for(var key in this.state.cursor.children )
            {
                children.push(this.state.cursor.children[key]);
            }
            this.state.cursor.children = children;
        }


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

