import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import SummaryView from './pages/SummaryView';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/summary" component={SummaryView} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;