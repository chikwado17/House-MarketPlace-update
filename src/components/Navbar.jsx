import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg';
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg';
import { ReactComponent as PersonOutlineIcon } from '../assets/svg/personOutlineIcon.svg';
import { ThemeContext } from '../context/ThemeContext';




const Navbar = () => {

    const navigate = useNavigate();
    const location = useLocation();


    const pathMatchRoute = (route) => {
        if(route === location.pathname) {
            return true;
        } 
    }


    const { isLightTheme } = useContext(ThemeContext);


  return (
    <footer className={`${isLightTheme ? 'navbar-light': 'navbar-dark'}`}>
        <nav className="navbarNav">
            <ul className="navbarListItems">
                <li className="navbarListItem" onClick={() => navigate('/')}>
                    <ExploreIcon style={{fill: isLightTheme ? '#2c2c2c' : '#fff'}} fill={pathMatchRoute('/') ? '#2c2c2c' : '#8f8f8f'} width="36px" height="36px" />
                    <p style={{color: isLightTheme ? '#2c2c2c' : '#fff'}} className={pathMatchRoute('/') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Explore</p>
                </li>
                <li className="navbarListItem" onClick={() => navigate('/offers')}>
                    <OfferIcon style={{fill: isLightTheme ? '#2c2c2c' : '#fff'}} fill={pathMatchRoute('/offers') ? '#2c2c2c' : '#8f8f8f'} width="36px" height="36px" />
                    <p style={{color: isLightTheme ? '#2c2c2c' : '#fff'}} className={pathMatchRoute('/offers') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Offers</p>
                </li>
                <li className="navbarListItem" onClick={() => navigate('/profile')}>
                    <PersonOutlineIcon style={{fill: isLightTheme ? '#2c2c2c' : '#fff'}} fill={pathMatchRoute('/profile') ? '#2c2c2c' : '#8f8f8f'} width="36px" height="36px" />
                    <p style={{color: isLightTheme ? '#2c2c2c' : '#fff'}} className={pathMatchRoute('/profile') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Profile</p>
                </li>
            </ul>
        </nav>
    </footer>
  )
}

export default Navbar