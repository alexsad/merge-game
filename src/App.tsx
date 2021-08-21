import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import Levels from './levels/Levels';
import Level from './level/Level';
import AppBar from './app-bar/AppBar';

const App: React.FC = () => {
  return (
    <>
      <CssBaseline/>
      <div className="App">
          <Router>
            <AppBar/>
            <main>
              <Switch>
                <Route path="/" exact render={() => <Redirect to="/levels"/>} />
                <Route path="/levels" exact render={() => <Levels />} />
                <Route path="/level/:id" render={({match:{params}}) => <Level id={Number(params.id)} />} />
              </Switch>
            </main>
          </Router>
      </div>
    </>
  );
}

export default App;
