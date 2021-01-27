import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";

import { message, Checkbox, Form, Input, Button, PageHeader, Switch, Typography } from 'antd';
const { Text } = Typography;

import Paper from "@material-ui/core/Paper";


const styleSheet = (theme) => ({
    outerContainer: {
        maxWidth: '100%',
        backgroundColor: '#ffffff',
        padding: '16px'
    },

});

//  /* or 'row', 'row dense', 'column dense' */
class NewUserForm extends Component {

    handleOnFinish(form){
        if( form.password === form.passwordConfirm){
            if( this.props.onSave ){
                this.props.onSave(form);
            }else{
                console.error("Missing onSave Property")
            }
        } else {
            message.info("Passwords don't match")
        }
    }

    onAdminChange(e, a1, a2){
        console.log(e);
    }

    render(){
        const classes = this.props.classes;

        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 12 },
        };

        return(
            <Paper className={classes.outerContainer}>
                <PageHeader
                    className="site-page-header"
                    title="Add New User" >

                    <Form {...layout}
                          name="user-form"
                          autoComplete="off"
                          onFinish={this.handleOnFinish.bind(this)}>


                        <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'First Name is required' }]}>
                            <Input name="firstName" autoComplete="off" />
                        </Form.Item>
                        <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'First Name is required' }]}>
                            <Input name="lastName" autoComplete="off" />
                        </Form.Item>
                        <Form.Item name="isFamilyAdmin" label="Is Parent" valuePropName="checked">
                            <Checkbox name="isFamilyAdmin" checked={true}>(Parents have full access to all data)</Checkbox>
                        </Form.Item>

                        <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Password is required' }]}>
                            <Input.Password name="password" type="password" autoComplete="off" />
                        </Form.Item>
                        <Form.Item name="passwordConfirm" label="Confirm Password" rules={[{ required: true, message: 'Password Confirm is required' }]}>
                            <Input.Password name="passwordConfirm" type="password" autoComplete="off" />
                        </Form.Item>
                        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>

                    </Form>
                </PageHeader>
            </Paper>
        );
    }
}

export default withStyles(styleSheet)(NewUserForm);