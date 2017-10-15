import React, {Component} from 'react';
import {withStyles} from 'material-ui/styles';

import StorageForm from '../components/storageForm/StorageForm';



const styleSheet = (theme) => ({});

class StorageLocationPage extends Component {
    constructor(props, context) {
        super(props, context);


        this.state = {
            "context": context,
            "isMounted": true,
            "storagePath": this.props.storagePath
        };

        this.handleLocationChange = this.handleLocationChange.bind(this);
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

    handleLocationChange(path_){
        //call back to electron
        //this.setState({storagePath:path_});

        if( this.props.onLocationChange ){
            this.props.onLocationChange(path_);
        }
    }


    render() {
        //const classes = this.props.classes;

        return (
            <StorageForm
                onLocationChange={this.handleLocationChange}/>
        );

    }

}

export default withStyles(styleSheet)(StorageLocationPage);