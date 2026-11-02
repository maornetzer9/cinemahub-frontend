import { useState, useEffect } from 'react';

export const useLocalError = ( err ) => {
    const [ localError, setLocalError ] = useState('');

    useEffect(() => {
        let errorTimer;

        if(err) setLocalError(err);

        if(localError)
        {
            errorTimer = setTimeout(() => {
                setLocalError('');
            }, 3000)
        }

        return () => { if(errorTimer) clearTimeout(errorTimer); }
    },[ err, localError ])

    return { localError, setLocalError };
};