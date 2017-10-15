import React, {Component} from 'react';
import {FormattedMessage} from 'react-intl'; //, FormattedPlural, FormattedDate

import {withStyles} from 'material-ui/styles';
import Button from 'material-ui/Button';


const styleSheet = (theme) => ({
    intro:{
        padding: '8px'
    },
    formFields:{
        padding: '8px'
    },
    note:{
        padding: '8px'
    }

});

class StorageForm extends Component {
    constructor(props, context) {
        super(props, context);


        this.state = {
            "context": context,
            "isMounted": true,
            "storagePath": this.props.storagePath
        };

        this.handleBrowseBtnClick = this.handleBrowseBtnClick.bind(this);
        this.handleEditFolderPath = this.handleEditFolderPath.bind(this);
        this.handleFolderChange = this.handleFolderChange.bind(this);
    }


    componentWillMount(){
        this.setState({"isMounted":true});

        /**
         UserActions.getUser.sink.takeWhile(() => this.state.isMounted).subscribe((user_)=>{
            // redirect to dashboard
            if( user_ ) {
                this.setState({"isAuthenticated":true, "user": user_});
            }
        });
         **/
    }


    componentWillUnmount(){
        this.setState({"isMounted":false});
    }

    componentDidMount(){
        this.setState({"isMounted":false});
        this.refs.folderInputField.setAttribute("directory", "directory");
        this.refs.folderInputField.setAttribute("webkitdirectory", "webkitdirectory");
    }


    handleBrowseBtnClick(event){
        //debugger;
        this.refs.folderInputField.click();
    }

    handleEditFolderPath(event){
        //call back to electron
        //debugger;
        var _path = event.target.value;
        this.setState({storagePath:_path});

        if( this.props.onLocationChange){
            this.props.onLocationChange(_path);
        }
    }

    handleFolderChange(event){
        //debugger;
        var _files = event.currentTarget.files;
        var _path = _files[0].path?_files[0].path:"/";
        this.setState({storagePath:_path});

        if( this.props.onLocationChange ){
            this.props.onLocationChange(_path);
        }
    }


    render() {
        const classes = this.props.classes;

        return (
            <div>
                <div className={classes.intro}>
                    <FormattedMessage
                        id="storage.intro"
                        defaultMessage="Before we can start the application we need to know the location of a folder on your largest Hard Drive, USB Drive, or Mapped Network Drive. This is were we will store all of the files, thumbnails, renditions, metadata, and other data."
                    />
                </div>
                <div className={classes.formFields}>
                    <label><strong><FormattedMessage
                        id="storage.location"
                        defaultMessage="Storage Location"
                        description='Location of internal repository'
                    />:</strong></label><br/>
                    <input type="text"
                           value={this.state.storagePath}
                           onChange={this.handleEditFolderPath}
                           style={{'width': '250px'}}/>
                    <Button className="btn btn-default" onClick={this.handleBrowseBtnClick}>
                        <FormattedMessage
                            id="browse"
                            defaultMessage="browse"
                        />
                    </Button>
                    <input type="file"
                           ref="folderInputField"
                           style={{'display': 'none'}}
                           onChange={this.handleFolderChange}/>

                </div>
                <div className={classes.note}>
                    <strong><FormattedMessage
                        id="note"
                        defaultMessage="Note"
                    />: </strong>
                    <FormattedMessage
                        id="storage.intro1b"
                        defaultMessage="Everything is stored in this folder, so you can make complete backups of the FamilyD.A.M. data by backing up this folder. Or if you need to move everything to a new folder/drive, you can do this by moving this folder and everything in it."
                    />
                </div>
            </div>
        );

    }

}

export default withStyles(styleSheet)(StorageForm);