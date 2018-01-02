'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { login } from '../redux/actions';

@connect(null, { login })
export default class Login extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            username: '',
            password: ''
        };
        this._onUsernameChange = this._onFormChange.bind(this, 'username');
        this._onPasswordChange = this._onFormChange.bind(this, 'password');
        this._login = this._login.bind(this);
    }
    _onFormChange(key, event) {
        this.setState({
            [key]: event.target.value
        });
    }
    _login() {
        this.props.login({name: this.state.username});
    }
    render() {
        return (
            <div className='Login'>
                <Paper className='Form'>
                    <div className="FormHeader">
                        <div className="FormRow">
                            <Typography type='display4'>
                                <Icon className='FormHeaderIcon'>account_circle</Icon>
                            </Typography>
                        </div>
                    </div>
                    <div className='FormRow'>
                        <TextField
                            type='text'
                            label='Username'
                            value={this.state.username}
                            onChange={this._onUsernameChange}
                        />
                    </div>
                    <div className='FormRow'>
                        <TextField
                            type='password'
                            label='Password'
                            value={this.state.password}
                            onChange={this._onPasswordChange}
                        />
                    </div>
                    <div className="FormFooter">
                        <div className="FormRow">
                            <Button
                                raised
                                color='primary'
                                onClick={this._login}
                            >
                                Login
                            </Button>
                        </div>
                    </div>
                </Paper>
            </div>
        );
    }
}