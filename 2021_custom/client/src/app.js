import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './pages/home.js';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" render={ Home } />
      </Switch>
    </Router>
  );
};

export default App;
