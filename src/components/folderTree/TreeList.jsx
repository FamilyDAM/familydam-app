'use strict';

var React = require('react');

import {Subheader, List, ListItem, IconButton} from 'material-ui';
import FolderIcon from 'material-ui/svg-icons/file/folder';

var FileActions = require('./../../actions/FileActions');
var DirectoryActions = require('./../../actions/DirectoryActions');
var DirectoryStore = require('./../../stores/DirectoryStore');

var LoadingIcon = require('../../components/loadingIcon/LoadingIcon.jsx');


module.exports = React.createClass({

    getDefaultProps: function () {
        return {
            title: "",
            data:[],
            isLoading:true
        }
    },


    /**
    componentWillReceiveProps: function (nextProps_) {
        if (nextProps_.data !== undefined)
        {
            this.props.data = nextProps_.data;
            if( this.isMounted() ) this.forceUpdate();
        }
    },
     **/


    _onSelectHandler: function (path_) {
        if( this.props.onSelect )
        {
            this.props.onSelect(path_);
        }
    },


    getListItem: function (items_) {
        return items_.map((item_)=> {
            return (
                <ListItem key={item_.path}
                          primaryText={item_.name}
                          onTouchTap={()=>{this._onSelectHandler(item_.path)}}
                          nestedItems={this.getListItem(item_.children)}
                          style={{'fontSize':'13px', 'lineHeight':'13px'}}/>
            );
        })

        //leftIcon={<FolderIcon />}
        //leftIcon={<IconButton iconClassName="material-icons" >folder</IconButton>}
    },


    render(){
        return (
            <div style={{'display':'flex', 'flexDirection':'column', 'flexGrow':'1'}}>
                <div style={{'display':'flex', 'flexDirection':'row', 'alignItems':'center'}}>
                    <Subheader style={{'display':'flex', 'alignItems':'flex-start'}}>{this.props.title}</Subheader>
                    {(() => {
                        if( this.props.isLoading )
                        {
                            return(<div style={{'display':'flex', 'alignItems':'flex-end'}}>
                                <LoadingIcon color="#757575" style={{'width':'36px', 'height':'36px'}}/>
                            </div>);
                        }
                    })()}
                </div>
                <List>
                    {this.getListItem(this.props.data)}
                </List>
            </div>
        );
    }

});

