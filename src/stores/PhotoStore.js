/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
'use strict';
var Rx = require('rx');
var ImageActions = require('./../actions/ImageActions');

module.exports = {

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

            ImageActions.search.source.onNext(val);

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
    }

};


