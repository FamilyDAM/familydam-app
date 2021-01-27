import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";
import {Button, Checkbox, Form, Input, message, PageHeader, Space} from "antd";
import Paper from "@material-ui/core/Paper";


const styleSheet = (theme) => ({
    outerContainer: {
        maxWidth: '100%',
        backgroundColor: '#ffffff',
        padding: '16px'
    }
});

//  /* or 'row', 'row dense', 'column dense' */
class UserAccountForm extends Component {

    state = { user: this.props.user };

    handleOnFinish = (form) => {
        let isValid = true;
        if( form.newPassword && form.newPasswordConfirm
            && form.newPassword.length > 0
            && form.newPassword === form.newPasswordConfirm){

            form.password = form.newPassword;
            form.passwordConfirm = form.passwordConfirm;

        }else if( form.newPassword !== form.newPasswordConfirm){
            isValid = false;
            message.warn("Passwords don't match")
        }

        if( isValid && this.props.onSave ){
            this.props.onSave(form);
        }
    }


    deleteConfim = (e)=>{
        alert('TODO: are you sure');
        return false;
    }

    render(){
        const classes = this.props.classes;

        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 12 },
        };

        let title = '';
        if( this.state.user && this.state.user.firstName ){
            title = this.state.user.firstName;
        }
        if( this.state.user && this.state.user.lastName ){
            title += ' ';
            title += this.state.user.lastName;
        }


        return(
            <Paper className={classes.outerContainer}>
                <PageHeader
                    className="site-page-header"
                    title={title} >

                    <Form {...layout}
                          name="user-edit-form"
                          autoComplete="off"
                          initialValues={this.state.user}
                          onFinish={this.handleOnFinish}>


                        <Form.Item name="name" hidden={true}>
                            <Input name="name" />
                        </Form.Item>
                        <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'First Name is required' }]}>
                            <Input name="firstName" autoComplete="off" />
                        </Form.Item>
                        <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'First Name is required' }]}>
                            <Input name="lastName" autoComplete="off"  />
                        </Form.Item>
                        <Form.Item name="isFamilyAdmin" label="Is Parent" valuePropName="checked">
                            <Checkbox name="isFamilyAdmin"
                                      disabled={this.state.user?this.state.user.isSystemAdmin||false:false}
                                      checked={this.state.user?this.state.user.isFamilyAdmin||false:false}>(Parents have full access to all data)</Checkbox>
                        </Form.Item>

                        <fieldset>
                            <legend>Change Password</legend>
                            <Form.Item name="newPassword" label="New Password">
                                <Input.Password name="password" type="password" autoComplete="off" />
                            </Form.Item>
                            <Form.Item name="newPasswordConfirm" label="Confirm New Password">
                                <Input.Password name="passwordConfirm" type="password" autoComplete="off" />
                            </Form.Item>
                        </fieldset>


                        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                            <Space >
                                <Button type="secondary" htmlType="submit" onClick={this.deleteConfim}>
                                    Delete
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                        </Space>
                        </Form.Item>

                    </Form>
                </PageHeader>
            </Paper>
        );
    }
}

export default withStyles(styleSheet)(UserAccountForm);