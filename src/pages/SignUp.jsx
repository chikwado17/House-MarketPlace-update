import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { db } from '../firebase.config';

import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import  { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import { toast } from 'react-toastify';
import OAuth from '../components/OAuth';

const SignUp = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    //destructuring formdata state
    const { name, email, password } = formData;
    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }));
    }   



    const handleUserFormRegister = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth();

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            const user = userCredential.user;

            updateProfile(auth.currentUser, {
                displayName: name
            });

            const formDataCopy = {...formData};

            //firebase function not to save password to database
            delete formDataCopy.password;
            formDataCopy.timestamp = serverTimestamp();

            //adding user registration details to firestore in users collection
            await setDoc(doc(db, 'users', user.uid), formDataCopy);

            navigate('/');

        }catch(error) {

            toast.error('Something is wrong on the user registration');
        }
    }




    return (
       <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">
                        Register!
                    </p>
                </header>
                <main>
                    <form onSubmit={handleUserFormRegister}>

                        <input type="text" className="nameInput"  placeholder="Name" id="name" value={name} onChange={onChange} />


                        <input type="email" className="emailInput"  placeholder="Email" id="email" value={email} onChange={onChange} />

                        <div className="passwordInputDiv">
                            <input type={showPassword ? 'text' : 'password'} className="passwordInput" placeholder="Password" id="password" value={password} onChange={onChange} />

                            <img src={visibilityIcon} alt="show password" className="showPassword" onClick={() => setShowPassword(prevState => (!prevState)) } />

                            <div className="signUpBar">
                                <p className="signUpText">
                                    Sign Up
                                </p>
                                <button className="signUpButton">
                                    <ArrowRightIcon fill='#fff' width="34px" height="34px" />
                                </button>
                            </div>
                        </div>
                    </form>

                    <OAuth />

                    <Link to="/sign-in" className='registerLink'>Sign In Instead</Link>

                </main>
            </div>
        </>
    )
}

export default SignUp
