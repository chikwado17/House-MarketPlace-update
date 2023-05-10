import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import  { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import { toast } from 'react-toastify';
import OAuth from '../components/OAuth';

const SignIn = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    //destructuring formdata state
    const { email, password } = formData;
    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }));
    }   

    const handleUserSignIn = async (e) => {
        e.preventDefault();
        
        try {
            const auth = getAuth();
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            if(userCredential.user) {
                navigate('/');
            }

        }catch(error) {
            toast.error('Bad User Credential');
        }
    }
    return (
       <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">
                        Welcome Back!
                    </p>
                </header>
                <main>
                    <form onSubmit={handleUserSignIn}>
                        <input type="email" className="emailInput"  placeholder="Email" id="email" value={email} onChange={onChange} />

                        <div className="passwordInputDiv">
                            <input type={showPassword ? 'text' : 'password'} className="passwordInput" placeholder="Password" id="password" value={password} onChange={onChange} />

                            <img src={visibilityIcon} alt="show password" className="showPassword" onClick={() => setShowPassword(prevState => (!prevState)) } />

                            <Link to="/forgot-password" className="forgotPasswordLink">
                                Forgot Password
                            </Link>

                            <div className="signInBar">
                                <p className="signInText">
                                    Sign In
                                </p>
                                <button className="signInButton">
                                    <ArrowRightIcon fill='#fff' width="34px" height="34px" />
                                </button>
                            </div>
                        </div>
                    </form>

                    <OAuth />

                    <Link to="/sign-up" className='registerLink'>Sign Up Instead</Link>

                </main>
            </div>
        </>
    )
}

export default SignIn
