import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg';
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg';
import bedIcon from '../assets/svg/bedIcon.svg';
import bathtubIcon from '../assets/svg/bathtubIcon.svg';
import { ThemeContext } from '../context/ThemeContext';

const ListingItem = ({listing, id, onDelete, onEdit}) => {


    const { isLightTheme } = useContext(ThemeContext);


  return (
    <li className='categoryListing'>
        <Link className='categoryListingLink' to={`/category/${listing.type}/${id}`}>
            <img className='categoryListingImg' src={listing.imgUrls[0]} alt={listing.name} />

            <div className="categoryListingDetails">
                <p style={{color: isLightTheme ? '' : '#fff'}} className="categoryListingLocation">
                    {listing.address}
                </p>
                <p style={{color: isLightTheme ? '' : '#fff'}} className="categoryListingName">
                    {listing.name}
                </p>

                <p className="categoryListingPrice">
                    ${listing.offer ? listing.discountedPrice : listing.regularPrice}
                    {listing.type === 'rent' && ' / Month'}
                </p>

                <div className="categoryListingInfoDiv">
                    <img  src={bedIcon} alt="bed" />
                    <p style={{color: isLightTheme ? '' : '#fff'}} className="categoryListingInfoText">
                        {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` :  '1 Bedroom'}
                    </p>

                    <img src={bathtubIcon} alt="" />
                    <p style={{color: isLightTheme ? '' : '#fff'}} className="categoryListingInfoText">
                    {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` :  '1 bathroom'}

                    </p>
                </div>
            </div>
        </Link>

        {onDelete && (
            <DeleteIcon onClick={() => onDelete(id, listing.name)} className="removeIcon" fill='rgb(231,76, 60)' />
        )}
        {onEdit && (
            <EditIcon onClick={() => onEdit(id)} className="editIcon" fill={isLightTheme ? 'rgb(0,0, 0)' : '#fffb'} />
        )}
    </li>
  )
}

export default ListingItem