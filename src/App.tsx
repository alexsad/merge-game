import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import Levels from './levels/Levels';
import Level from './level/Level';
import AppBar from '@material-ui/core/AppBar';
import { Toolbar, Typography, IconButton } from '@material-ui/core';
import GridOnIcon from '@material-ui/icons/GridOn';

const App: React.FC = () => {
  const iconStyle = {color:'#efefef'};
  return (
    <>
      <CssBaseline/>
      <div className="App">
          <Router>
            <AppBar position="fixed" color="inherit">
              <Toolbar>
                <Typography style={{ flexGrow: 1 }} variant="h6" color="textPrimary" noWrap>
                    <Link to="/">
                        <img alt="logo" src="/guessit-logo-min.png" style={{ marginTop: "5px", height: "41px" }} />
                    </Link>
                </Typography>
                <nav>
                </nav>
                <IconButton
                    color="default"
                    aria-label="Open drawer"
                    edge="end"
                    to="/levels"
                    component={Link}
                >
                    <GridOnIcon style={iconStyle}/>
                </IconButton>
              </Toolbar>
            </AppBar>
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
