import React, { useState, useEffect } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
// import { getAuth } from 'firebase/auth';
import Spinner from '../components/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])


const Listing = () => {

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);

    const navigate = useNavigate();
    const params = useParams();
    // const auth = getAuth();


    useEffect(() => {

        const fetchListing = async () => {

            //fetching single document from firestore using the params id
            const docRef =  doc(db, 'listings', params.listingId);

            const docSnap = await getDoc(docRef);

            if(docSnap.exists()) {
                setListing(docSnap.data());

                setLoading(false);
            }
        }

        fetchListing();

        // eslint-disable-next-line

    },[navigate, params.listingId]);


    //saving to clipboard
    const handleShareLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setShareLinkCopied(true);
        setTimeout(() => {
            setShareLinkCopied(false)
        },2000);
    }



    if(loading) {
        return <Spinner />
    }

  return (
    <main style={{marginTop:'30px'}}>


        {/* {slider} */}
        <Swiper slidesPerView={1}  pagination={{clickable:true}}>

            {listing.imgUrls.map((url, index) => (
                <SwiperSlide key={index}>
                    <div style={{background: `url(${listing.imgUrls[index]}) center no-repeat`, backgroundSize: 'cover'}} className="swiperSlideDiv">

                    </div>
                </SwiperSlide>
            ))}
        </Swiper>





        <div onClick={handleShareLink} className="shareIconDiv">
            <img src={shareIcon} alt="" />
        </div>


        {shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}

        <div className="listingDetails">
            <p className="listingName">
                {listing.name} - ${listing.offer ? listing.discountedPrice : listing.regularPrice}
            </p>
            <p className="listingLocation">
                {listing.address}
            </p>
            <p className="listingType">
                For {listing.type === 'rent' ? 'Rent' : 'Sale'}
            </p>
            {listing.offer && (
                <p className="discountPrice">
                    ${listing.regularPrice - listing.discountedPrice} discount
                </p>
            )}

            <ul className="listingDetailsList">
                <li>{listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom' }</li>
                <li>{listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom' }</li>
                <li>{listing.parking && 'Parking Spot'}</li>
                <li>{listing.furnished && 'Furnished'}</li>
            </ul>
        </div>
    </main>
  )
}

export default Listing