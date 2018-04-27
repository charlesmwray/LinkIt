import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import './index.css';
import './bootstrap.css';

import App from './App';
import LinkRouter from './Components/LinkRouter';

const Routerr = () => {
    let hrefArr = document.location.href.split('/');
    let user = hrefArr[hrefArr.length - 1] === '/' ? '@' + hrefArr[hrefArr.length - 2] : '@' + hrefArr[hrefArr.length - 1];

    return (
        <Router>
            <Switch>
                <Route exact path="/LinkIt/" component={App} />
                <Route exact path="/" component={App} />
                <Route component={() => (<LinkRouter user={user} />)} />
            </Switch>
        </Router>
    )
}

ReactDOM.render(<Routerr />, document.getElementById('root'));
registerServiceWorker();
