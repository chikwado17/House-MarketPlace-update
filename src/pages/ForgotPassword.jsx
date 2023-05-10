import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import {  toast } from 'react-toastify';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';


const ForgotPassword = () => {

  const [email, setEmail] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);

      toast.success('Email was sent!');
    }catch(error) {
      toast.error('Error resetting password');
    }
  }

  return (
    <div className='pageContainer'>
      <header>
        <p className="pageHeader">
          Forgot Password
        </p>
      </header>

      <main>
        <form onSubmit={handleFormSubmit}> 
            <input value={email} placeholder="Email" className='emailInput' onChange={(e) => setEmail(e.target.value)} type="email" id="email" />

            <Link className='forgotPasswordLink' to='/sign-in'> Sign In </Link>

            <div className="signInBar">
              <div className="signInText"> Send Reset Link </div>
              <button className='signInButton'>
                <ArrowRightIcon fill='#fff' width='34px' height='34px' />
              </button>
            </div>
        </form>
      </main>
    </div>
  )
}

export default ForgotPassword