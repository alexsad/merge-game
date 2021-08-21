import React, { FunctionComponent } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { Toolbar, Typography, IconButton } from '@material-ui/core';
import GridOnIcon from '@material-ui/icons/GridOn';
import CachedIcon from '@material-ui/icons/Cached';
import { Link, useLocation, useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    imageLogo: {
      marginTop: "5px", 
      height: "41px"
    },
    icon: {
        color:'#efefef',
    },
}));


const AppBarComp:FunctionComponent = () => {
    const classes = useStyles();   
    const location = useLocation();
    const history = useHistory();
    
    const reloadPage = () => {
        console.log('loc:', location);
        history.push('/');
        setTimeout(() => {
            history.replace(location.pathname);
        }, 500);
    }

    return (
        <AppBar position="fixed" color="inherit">
        <Toolbar>
          <Typography style={{ flexGrow: 1 }} variant="h6" color="textPrimary" noWrap>
              <Link to="/">
                  <img alt="logo" src="/guessit-logo-min.png" className={classes.imageLogo}/>
              </Link>
          </Typography>
          <nav>
          </nav>
          <IconButton
              color="default"
              aria-label="Open drawer"
              edge="start"
              onClick={() => reloadPage()}
          >
              <CachedIcon className={classes.icon}/>
          </IconButton>
          <IconButton
              color="default"
              aria-label="Open drawer"
              edge="end"
              to="/levels"
              component={Link}
          >
              <GridOnIcon className={classes.icon}/>
          </IconButton>
        </Toolbar>
      </AppBar>
    );
}

export default AppBarComp;