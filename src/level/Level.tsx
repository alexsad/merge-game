import React, { FunctionComponent, useEffect, useState } from 'react';
import useLevelStore from '../stores/LevelStore';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    recipient: {
        backgroundColor: 'rgba(0,0,255,.11)',
        margin: '0.2rem',
        borderRadius: '0 0 15px 15px',
        padding: '0px'
    },
    oddRecipient: {
        backgroundColor: 'rgba(255,0,1,.11)',
    },
    selectedRecipient: {
        backgroundColor: 'rgba(255,255,0,.5)',
    },
    finishedRecipient: {
        backgroundColor: 'rgba(22,255,115,.5)',
    },
    cellWrapItem: {
        padding: '0px 4px 0px 4px'
    },
    cellItem: {
        textAlign: 'center',
        width: '1.7rem',
        height: '1.7rem',
    },
    cellText: {
        fontSize: '1.3rem'
    },
    levelComplete: {
        position: 'fixed',
        top: '0px',
        left: '0px',
        height: '100%',
        width: '100%',
        backgroundImage: 'url(/bg-winner/bg-winner.png)',
        backgroundPosition: 'top center',
        zIndex: 1
    }
}));

const Level:FunctionComponent<{id: number}> = ({id}) => {
    const classes = useStyles();
    const {level, fetchLevel, moveItens, recipientIsComplete, recipientIsEmpty, finishLevel} = useLevelStore();
    const [selectedRecipient, setSelectedRecipient] = useState(-1);
    const [isFinished, setFinished] = useState(false);

    useEffect(() => {
        fetchLevel(id);
    }, [id, fetchLevel]);

    const isOdd = (value: number) => value%2 === 0;

    const getRecipientClassName = (colIndex: number, pselectedRecipient: number) => {
        if(recipientIsComplete(colIndex)){
            return `${classes.recipient} ${classes.finishedRecipient}`;
        }else if(pselectedRecipient === colIndex){
            return `${classes.recipient} ${classes.selectedRecipient}`;
        }else if(isOdd(colIndex)){
            return `${classes.recipient} ${classes.oddRecipient}`;
        }
        return classes.recipient;
    }

    const setSelectedRecipientHandler = (colIndex: number) => {
        if(recipientIsComplete(colIndex) || recipientIsEmpty(selectedRecipient)){
            setSelectedRecipient(-1);
        }else if(selectedRecipient !== -1 && selectedRecipient !== colIndex){
            moveItens(selectedRecipient, colIndex);
            setSelectedRecipient(-1);
        }else{
            setSelectedRecipient(oldSelectedRecipient => oldSelectedRecipient === colIndex ? -1 : colIndex);
        }
    }

    const levelIsComplete = () => {
        if(id !== level.levelNumber || level.data.length === 0){
            return false;
        }
        const combinationSize = level.data.length - 2;
        const recipentsCompleted = level.data.filter((row, rowIndex) => recipientIsComplete(rowIndex)).length;
        return recipentsCompleted === combinationSize;
    }

    useEffect(() => {
        if(levelIsComplete() && !isFinished){
            finishLevel();
            setTimeout(() => setFinished(true), 2500);
        }
    });

    if(isFinished){
        return (<Redirect to="/"/>);
    }

    return (
        <>
            {levelIsComplete() && (
                <div className={classes.levelComplete}></div>
            )}
            <Grid container className={classes.root} spacing={2}>
                <Grid item xs={12}>
                <Grid container justifyContent="center" spacing={2}>
                    {level.data.map((col, colIndex) => (
                        <List onClick={() => setSelectedRecipientHandler(colIndex)} className={ getRecipientClassName(colIndex, selectedRecipient) } component="nav" key={`recipient_${colIndex}`} aria-label="secondary mailbox folders">
                            {col.map((cell, cellIndex) => (
                                <ListItem button key={`recipient_${cellIndex}`} className={classes.cellWrapItem}>
                                    <ListItemText className={classes.cellItem}>
                                        <span className={classes.cellText}>{cell}</span>
                                    </ListItemText>
                                </ListItem>
                            ))}
                        </List>
                    ))}
                </Grid>
                </Grid>
            </Grid>
        </>
    );
}

export default Level;