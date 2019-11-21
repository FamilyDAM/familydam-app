import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {withStyles} from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import { useAsyncCallback } from 'react-async-hook';

import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from "@material-ui/core/Typography";
import AccountIcon from '@material-ui/icons/SupervisorAccount';
import FolderIcon from '@material-ui/icons/Folder';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const styleSheet = (theme) => ({
    root: {
        height: 'auto',
        maxHeight:'300px',
        flexGrow: 1,
        maxWidth: 400,
        width:'100%'
    },
    stylizedRoot: {
        color: theme.palette.text.secondary,
        '&:focus > $content': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
            color: 'var(--tree-view-color)',
        },
    },
    content: {
        width: 'auto',
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '$expanded > &': {
            fontWeight: theme.typography.fontWeightRegular,
        },
    },
    group: {
        marginLeft: '8px',
        '& $content': {
            paddingLeft: theme.spacing(2),
        },
    },
    expanded: {},
    label: {
        fontWeight: 'inherit',
        color: 'inherit',
    },
    labelRoot: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 0),
    },
    labelIcon: {
        marginRight: theme.spacing(1),
    },
    labelText: {
        fontWeight: 'inherit',
        flexGrow: 1,
    },
});


const LocalTreeItem = function(props_)
{
    const asyncOnClick = useAsyncCallback(props_.onClick);

    return (
        <StyledTreeItem
            onClick={() => asyncOnClick.execute(props_.node)}
            nodeId={props_.node.path} labelText={props_.node.name} labelIcon={props_.level<2?AccountIcon:FolderIcon} classes={props_.classes}>
            {props_.node.children && props_.node.children.map((_node)=>(
                <LocalTreeItem
                    onClick={asyncOnClick.execute}
                    level={props_.level+1} node={_node} classes={props_.classes}/>
            ))}
        </StyledTreeItem>
    );
};


function StyledTreeItem(props) {
    const _classes = props.classes;
    const { labelText, labelIcon: LabelIcon, labelInfo, color, bgColor, ...other } = props;


    return (
        <TreeItem
            label={
                <div className={_classes.labelRoot}>
                    <LabelIcon color="inherit" className={_classes.labelIcon} />
                    <Typography variant="body2" className={_classes.labelText} >
                        {labelText}
                    </Typography>
                    <Typography variant="caption" color="inherit">
                        {labelInfo}
                    </Typography>
                </div>
            }
            style={{
                '--tree-view-color': color,
                '--tree-view-bg-color': bgColor,
            }}
            classes={{
                root: _classes.root,
                content: _classes.content,
                expanded: _classes.expanded,
                group: _classes.group,
                label: _classes.label,
            }}
            {...other}
        />
    );
}

StyledTreeItem.propTypes = {
    bgColor: PropTypes.string,
    color: PropTypes.string,
    labelIcon: PropTypes.elementType.isRequired,
    labelInfo: PropTypes.string,
    labelText: PropTypes.string.isRequired,
};



class FolderTree extends Component{

    constructor(props, context) {
        super(props, context);
        this.state = {};

        //bind methods
        this.handleTreeItemClick = this.handleTreeItemClick.bind(this);
    }

    componentDidMount() {
        this.setState({isMounted: true});
    }

    componentWillUnmount(){
        this.setState({isMounted:false});
    }

    componentWillReceiveProps(newProps){
        this.props = newProps;
    }

    handleTreeItemClick(node_){
        console.log(node_);
        this.props.onTreeClick(node_);
    }

    render() {
        const classes = this.props.classes;

        return(
            <div>
                <TreeView
                    className={classes.root}
                    defaultExpanded={[this.props.root]}
                    defaultCollapseIcon={<ArrowDropDownIcon />}
                    defaultExpandIcon={<ArrowRightIcon />}
                    defaultEndIcon={<div style={{ width: 24 }} />}
                >
                    {this.props.folders.map((_node)=>(
                        <LocalTreeItem
                            onClick={async (event) => {
                                await this.handleTreeItemClick(event);
                            }}
                            level={0} node={_node} classes={classes}/>
                    ))}
                </TreeView>
            </div>
        )
    }
}



FileList.propTypes = {
    photos: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styleSheet)(FolderTree));



/**
 <StyledTreeItem nodeId="0" labelText="Family" labelIcon={AccountIcon} classes={classes}>
 <StyledTreeItem nodeId="1" labelText="Mike" labelIcon={AccountIcon} classes={classes}>
 <StyledTreeItem
 nodeId="5"
 labelText="Files"
 labelIcon={FolderIcon}
 labelInfo="90"
 color="#1a73e8"
 bgColor="#e8f0fe"
 classes={classes}
 >
 <StyledTreeItem
 nodeId="6"
 labelText="Documents"
 labelIcon={FolderIcon}
 labelInfo="90"
 color="#1a73e8"
 bgColor="#e8f0fe"
 classes={classes}
 >
 <StyledTreeItem
 nodeId="6"
 labelText="foo"
 labelIcon={FolderIcon}
 labelInfo="90"
 color="#1a73e8"
 bgColor="#e8f0fe"
 classes={classes}
 />
 </StyledTreeItem>
 <StyledTreeItem
 nodeId="6"
 labelText="Photos"
 labelIcon={FolderIcon}
 labelInfo="90"
 color="#1a73e8"
 bgColor="#e8f0fe"
 classes={classes}
 />
 </StyledTreeItem>
 <StyledTreeItem
 nodeId="7"
 labelText="Social"
 labelIcon={FolderIcon}
 labelInfo="2,294"
 color="#e3742f"
 bgColor="#fcefe3"
 classes={classes}
 />
 <StyledTreeItem
 nodeId="7"
 labelText="Email"
 labelIcon={FolderIcon}
 labelInfo="2,294"
 color="#e3742f"
 bgColor="#fcefe3"
 classes={classes}
 />
 </StyledTreeItem>
 <StyledTreeItem nodeId="2" labelText="Angela" labelIcon={AccountIcon} classes={classes} />
 <StyledTreeItem nodeId="3" labelText="Kayden" labelIcon={AccountIcon} classes={classes} />
 <StyledTreeItem nodeId="4" labelText="Hailey" labelIcon={AccountIcon} classes={classes} />
 </StyledTreeItem>
 **/