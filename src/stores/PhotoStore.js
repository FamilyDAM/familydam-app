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
            date:{},
            order:{
                field:'datecreated',
                direction:'asc'
            }
        }),

    subscribe: function(){
        console.log("{PhotoStore} init()");

        ImageActions.addFilter.subscribe(function(data){
            var val = this.filters.value;

            if( data.type === "date" ){
                val.date = data;
            }else if( data.type === "people" ){
                val.people.push(data);
            }else if( data.type === "tag" ){
                val.tags.push(data);
            }

            this.filters.onNext(val);
            ImageActions.search.source.onNext(val);

        }.bind(this));




        ImageActions.removeFilter.subscribe(function(data){
            var _filters = this.filters.value;

            var _type = "tag";
            var _name = data;
            if( data.indexOf(":") > -1)
            {
                _type = data.split(":")[0];
                _name = data.split(":")[1];
            }

            if( _type === "people" ){

                var _peopleList = [];
                for (var j = 0; j < _filters.people.length; j++) {
                    var _people = _filters.people[j];
                    if( _people.name !== _name) {
                        _peopleList.push(_people);
                    }
                }
                _filters.people = _peopleList;

            } else if( _type === "tag" ){

                var _tags = [];
                for (var i = 0; i < _filters.tags.length; i++) {
                    var _tag = _filters.tags[i];
                    if( _tag.name !== _name) {
                        _tags.push(_tag);
                    }
                }
                _filters.tags = _tags;

            }

            ImageActions.search.source.onNext(_filters);
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


