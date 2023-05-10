import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg';
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg';
import Slider from '../components/Slider';
import { ThemeContext } from '../context/ThemeContext';


const Explore = () => {

  const { isLightTheme } = useContext(ThemeContext);

  return (
    <div className='explore'>
        <header>
          <p className="pageHeader">Explore</p>
        </header>

        <main>
          {/* {slider} */}
          <Slider />

          <p className="exploreCategoryHeading">Categories</p>
          <div className="exploreCategories">
            <Link to='/category/rent'>
              <img className='exploreCategoryImg' src={rentCategoryImage} alt="rent  " />
              <p className="exploreCategoryName" style={{color: isLightTheme ? '#000' : '#fff'}}>Places for rent</p>
            </Link>

            <Link to='/category/sale'>
              <img className='exploreCategoryImg' src={sellCategoryImage} alt="sale  " />
              <p className="exploreCategoryName" style={{color: isLightTheme ? '#000' : '#fff'}}>Places for sale</p>
            </Link>
          </div>
        </main>
    </div>
  )
}

export default Explore