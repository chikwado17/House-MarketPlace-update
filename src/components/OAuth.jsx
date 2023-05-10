import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import googleIcon from '../assets/svg/googleIcon.svg';

const OAuth = () => {
    const navigate = useNavigate();
    const location = useLocation();


    const onGoogleIconClick = async () => {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth,provider);

            const user = result.user;

            //getting user doc reference
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            //check if user doesn't exit create user and save to database
            if(!docSnap.exists()){
                //create user in database
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                });
            }

            navigate('/')

            
        } catch (error) {
            toast.error('Could not authorize with Google')
        }
    }

  return (
    <div className='socialLogin'>
        <p>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with </p>
        <button onClick={onGoogleIconClick}  className='socialIconDiv'>
            <img className="socialIconImg" src={googleIcon} alt="google icon" />
        </button>
    </div>
  )
}

export default OAuth