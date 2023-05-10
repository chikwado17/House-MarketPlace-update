import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

import { updateDoc, orderBy, collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';
import ListingItem from '../components/ListingItem';




const Profile = () => {

    const auth = getAuth();

    const [changeDetails, setChangeDetails] = useState(false);
    const [formData, setFormData] = useState({
      name: auth.currentUser.displayName,
      email: auth.currentUser.email
    });

    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { name, email } = formData;
    


    useEffect(() => {

      const fetchUserListings = async () => {

        const listingsRef = collection(db, 'listings');

        const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'))

        const querySnap = await getDocs(q);

        let listings = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data()
          })
        })

        setListings(listings);
        setLoading(false);
      }
      


      fetchUserListings();

    }, [auth.currentUser.uid]);

    //function to logout 
    const onLogout = () => {
      auth.signOut();

      navigate('/');
    }

    const onChange = (e) => {
      setFormData(prevState => ({
        ...prevState,
        [e.target.id]: e.target.value
      }))
    }


    //function to delete from firestore
    const onDelete = async (listingId) => {
      if(window.confirm('Are you sure you want to delete?')) {
        await deleteDoc(doc(db, 'listings', listingId));

        const updatedListings = listings.filter((listing) => listing.id !== listingId);

        setListings(updatedListings);
        toast.success('Successfully deleted listing')
      }
    }

    //on edit redirting to the edit page
    const onEdit = (listingId) => navigate(`/edit/${listingId}`)



    //function to update user profile data
    const updateProfileUser = () => {
      //if changeDetails is true -> call onSubmit function
      changeDetails && onSubmit() 
      //then change the prev state to false
      setChangeDetails(prevState => !prevState);
    }  



    

    const onSubmit = async () => {

      try {
        if(auth.currentUser.displayName !== name) {
          // update display name in firebase
          await updateProfile(auth.currentUser, {
            displayName: name
          });

          // update in firestore
          const userReference = doc(db, 'users', auth.currentUser.uid);

          await updateDoc(userReference, {
            //updating the name field
            name: name
          })
        }
      } catch (error) {
        toast.error('Could not update profile details')
      }
    }


  

  
  return (
    <div className='profile'> 
        <header className="profileHeader">
          <p className="pageHeader">My Profile</p>
          <button type='button' onClick={onLogout} className="logOut">
            Logout
          </button>
        </header>
        <main>
          <div className="profileDetailsHeader">
            <p className="profileDetailsText">
              Personal Details
            </p>
            <p className="changePersonalDetails" onClick={updateProfileUser}>
              {changeDetails ? 'done' : 'edit'}
            </p>
          </div>

          <div className="profileCard">
              <form>
                  <input value={name} onChange={onChange} disabled={!changeDetails} className={!changeDetails ? 'profileName' : 'profileNameActive' } type='text' id="name" />
                  <input value={email} onChange={onChange} disabled={!changeDetails} className={!changeDetails ? 'profileEmail' : 'profileEmailActive' } type='email' id="email" />
              </form>
          </div>

          <Link to='/create' className='createListing'>
            <img src={homeIcon} alt="home" />
            <p>Sale or rent your home</p>
            <img src={arrowRight} alt="arrowright" />
          </Link>

          {!loading && listings?.length > 0 && (
            <>
              <p className="listingText">
                Your Listings
              </p>
              <ul className="listingsList">
                {listings.map((listing) => (
                  <ListingItem 
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}

                    onDelete={() => onDelete(listing.id)}
                    onEdit={() => onEdit(listing.id)}
                  />
                ))}
              </ul>
            </>
          )}
        </main>
    </div>
  )
}

export default Profile;