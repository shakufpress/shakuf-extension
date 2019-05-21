import * as ReactDOM from 'react-dom';
import * as React from 'react';
import App from './view/App';

const root = document.getElementById('root');
ReactDOM.render(
    <App host={location.search.split('?host=')[1]}/>,
    root
);
