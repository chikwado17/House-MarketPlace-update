import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

const Offers = () => {

    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);


     //for pagination
     const [lastfetchedListing, setLastFetchedListing] = useState(null);




    useEffect(() => {

        const fetchListings = async () => {

            try {
                //Get reference
                const listingsRef = collection(db, 'listings');

                //create a query
                const q = query(listingsRef, where('offer', '==', true), orderBy('timestamp', 'desc'), limit(10))

                //excute query
                const querySnap = await getDocs(q);

                //for pagination getting the last fetched item in  firestore
                const lastVisible = querySnap.docs[querySnap.docs.length - 1];
                setLastFetchedListing(lastVisible);
   

                const listings = [];

                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                });

                 setListings(listings);
                 setLoading(false);

            } catch (error) {
                toast.error('Could not fetch listings')
            }

        }

        fetchListings();
    },[]);



    //pagination / load more
    const onFetchMoreListings = async () => {

        try {
            //Get reference
            const listingsRef = collection(db, 'listings');

            //create a query
            const q = query(listingsRef, where('offer', '==', true), orderBy('timestamp', 'desc'), startAfter(lastfetchedListing), limit(10))

            //excute query
            const querySnap = await getDocs(q);


            //for pagination getting the last fetched item in  firestore
            const lastVisible = querySnap.docs[querySnap.docs.length - 1];
            setLastFetchedListing(lastVisible);



            const listings = [];

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            });

            //setting the previous listing =>  the last 10 and the new 10 listings
             setListings((prevState) => [...prevState, ...listings]);
             setLoading(false);

        } catch (error) {
            toast.error('Could not fetch listings')
        }

    }



  return (
    <div className='category'>
        <header>
            <p className="pageHeader">
              Offers
            </p>
        </header>

        {loading ? (
        <Spinner />

        ) : listings && listings.length > 0 ? (

        <>
            <main>
                <ul className="categoryListings">
                    {listings.map((listing) => (
                       <ListingItem key={listing.id} id={listing.id} listing={listing.data} />
                    ))}
                </ul>

            </main>

            <br />
            <br />

            {lastfetchedListing && (
                <p className='loadMore' onClick={onFetchMoreListings}>Load More</p>
            )}
        </>

        ) : (
            <p>There are no current Offers.</p>
        )}

    </div>
  )
}

export default Offers