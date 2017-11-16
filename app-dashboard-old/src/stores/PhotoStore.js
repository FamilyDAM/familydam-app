/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
'use strict';
var Rx = require('rx');
var ImageActions = require('./../actions/ImageActions');

module.exports = {

    search: new Rx.BehaviorSubject([]),
    //filter props
    tags: new Rx.BehaviorSubject([]),
    people: new Rx.BehaviorSubject([]),
    dateTree: new Rx.BehaviorSubject({}),
    filters: new Rx.BehaviorSubject({
            tags:[],
            people:[],
            date:[],
            paths:[],
            order:{
                field:'datecreated',
                direction:'asc'
            }
        }),

    subscribe: function(){
        //console.log("{PhotoStore} init()");

        ImageActions.addFilter.subscribe(function(data){

            if( data.type === "undefined"){ return; }

            var _filters = this.filters.value;

            if( data.type === "group" ){
                _filters.group = data.name;
            }
            else if( data.type === "path" ){

                var paths = [];
                for (var l = 0; l < _filters.paths.length; l++)
                {
                    var _p = _filters.paths[l];
                    if( !data.name.startsWith(_p.name) )
                    {
                        paths.push(_p);
                    }
                }
                paths.push(data);
                _filters.paths = paths;

            }
            else if( data.type === "date" ){

                var dates = [];
                for (var i = 0; i < _filters.date.length; i++)
                {
                    var _d = _filters.date[i];
                    if( !data.name.startsWith(_d.name) )
                    {
                        dates.push(_d);
                    }
                }
                dates.push(data);
                _filters.date = dates;

            }
            else if( data.type === "people" )
            {
                _filters.people.push(data);
            }
            else if( data.type === "tag" )
            {
                _filters.tags.push(data);
            }

            this.filters.onNext(_filters);
            ImageActions.search.source.onNext({"filters":_filters, "offset":0});

        }.bind(this));




        ImageActions.removeFilter.subscribe(function(data){
            var _filters = this.filters.value;

            var _type = data.type;
            var _name = data;

            //if( data.indexOf(":") > -1){
                //_type = data.substr(0, data.indexOf(":"));
                //_name = data.substr(data.indexOf(":")+1);
            //}


            if( _type === "path" ){

                _name = data.name;
                var _pathList = [];
                for (var L = 0; L < _filters.paths.length; L++) {
                    var _path = _filters.paths[L];
                    if( _path.name !== _name) {
                        _pathList.push(_path);
                    }
                }
                _filters.paths = _pathList;

            }
            else if( _type === "date" ){

                _name = data.name;
                var _dateList = [];
                for (var k = 0; k < _filters.date.length; k++) {
                    var _date = _filters.date[k];
                    if( _date.name !== _name) {
                        _dateList.push(_date);
                    }
                }
                _filters.date = _dateList;

            }
            else if( _type === "people" )
            {
                _name = data.name;
                var _peopleList = [];
                for (var j = 0; j < _filters.people.length; j++) {
                    var _people = _filters.people[j];
                    if( _people.name !== _name) {
                        _peopleList.push(_people);
                    }
                }
                _filters.people = _peopleList;

            }
            else if( _type === "tag" )
            {
                _name = data.name;
                var _tags = [];
                for (var i = 0; i < _filters.tags.length; i++) {
                    var _tag = _filters.tags[i];
                    if( _tag.name !== _name) {
                        _tags.push(_tag);
                    }
                }
                _filters.tags = _tags;

            }

            ImageActions.search.source.onNext({"filters":_filters, "offset":0});
        }.bind(this));




        ImageActions.tagsList.sink.subscribe(function(data){
            this.tags.onNext(data);
        }.bind(this));




        ImageActions.peopleList.sink.subscribe(function(data){
            this.people.onNext(data);
        }.bind(this));



        ImageActions.dateTree.sink.subscribe(function(data){
            this.dateTree.onNext(data);
        }.bind(this));


        ImageActions.search.sink.onNext(function(data_){
            this.search.onNext(data_);
        });
    }

};


