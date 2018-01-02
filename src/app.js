/**
 * Entry point of the app
 */
'use strict';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configStore from './redux/store';
import App from './components/App';

const store = configStore();

render((
    <Provider store={store}>
        <App/>
    </Provider>
), document.getElementById('app'));