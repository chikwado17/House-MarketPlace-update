import  { useEffect, useState, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const useAuthStatus = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    //solving error memory leak in console
    const isMounted = useRef(true);

    useEffect(() => {
        if(isMounted) {
            const auth = getAuth();
            //fires off when auth state changes
            onAuthStateChanged(auth, (user) => {
                if(user) {
                    setLoggedIn(true);
                }
                setLoading(false);
            })
        }
        return () => {
            isMounted.current = false;
        }

    }, [isMounted]);

  return {loggedIn, loading}
}

