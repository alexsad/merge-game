import React, { FunctionComponent } from 'react';
import useLevelsStore from '../stores/LevelsStore';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Link } from "react-router-dom";
import { useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
}));

const Levels:FunctionComponent<{}> = () => {
    const classes = useStyles();
    const {levels, fetchLevels} = useLevelsStore();

    useEffect(() => {
      fetchLevels();
    }, [fetchLevels]);

    return (
    <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={2}>
            {levels.map(({levelNumber}) => (
              <Grid key={levelNumber} item>
                <Paper className={classes.paper}>
                  <Link to={`/level/${levelNumber}`}>
                    {levelNumber}
                  </Link>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
    </Grid>
    );
}

export default Levels;