import React, { FunctionComponent, useState } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';

const Sign:FunctionComponent<{ logged?: boolean }> = ({children}) => {
    const [logged, setLogged] = useState(false);
    // bassStore
    //     .sign()
    //     .then(() => setLogged(true));
    return (
        <>
            {!logged && (
               <LinearProgress />
            )}
            {logged && children}
        </>
    );
  }

export default Sign;