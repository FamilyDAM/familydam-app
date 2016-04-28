/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */

/** jsx React.DOM */
// Renders the todo list as well as the toggle all button
// Used in TodoApp
var React = require('react');
import {Router, Link} from 'react-router';

//var CreativeCloudEditor = require('./../../components/creativeCloudEditor/CreativeCloudEditor');
var Button = require('react-bootstrap').Button;

var NavigationActions = require('./../../actions/NavigationActions');
var NodeActions = require('./../../actions/NodeActions');


var UserStore = require('./../../stores/UserStore');
var PreferenceStore = require('./../../stores/PreferenceStore');
var ContentStore = require('./../../stores/ContentStore');


module.exports = React.createClass({

    getInitialState: function () {
        return {
            photo: undefined
        }
    },

    componentWillMount: function () {

        // update the breadcrumb
        var _pathData = {
            'label': 'Photo Editor',
            'navigateTo': "photoEdit",
            'params': {id: this.props.location.query.path},
            'level': 1
        };
        NavigationActions.currentPath.onNext(_pathData);


        // load the node from the jcr
        NodeActions.getNode.source.onNext(this.props.location.query.path);


        this.currentNodeSubscription = ContentStore.currentNode.subscribe(function (data_) {
            this.state.photo = data_;

            var imagePath = data_._links.self.href;
            this.state.imageSrc = imagePath;

            if (this.isMounted()) this.forceUpdate();
        }.bind(this));
    },


    componentDidMount: function () {

    },


    componentDidUpdate: function () {

        if (this.state.photo !== undefined)
        {
            var image, container, kit;
            image = new Image();
            image.src = this.state.imageSrc;

            image.onload = function () {
                container = document.querySelector("#imgCanvas");

                this.kit = new ImglyKit({
                    image: image,
                    container: container,
                    assetsUrl: "./assets/js/imglykit/assets",
                    ui: {
                        enabled: true, // UI is disabled per default
                        showExportButton: true,
                        showUndoButton: true,
                        language: PreferenceStore.getSimpleLocale(),
                        quality: 1,
                        export: {
                            renderType: ImglyKit.RenderType.DATAURL,
                            type: ImglyKit.ImageFormat.PNG
                        }
                    }
                });
                this.kit.run();

            }.bind(this);


        }
    },


    componentWillUnmount: function (nextProps) {
        this.state.photo = undefined;

        if (this.currentNodeSubscription !== undefined)
        {
            this.currentNodeSubscription.dispose();
        }
    },


    saveImage: function(event_)
    {
        this.kit.render("data-url", "image/png")
            .then(function (image) {
                alert("todo: save image");
            });
    },


    render: function () {

        return (
            <div>
                <div className="row">
                    <div className="col-sm-10 col-sm-offset-1">

                        <Button ref="saveBtn" id="saveBtn"
                            data-style="expand-left"
                            data-spinner-size={30}
                            data-spinner-color="#000"
                            bsStyle='primary'
                            className="ladda-button pull-right"
                            onClick={this.saveImage}>Save Version</Button>

                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-10 col-sm-offset-1">
                        <div id="imgCanvas" className="container-fluid"
                            style={{width: $(window).width() * .8, height: ($(window).height() - 200) + 'px'}}></div>
                    </div>
                </div>
            </div>
        );
    }

});

