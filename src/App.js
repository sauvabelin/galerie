import React, { Component } from 'react';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';

import './App.css';
import Login from './views/Login';
import Album from './views/Album';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Router>
                    <Route exact path="/" render={() => <Redirect to="/login" />} />
                    <Route path="/login" component={Login} />
                    <Route path="/galerie/:path*" component={Album} />
                </Router>
            </div>
        );
    }
}

export default App;
