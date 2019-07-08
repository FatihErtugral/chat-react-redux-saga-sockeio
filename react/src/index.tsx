import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import saga from 'redux-saga';
import App from './App';
import { socketRootSaga } from './saga';
import { chatReducer } from './Chat/reducer';

const sagaMiddleware = saga();
const composeEnhancers = compose(
  applyMiddleware(sagaMiddleware),
  (window as any).__REDUX_DEVTOOLS_EXTENSION__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    : (f: any) => f
);
export const store = createStore(chatReducer, composeEnhancers);

sagaMiddleware.run(socketRootSaga);

// console.log('GET STORE', store.getState());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
