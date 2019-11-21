/*
 * Copyright (c) 2015  Mike Nimer & 11:58 Labs
 */
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {injectIntl} from 'react-intl';
import {withStyles} from "@material-ui/core/styles";

import CircularProgress from '@material-ui/core/CircularProgress';
//import Typography from 'material-ui/Typography';

import AppActions from "../../library/actions/AppActions";
import AppShell from '../../library/appShell/AppShell';
//import AppActions from '../../library/actions/AppActions';
import PhotoActions from "../../actions/PhotoActions";
import PhotoGroup from "../../components/PhotoGroup/PhotoGroup";
import FolderTree from "../../components/FolderTree/FolderTree";
import Breadcrumb from "../../library/breadcrumb/Breadcrumb";

import Toolbar from "@material-ui/core/Toolbar";
import FolderIcon from '@material-ui/icons/Folder';
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Typography from "@material-ui/core/Typography";


const styleSheet = (theme) => ({
    progress: {
        margin: `0 ${theme.spacing.unit * 2}px`,
        width: '100px',
        height: '100px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    photoGrid: {
        display: 'grid',
        gridTemplateColumns: 'minmax(200px, 1fr) 4fr',
        gridTemplateRows: 'auto'
    },
    photoSideBar: {
        backgroundColor: '#ffffff',
        gridColumn: '1/2',
        gridRows: '1/2',
        borderLeft: '1px solid #CCCCCC',
        margin:'16px'
    },
    photoGroups: {
        gridColumn: '2/3',
        gridRows: '1/2'
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },

});


class HomePage extends Component {

    constructor(props, context) {
        super(props);

        this.state = {
            isMounted:true,
            isLoading:true,
            root:"/content/files",
            path:"/content/files",
            photos:[],
            folders:[],
            selectedImages:[]
        };

        this.handleTreeClick = this.handleTreeClick.bind(this);
        this.handleSelectedImages = this.handleSelectedImages.bind(this);
    }

    componentWillMount(){
        this.setState({'isLoading':true, "isMounted":true});


        PhotoActions.listFolders.sink.subscribe( results => {
            this.setState({"folders":results});
        });

        PhotoActions.listPhotos.sink.subscribe( results => {

            let groups = {};
            let photoList = this.state.photos.concat(results);
            for (const node of photoList) {  //todo, append to this.state.photos
                if( node['dam:date.created'] ) {
                    try {
                        var groupDate = node['dam:date.created'];
                        groupDate = new Date(Date.parse(groupDate));
                        groupDate = (groupDate.getYear()+1900) + "-" + groupDate.getMonth() + "-" + groupDate.getDate();
                        if (!groups[groupDate]) {
                            var group = {};
                            group.label = groupDate;
                            group.children = [];
                            groups[groupDate] = group;
                        }

                        groups[groupDate].children.push(node);
                    }catch(err){
                        //skip image
                    }
                }
            }

            let photos = [];
            for (const group in groups){
                photos.push(groups[group]);
            }
            photos.sort((a, b) => a.label - b.label);


            //
            this.setState({'isLoading':false, 'photos': photos} );
        });

        //PhotoActions.listPhotos.source.next({path:this.state.path});
        PhotoActions.listFolders.source.next({path:this.state.root});
        this.validatePath();
    }


    componentWillUnmount() {
        this.setState({"isMounted":false});
    }

    componentWillReceiveProps(newProps){
        this.props = newProps;
        this.validatePath();

    }

    validatePath() {
        let _path = this.state.path;
        if( this.props.location.pathname && this.props.location.pathname.startsWith(this.state.root) ){
            _path = this.props.location.pathname;
        }

        this.setState({"path": _path});
        PhotoActions.listPhotos.source.next({path:_path});
    }


    handleTreeClick(node_){
        this.setState({"path": node_.path});
        //PhotoActions.listPhotos.source.next({path:node_.path});
        AppActions.navigateTo.next(node_.path)
    }

    handleSelectedImages(image_){
        if( image_.isSelected ){
            var images = this.state.selectedImages;
            images.push(image_);
            this.setState({"selectedImage": images});
        } else {
            var images = [];
            for (const img of this.state.selectedImages) {
                if( img !== image_ ){
                    images.push(img);
                }
            }
            this.setState({"selectedImages": images});
        }

    }


    render() {
        var classes = this.props.classes;

        if( this.state.isLoading ){
            return (
                <AppShell user={this.props.user||{}} open={false}>
                    <CircularProgress className={classes.progress} size={50} />
                </AppShell>
            );
        }else {
            return (
                <AppShell user={this.props.user||{}} open={false}>
                    <AppBar color="default" position="static" elevation={0}
                            className={classes.fileGridAppBar}
                            style={{'colorDefault':'#eeeeee'}}>

                        <Toolbar className={classes.toolbarContainer}>
                            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                                <FolderIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                <Breadcrumb root={this.state.root} path={this.state.path}/>
                            </Typography>
                            <Button color="inherit">Download</Button>
                        </Toolbar>
                    </AppBar>



                    <div className={classes.photoGrid}>
                        <div className={classes.photoSideBar}>
                            <FolderTree
                                root={this.state.root}
                                folders={this.state.folders}
                                onTreeClick={async (node_) => {
                                    await this.handleTreeClick(node_);
                                }}/>
                        </div>
                        <div className={classes.photoGroups}>
                        {this.state.photos.map( (p)=>{
                            return (
                                <PhotoGroup
                                    onImageSelect={this.handleSelectedImages}
                                    key={p.value} photos={p}></PhotoGroup>
                            )
                        })}
                        </div>
                    </div>
                </AppShell>
            );
        }
    }
}


export default injectIntl(withRouter(withStyles(styleSheet)(HomePage)));