import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';

export const useAuthState = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  let isMounted = useRef(true);

  useEffect(() => {
    const auth = getAuth();
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setLoggedIn(true);
        }
        setCheckingStatus(false);
      });
    }
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  return { loggedIn, checkingStatus };
};
