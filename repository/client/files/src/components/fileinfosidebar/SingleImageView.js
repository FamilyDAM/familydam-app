import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";

import AppSettings from "../../library/actions/AppSettings";
import Rating from "@material-ui/lab/Rating";
import {TagPicker} from "rsuite";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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
    },
    itemRating: {
        gridRow: '2',
        gridColumn: '2'
    },
    itemKeywords: {
        gridRow: '3/5',
        gridColumn: '2'
    },
    itemInfo: {
        gridRow: '5',
        gridColumn: '2'
    },
});


class SingleImageView extends Component {


    constructor(props, context) {
        super(props, context);
        this.state = {
            keyword: "",
            tabIndex: this.props.tabIndex?this.props.tabIndex:0
        };

        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleAddKeywordChange = this.handleAddKeywordChange.bind(this);
        this.handleAddKeywordClick = this.handleAddKeywordClick.bind(this);
        this.handleKeywordDelete = this.handleKeywordDelete.bind(this);
    }

    handleAddKeywordChange(e){
        this.setState({'keyword': e.target.value});
    }

    //send to parent, with keyword field value
    handleAddKeywordClick(event, newValue){
        //resend complete list
        var tags = this.props.node['dam:tags'];

        var words = this.state.keyword.split(",");
        for (const word of words) {
            tags.push(word);
        }

        this.props.handleTagChange(tags);
        //reset
        this.setState({'keyword':''});
    }

    //send list with single keyword deleted
    handleKeywordDelete(tag){
        //resend complete list
        var tagList = [];
        var tags = this.props.node['dam:tags'];
        for( var i=0; i < tags.length; i++){
            if( tags[i] !== tag){
                tagList.push(tags[i]);
            }
        }
        this.props.handleTagChange(tagList);

        //reset local obj
        this.props.node['dam:tags'] = tagList;
    }

    handleTabChange(event, newValue){
        this.setState({'tabIndex':newValue});
    }



    render(){
        var classes = this.props.classes;

        return (
            <div className={classes.gridListRoot}>

                <div className={classes.itemPreview} >

                    <div style={{height: '100%', maxWidth: '100%', textAlign: 'center'}}>
                        <img src={AppSettings.baseHost.getValue() + (this.props.node['path'])}
                             alt={this.props.node['path']}
                             style={{maxHeight: '100%', maxWidth: '100%', alignSelf: 'center'}}/>
                    </div>

                </div>


                <div className={classes.itemRating}>
                    <Rating
                        name="img-ratings"
                        value={this.props.node['dam:rating']}
                        onChange={this.props.handleRatingChange}
                        style={{ float: 'right' }}
                    />
                </div>



                <div className={classes.itemKeywords}>
                    <Typography variant="h6">Keywords:</Typography>

                    <div>
                    { this.props.node['dam:tags'] && this.props.node['dam:tags'].map((tag)=>{
                        return (
                            <Chip size="small" label={tag} onDelete={()=>this.handleKeywordDelete(tag)} />
                        )
                    })}
                    </div>

                    <div>
                         <TextField
                            id="addKeyword"
                            ref="addKeywordField"
                            label="Add Keyword"
                            margin="normal"
                            value={this.state.keyword}
                            style={{'width':'75%'}}
                            onChange={this.handleAddKeywordChange}
                        />
                        <Button
                            color="primary"
                            style={{'verticalAlign':'bottom'}}
                            disabled={this.state.keyword.length==0}
                            onClick={this.handleAddKeywordClick}>Add</Button>
                    </div>
                </div>

                <div className={classes.itemInfo}>
                    <hr style={{'width':'100%'}}/>
                    <Tabs value="Details" indicatorColor="primary" textColor="primary" variant="fullWidth" onChange={this.props.handleTabChange}>
                        <Tab label="Details" />
                        <Tab label="Versions" />
                    </Tabs>

                    {this.state.tabIndex === 0 &&
                        <div>
                            <Table>
                                <TableBody>
                                    <TableRow style={{padding:'8px'}}>
                                        <TableCell component="th" scope="row" align="right" style={{padding:'8px'}}>Type</TableCell>
                                        <TableCell align="left">{this.props.node['jcr:content']['jcr:mimeType']}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" align="right" style={{padding:'8px'}}>Resolution</TableCell>
                                        <TableCell align="left">{this.props.node['width']} x {this.props.node['height']}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" align="right" style={{padding:'8px'}}>Created</TableCell>
                                        <TableCell align="left">{moment(this.props.node['dam:date.created']).format('MMM Do YYYY, h:mm:ss a')}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" align="right" style={{padding:'8px'}}>Modified</TableCell>
                                        <TableCell align="left">{moment(this.props.node['jcr:lastModified']).format('MMM Do YYYY, h:mm:ss a')}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    }
                    {this.state.tabIndex === 1 && <div>Versions Panel</div>}
                </div>


            </div>
        )

    }
}

export default withStyles(styleSheet)(SingleImageView);