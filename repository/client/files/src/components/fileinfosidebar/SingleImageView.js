import React, {Component} from 'react';

import { Input, Rate, Select, Tabs } from 'antd';
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

import {withStyles} from "@material-ui/core/styles";
import AppSettings from "../../library/actions/AppSettings";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import moment from "moment";

const styleSheet = (theme) => ({
    gridListRoot: {
        margin: '0px',
        display:'grid',
        gridGap:'8px',
        gridTemplateRows:'175px 25px 50px 25px 50px 25px 25px 3fr',
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
    itemDescription: {
        gridRow: '5',
        gridColumn: '2',
        width: '100%'
    },
    itemInfo: {
        gridRow: '8',
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

        this.handleRatingChange = this.handleRatingChange.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleDescriptionSave = this.handleDescriptionSave.bind(this);
    }

    handleRatingChange(rating){
        this.props.node['rating'] = rating;

        if( this.props.onRatingChange ){
            this.props.onRatingChange(this.props.node);
        }

        this.setState({"rating":rating}); //set value to refresh UI
    }

    //send to parent, with keyword field value
    handleTagChange(tags){
        this.props.node['tags'] = tags;

        if( this.props.onTagChange ){
            this.props.onTagChange(this.props.node);
        }

        this.setState({"tags":tags}); //set value to refresh UI
    }

    //update local prop
    handleDescriptionChange(event){
        this.props.node['description'] = event.currentTarget.value;
        this.setState({"description":event.currentTarget.value}); //set value to refresh UI
    }

    //on focus out, save to server
    handleDescriptionSave(event){
        if( this.props.onDescriptionChange ){
            this.props.onDescriptionChange(this.props.node);
        }
    }



    render(){
        var classes = this.props.classes;

        const tags = [];
        if(this.props.node['tags']){
            this.props.node['tags'].map((tag)=>{
                tags.push(<Option key={tag}>{tag}</Option>);
            });
        }


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
                    <Rate
                        allowHalf
                        onChange={this.handleRatingChange}
                        value={this.props.node['rating']}
                        style={{ float: 'right' }}/>
                </div>



                <div className={classes.itemKeywords}>
                    <Typography variant="h6">Keywords:</Typography>

                    <Select mode="tags" style={{ width: '100%' }} placeholder="Tags Mode" value={this.props.node['tags']} onChange={this.handleTagChange}>
                        {tags}
                    </Select>
                </div>

                <div className={classes.itemDescription}>
                    <Typography variant="h6">Description:</Typography>
                    <TextArea id="description"
                              rows={3}
                              value={this.props.node['description']}
                              onChange={this.handleDescriptionChange}
                              onBlur={this.handleDescriptionSave}></TextArea>
                </div>

                <div className={classes.itemInfo}>

                    <Tabs defaultActiveKey="details" style={{width:'100%'}}>
                        <TabPane tab="Details" key="details">
                            <div>
                                <Table>
                                    <TableBody>
                                        <TableRow style={{padding:'8px'}}>
                                            <TableCell component="th" scope="row" align="right" style={{padding:'8px'}}>Type</TableCell>
                                            <TableCell align="left">{this.props.node['mimeType']}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row" align="right" style={{padding:'8px'}}>Resolution</TableCell>
                                            <TableCell align="left">{this.props.node['width']} x {this.props.node['height']}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row" align="right" style={{padding:'8px'}}>Created</TableCell>
                                            <TableCell align="left">{moment(this.props.node['dateCreated']).format('MMM Do YYYY, h:mm:ss a')}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row" align="right" style={{padding:'8px'}}>Modified</TableCell>
                                            <TableCell align="left">{moment(this.props.node['dateLastModified']).format('MMM Do YYYY, h:mm:ss a')}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <br/>
                                <p>{this.props.node['path']}</p>
                            </div>
                        </TabPane>
                        <TabPane tab="Versions" key="versions">
                            (coming soon)
                        </TabPane>
                        <TabPane tab="Duplicates" key="duplicates">
                            (coming soon)
                        </TabPane>
                    </Tabs>

                </div>


            </div>
        )

    }
}

export default withStyles(styleSheet)(SingleImageView);