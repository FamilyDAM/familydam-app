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

//InfiniteScroll = require('react-infinite-scroll')(React);
var InfiniteScrollMixin = require('react-infinite-scroll-mixin');

var FolderTree = require('../../components/folderTree/FolderTree');
var PhotoThumbnail = require('./PhotoThumbnail');

var SearchServices = require('./../../services/SearchServices');


var PhotosView = React.createClass({

    mixins:[InfiniteScrollMixin],

    getInitialState: function(){
        return {
            files: [],
            shiftKeyPressed:false,
            controlKeyPressed:false,
            selectedItems:[]
        }
    },


    /**
     * Load the images in the root folder
     */
    componentWillMount:function(){
        //this.loadData("/~/", 10, 0);
    },


    loadData:function(folder_, limit_, offset_){
        //todo: make path dynamic
        var _this = this;
        SearchServices.searchImages("/~/").subscribe(function(results){
            _this.setState({'files': results});
        });
    },



    /**
     * Call the server a load the next pagable batch
     * @param page
     */
    fetchNextPage: function(page)
    {
        console.log( "page=" +page );
        //this.loadData("/~/photos", 10, 1);

        this.forceUpdate();
    },


    /**
     * Manage the single & multiple (with control or shift key) logic
     * @param event
     * @param object
     */
    handleThumbnailEvents: function(event, object)
    {
        //console.dir(event);
        if( !this.state.controlKeyPressed && !this.state.shiftKeyPressed )
        {
            for (var i = 0; i < this.state.files.length; i++)
            {
                var _file = this.state.files[i];
                if( _file == object ){
                    _file.active = !object.active;
                }else{
                    _file.active = false;
                }
            }
        }
        else if( this.state.controlKeyPressed )
        {
            var _fileIndx = this.state.files.indexOf(object);
            if( _fileIndx > -1 )
            {
                var _file = this.state.files[_fileIndx];
                _file.active = !object.active;
            }
        }
        else if( this.state.shiftKeyPressed )
        {
            var _fileIndx = this.state.files.indexOf(object);
            var _inSelection = false;

            // handle the condition where the previously selected item is before the new one.
            for (var i = 0; i <= _fileIndx; i++)
            {
                // find the first item with active flipped
                var _file = this.state.files[i];
                if( _file.active ){
                    _inSelection = true;
                }

                if( _inSelection )
                {
                    _file.active = true;
                }
            }

            // we didn't find a previously selected item before the new one. Let's find the last one after then and select
            // everything inbetween
            if( !_inSelection )
            {
                var _lastSelectedIndex = _fileIndx;
                for (var i = _fileIndx; i < this.state.files.length; i++)
                {
                    if( this.state.files[i].active )
                    {
                        _lastSelectedIndex = i;
                    }
                }

                for (var i = _fileIndx; i <= _lastSelectedIndex; i++){
                    this.state.files[i].active = true;
                }
            }
        }


        var _selectedItems = [];
        for (var j = 0; j < this.state.files.length; j++)
        {
            var _file = this.state.files[j];
            if( _file.active ){
                _selectedItems.push(_file);
            }
        }
        this.setState({'selectedItems':_selectedItems});


        this.forceUpdate();
    },

    handleKeyDown: function(event)
    {
        console.log("key down:" +event.keyCode +":" +event.key);
        if( event.keyCode == 16 ){
            // shift key pressed
            this.state.shiftKeyPressed = true;
        }if( event.keyCode == 17 || event.keyCode == 91 ){
            //control or command key pressed
            this.state.controlKeyPressed = true;
        }
    },

    handleKeyUp: function(event)
    {
        console.log("key up:" +event.key);
        if( event.keyCode == 16 ){
            // shift key pressed
            this.state.shiftKeyPressed = false;
        }if( event.keyCode == 17 || event.keyCode == 91 ){
            //control or command key pressed
            this.state.controlKeyPressed = false;
        }
    },



    render: function() {

        var _this = this;
        _this.hasMore = true;

        var photos = this.state.files.map( function(_image){
            return <PhotoThumbnail photo={_image} active={_image.active} thumbnailEventHandler={_this.handleThumbnailEvents}/>
        });

        _this.tableClass = "col-sm-10 col-md-10";
        _this.asideClass = " col-md-3";
        if( this.state.selectedItems.length == 1)
        {
            _this.tableClass = "col-sm-10 col-md-7";
            _this.asideClass = "col-md-3";
        };


        return (
            <div className="photosView container-fluid"
                onKeyDown={_this.handleKeyDown} onKeyUp={_this.handleKeyUp}>
                <aside className="col-sm-2" >
                    <FolderTree/>
                </aside>

                <section className={_this.tableClass} style={{'borderLeft':'1px solid #eee'}}>
                    <div className="container-fluid">
                        <div className="">
                            Selected: {this.state.selectedItems.length} / {this.state.files.length}
                        </div>
                        <div className="">
                            {photos}
                        </div>
                    </div>
                </section>


                <aside className={_this.asideClass}>
                    [previewWidget]
                </aside>
            </div>

        );
    }

});

module.exports = PhotosView;
