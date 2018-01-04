'use strict';

import {
    HashRouter as Router,
    NavLink,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
import AppBar from 'material-ui/AppBar';
import Toobar from 'material-ui/Toolbar';
import Icon from 'material-ui/Icon';
import Tabs, { Tab } from 'material-ui/Tabs';
import Menu,  { MenuItem } from 'material-ui/Menu';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { indigo, blue, green } from 'material-ui/colors';
import Reports from './Report';
import Home from './Home';
import Login from './Login';
import { logout } from '../redux/actions';

const theme = createMuiTheme({
    palette: {
        primary: indigo,
        secondary: blue
    },
    status: {
        success: green
    },
    overrides: {
        MuiButton: {
            raisedPrimary: {
                background: `linear-gradient(45deg, ${indigo.A200} 30%, ${blue[500]} 90%)`
            },
            raisedAccent: {
                background: `linear-gradient(45deg, ${blue.A200} 30%, ${green.A200} 90%)`
            }
        }
    }
});


const TABS = {
    'dashboard': 0,
    'performance': 1,
    'productivity': 2,
    'engagement': 3
};

export function ReportTabs(props) {
    const tab = props.match.params.tab;
    let idx = TABS[tab];
    idx = idx > -1 ? idx : false;
    return (
        <Tabs
            value={idx}>
            <Tab label='Dashboard' icon='dashboard' component={NavLink} to='/dashboard' />
            <Tab label='Performance' icon='attach_money' component={NavLink} to='/performance' />
            <Tab label='Productivity' icon='multiline_chart' component={NavLink} to='/productivity' />
            <Tab label='Engagement & Retention' icon='group' component={NavLink} to='/engagement' />
        </Tabs>
    );
}


@connect((state) => {
    return {
        account: state.account
    };
}, {
    logout
})
export default class App extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            accountMenuAnchorEl: null,
            accountMenuOpen: false
        };
        this.openAccountMenu = this.openAccountMenu.bind(this);
        this.closeAccountMenu = this.closeAccountMenu.bind(this);
        this.logout = this.logout.bind(this);
    }
    openAccountMenu(event) {
        this.setState({
            accountMenuOpen: true,
            accountMenuAnchorEl: event.target
        });
    }
    closeAccountMenu() {
        this.setState({
            accountMenuOpen: false
        });
    }
    logout() {
        this.closeAccountMenu();
        this.props.logout();
    }
    render() {
        return (
            <Router>
                <MuiThemeProvider theme={theme}>
                    <div className='App'>
                        <AppBar position="static">
                            <Toobar>
                                <IconButton>
                                    <Icon>menu</Icon>
                                </IconButton>
                                <div className="HeaderTabs">
                                    <Switch>
                                        <Route path='/login' component={null} />
                                        <Route path='/:tab' component={ReportTabs} />
                                    </Switch>
                                </div>
                                <IconButton
                                    onClick={this.openAccountMenu}
                                >
                                    <Icon>account_circle</Icon>
                                </IconButton>
                                <Menu
                                    anchorEl={this.state.accountMenuAnchorEl}
                                    open={this.state.accountMenuOpen}
                                    onClose={this.closeAccountMenu}
                                >
                                    <MenuItem onClick={this.closeAccountMenu}>Profile</MenuItem>
                                    <MenuItem onClick={this.logout}>Logout</MenuItem>
                                </Menu>
                            </Toobar>
                        </AppBar>
                        <div className="ContentContainer">
                            <Switch>
                                { this.props.account.name ? <Redirect from='/login' to='/dashboard' /> : null }
                                <Route path='/login' component={Login} />
                                { this.props.account.name ? null: <Redirect to='/login'/> }
                                <Route path='/dashboard' component={Home} />
                                <Route path='/:report' component={Reports} />
                                <Redirect from='/' to='/dashboard' />
                            </Switch>
                        </div>
                    </div>
                </MuiThemeProvider>
            </Router>
        );
    }
}