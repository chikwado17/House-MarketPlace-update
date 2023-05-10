import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Explore from './pages/Explore';
import ForgotPassword from './pages/ForgotPassword';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import PrivateRoute from './components/PrivateRoute';
import Category from './pages/Category';
import CreateListing from './pages/CreateListing';
import Listing from './pages/Listing';
import EditListing from './pages/EditListing';
import ThemeToggle from './context/ThemeToggle';
import { ThemeContext } from './context/ThemeContext';



const App = () =>  {


  const { isLightTheme } = useContext(ThemeContext);

  return (
    <div>
        <Router>
         
            <div className={`${isLightTheme ? 'Main-Body-Light' : 'Main-Body-Dark'}`}>
              <div className='toggle-btn'>
                <ThemeToggle />
              </div>

              <Routes>
                  <Route path='/' element={<Explore />} />
                  <Route path='/offers' element={<Offers/>} />
                  <Route path='/category/:categoryName' element={<Category/>} />
                  <Route path='/category/:categoryName/:listingId' element={<Listing/>} />


                    {/* {  //private route} */}
                  <Route path='/profile' element={<PrivateRoute/>} > 
                      <Route path='/profile' element={<Profile/>}  />
                  </Route>
                  {/* {  //End of private route} */}

                  <Route path='/sign-in' element={<SignIn/>}  />
                  <Route path='/sign-up' element={<SignUp/>}  />
                  <Route path='/forgot-password' element={<ForgotPassword />}  />
                  <Route path='/create' element={<CreateListing />}  />
                  <Route path='/edit/:listingId' element={<EditListing />}  />

              </Routes>

            </div>
            {/* { Navbar } */}
            <Navbar />
        </Router>
        <ToastContainer />
    </div>
  );
}

export default App;
