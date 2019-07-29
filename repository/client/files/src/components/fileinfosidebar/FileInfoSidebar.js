import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {withStyles} from "@material-ui/core/styles";
import PropTypes from 'prop-types';

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';


import FileListTableToolbar from '../filelist/FileListTableToolbar';

import FileActions from '../../actions/FileActions';
import AppSettings from '../../library/actions/AppSettings';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const styleSheet = (theme) => ({

    gridListRoot: {
        margin: '24px',
        display:'grid',
        gridTemplateRows:'175px 25px 50px 3fr',
        gridTemplateColumns:'16px auto 16px',
        background: theme.palette.background.paper,
        justifyContent: 'center'
},
    itemPreview: {
        gridRow: '1',
        gridColumn: '2',
        justifyContent: 'center'
    },
    itemRating: {
        gridRow: '2',
        gridColumn: '2'
    },
    itemKeywords: {
        gridRow: '3',
        gridColumn: '2'
    },
    itemInfo: {
        gridRow: '4',
        gridColumn: '2'
    },
    gridSingleItemInfo: {

    },
    title: {
        color: theme.palette.primary[200],
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },

});

class FileInfoSidebar extends Component {


    constructor(props, context) {
        super(props);

        this.state = {
            fileNodes: [],
            isMounted: true,
            tabIndex: 0
        };
    }

    componentWillMount() {
        this.setState({isMounted: true});
        this.handleTabChange = this.handleTabChange.bind(this);

        if( this.props.fileNodes ){  //used by Storyboard
            this.setState({"fileNodes": this.props.fileNodes});
        }else {
            FileActions.getFileData.sink.takeWhile(() => this.state.isMounted).subscribe((files) => {
                console.log(JSON.stringify(files));
                this.setState({"fileNodes": files});
            });

            FileActions.getFileData.source.next(this.props.files);
        }
    }

    componentWillUnmount() {
        this.setState({isMounted: false});
    }

    componentWillReceiveProps(newProps) {
        this.props = newProps;

        FileActions.getFileData.source.next(this.props.files);
    }

    handleTabChange(event, newValue){
        this.setState({'tabIndex':newValue});
    }

    render() {
        var classes = this.props.classes;

        return (
            <Paper style={this.props.style}>
                <FileListTableToolbar
                    files={this.props.files}/>

                {(this.props.files.length===1) &&
                    <SingleImageView
                        handleTabChange={this.handleTabChange}
                        tabIndex={this.state.tabIndex}
                        fileNodes={this.state.fileNodes}
                        classes={classes}/>
                }

            </Paper>
        )
    }
}



const SingleImageView = (props, context) => (

        <div className={props.classes.gridListRoot}>

            <div className={props.classes.itemPreview} >
                {props.fileNodes.length === 1 &&
                    <div style={{height: '100%', maxWidth: '100%', textAlign: 'center', margin:'8px'}}>
                        {props.fileNodes.map(file => (
                            <img src={AppSettings.baseHost.getValue() + (file['path'])}
                                 alt={file['path']}
                                 style={{maxHeight: '100%', maxWidth: '100%', alignSelf: 'center'}}/>

                        ))}
                    </div>
                }

                {props.fileNodes.length > 1 &&
                    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', overflow: 'hidden'}}>
                        <GridList cellHeight={160} style={{width: '100%', height: '100%'}} cols={3}>
                            {props.fileNodes.map(file => (
                                <GridListTile key={file['path']} cols={file.cols || 1}>
                                    <img src={AppSettings.baseHost.getValue() + file['path']}
                                         alt={file['jcr:path']}
                                         style={{height: '100%', maxWidth: '100%', alignSelf: 'center'}}/>
                                </GridListTile>
                            ))}
                        </GridList>
                    </div>
                }
            </div>

            {props.fileNodes.length === 1 &&
                <div className={props.classes.itemRating}>
                    <Typography>TODO: ADD RATING</Typography>
                </div>
            }


            {props.fileNodes.length === 1 &&
                <div className={props.classes.itemKeywords}>
                    <Typography>TODO: ADD Keywords</Typography>
                </div>
            }

            {props.fileNodes.length === 1 &&
                <div className={props.classes.itemInfo}>
                    <Tabs value="Details" indicatorColor="primary" textColor="primary" variant="fullWidth" onChange={props.handleTabChange}>
                        <Tab label="Details" />
                        <Tab label="Versions" disabled />
                    </Tabs>

                    {props.tabIndex === 0 &&
                    <div>
                        <Table>
                            <TableBody>
                                <TableRow style={{padding:'8px'}}>
                                    <TableCell component="th" scope="row" align="right" style={{padding:'8px'}}>Type</TableCell>
                                    <TableCell align="left">{props.fileNodes[0]['jcr:content']['jcr:mimeType']}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row" align="right" style={{padding:'8px'}}>Resolution</TableCell>
                                    <TableCell align="left">{props.fileNodes[0]['width']} x {props.fileNodes[0]['height']}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row" align="right" style={{padding:'8px'}}>Created</TableCell>
                                    <TableCell align="left">{props.fileNodes[0]['dam:datecreated']}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row" align="right" style={{padding:'8px'}}>Modified</TableCell>
                                    <TableCell align="left">{props.fileNodes[0]['jcr:lastModified']}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    }
                    {props.tabIndex === 1 && <div>Versions Panel</div>}
                </div>
            }

        </div>

);



FileList.propTypes = {
    files: PropTypes.array.isRequired,
};

export default withRouter(withStyles(styleSheet)(FileInfoSidebar));