'use strict';

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import { createLogger } from 'redux-logger';
import reducer from './reducers';

let isDebuggingInChrome = !!window.navigator.userAgent;

let logger = createLogger({
    predicate: (getState, action) => isDebuggingInChrome,
    collapsed: true,
    duration: true,
});

export default function configureStore(initialState) {
    return createStore(
        reducer,
        initialState,
        applyMiddleware(promise, thunk, logger)
    );
};
