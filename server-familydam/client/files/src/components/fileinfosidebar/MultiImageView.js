import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {withStyles} from "@material-ui/core/styles";

import AppSettings from "../../library/actions/AppSettings";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Rating from "@material-ui/lab/Rating";
import {TagPicker} from "rsuite";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import moment from "moment";

const styleSheet = (theme) => ({
    gridListRoot: {
        margin: '24px',
        display:'grid',
        gridGap:'8px',
        gridTemplateRows:'175px 25px 50px 3fr',
        gridTemplateColumns:'16px auto 16px',
        background: theme.palette.background.paper,
        justifyContent: 'center'
    },
    itemPreview: {
        gridRow: '1',
        gridColumn: '2',
        justifyContent: 'center'
    }
});

class MultiImageView extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render(){
        var classes = this.props.classes;

        return (
            <div className={classes.gridListRoot}>

                <div className={classes.itemPreview} >

                    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', overflow: 'hidden'}}>
                        <GridList cellHeight={160} style={{width: '100%', height: '100%'}} cols={3}>
                            {this.props.nodes.map(file => (
                                <GridListTile key={file['path']} cols={file.cols || 1}>
                                    <img src={AppSettings.baseHost.getValue() + file['path']}
                                         alt={file['jcr:path']}
                                         style={{height: '100%', maxWidth: '100%', alignSelf: 'center'}}/>
                                </GridListTile>
                            ))}
                        </GridList>
                    </div>

                </div>

            </div>
        )

    }
}

export default withStyles(styleSheet)(MultiImageView);