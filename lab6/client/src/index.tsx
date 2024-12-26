import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import combineReducers from './redux/reducers/combineReducers';

const composeEnhancers = 'object' && window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'];
const enhancer = composeEnhancers();
const store = createStore(combineReducers, enhancer);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
