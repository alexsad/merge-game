import React, { FunctionComponent } from 'react';
import useLevelsStore, { getLevelConfig } from '../stores/LevelsStore';
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
    levelNumberEasy: {
      backgroundColor: '#6dfd6a',
    },
    levelNumberMedium: {
      backgroundColor: '#9589f9',
    },
    levelNumberHard: {
      backgroundColor: '#fdff67',
    },
    levelNumberVeryHard: {
      backgroundColor: '#ffd0d0',
    }
}));

const Levels:FunctionComponent<{}> = () => {
    const classes = useStyles();
    const {levels, fetchLevels} = useLevelsStore();

    useEffect(() => {
      fetchLevels();
    }, [fetchLevels]);

    const getLevelClasseName = (levelNumberName: string) => {
      let classeName = classes.levelNumberVeryHard;
      switch (levelNumberName) {
        case 'easy':
          classeName = classes.levelNumberEasy;
          break;

        case 'medium':
          classeName = classes.levelNumberMedium;
          break;

        case 'hard':
          classeName = classes.levelNumberHard;
          break;

        default:
          break;
      }

      return classeName;
    }

    return (
    <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={2}>
            {levels.map(({levelNumber}) => (
              <Grid key={levelNumber} item>
                <Paper className={`${classes.paper} ${getLevelClasseName(getLevelConfig(levelNumber).levelName)}`}>
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