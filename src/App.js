import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.css';
import Login from './views/Login';
import Album from './views/Album';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Router>
                    <Route path="/login" component={Login} />
                    <Route path="/album/:path*" component={Album} />
                </Router>
            </div>
        );
    }
}

export default App;
