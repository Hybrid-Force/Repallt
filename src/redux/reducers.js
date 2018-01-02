'use strict';

import { combineReducers } from 'redux';
import { ACCOUNT_LOGIN, ACCOUNT_LOGOUT } from './actions';

const ACCOUNT_KEY = 'repallt-account';

function accountReducer(state, action={}) {
    if (state === undefined) {
        // try load account info from localstorage
        let accountJson = window.localStorage.getItem(ACCOUNT_KEY);
        if (accountJson) {
            state = JSON.parse(accountJson);
        } else {
            state = {};
        }
    }
    let { type, payload } = action;
    if (type === ACCOUNT_LOGIN) {
        window.localStorage.setItem(ACCOUNT_KEY, JSON.stringify(payload));
        return {
            ...payload
        };
    } else if (type === ACCOUNT_LOGOUT) {
        window.localStorage.removeItem(ACCOUNT_KEY);
        return {};
    }

    return state;
}

const reducer = combineReducers({
    account: accountReducer
});

export default reducer;