'use strict';

import { createAction } from 'redux-actions';

export const ACCOUNT_LOGIN = 'ACCOUNT_LOGIN';
export const ACCOUNT_LOGOUT = 'ACCOUNT_LOGOUT';

function actionCreator(type) {
    return createAction(type, (payload, meta) => payload, (payload, meta) => meta);
}

export const login = actionCreator(ACCOUNT_LOGIN);
export const logout = actionCreator(ACCOUNT_LOGOUT);