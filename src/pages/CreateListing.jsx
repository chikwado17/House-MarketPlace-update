import React, { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

//for image upload
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase.config';


//for storing to firestore
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';


const CreateListing = () => {

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: 'rent',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: '',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {}
    })


    const {type,name,bedrooms,bathrooms,parking,furnished,address,offer,regularPrice,discountedPrice, images} = formData;


    const auth = getAuth();
    const navigate = useNavigate();
    const isMounted = useRef(true);

    useEffect(() => {

        //avoidin memory leak error on console
        if(isMounted) {
            //getting current logged in user id
            onAuthStateChanged(auth, (user) => {
                if(user) {
                    setFormData({
                        ...formData,
                        userRef: user.uid
                    })
                }else {
                    navigate('/sign-in')
                }
            })

        }

        return () => {
            isMounted.current = false;
        }
    
        //eslint-disable-next-line 
    }, [isMounted])

    if(loading) {
        return <Spinner />
    }



    //handleInputChange
    const onInputChange = (e) => {
        let boolean = null;

        if(e.target.value === 'true') {
            boolean = true
        }
        if(e.target.value === 'false') {
            boolean = false
        }

        //for files upload
        if(e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files
            }))
        }

        //for Text/Booleans/Numbers
        if(!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value
            }))
        }

    }



    //function for input submit
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);


        //for offer discount
        if(discountedPrice >= regularPrice) {
            setLoading(false);
            toast.error('Discounted price needs to be less than regular price');
            return;
        }



        //for image upload
        if(images.length > 6) {
            setLoading(false);
            toast.error('Max 6 images');
            return;
        }

        //Store images in firebase
        const storeImage = async (image) => {
            return new Promise((resolve, reject) => {

                const storage = getStorage();
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

                const storageRef = ref(storage, 'images/' + fileName);

                const uploadTask = uploadBytesResumable(storageRef, image);

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {

                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');

                        switch(snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused')
                                break;
                            case 'running':
                                console.log('Upload is running')
                                break;

                                default:
                                  break

                        }
                    },

                    (error) => {
                        //handle unsuccessful uploads
                        reject(error);
                    },

                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then(
                            (downloadURL) => {
                                resolve(downloadURL);
                            }
                        )
                    }
                )
            })
        }

        const imgUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
        ).catch(() => {
             setLoading(false);
             toast.error('Image not uploaded')
             return;
        });



        //saving to firestore
        const formDataCopy = {
          ...formData,
          imgUrls,
          timestamp: serverTimestamp()
        }

        delete formDataCopy.images;
        !formDataCopy.offer && delete formDataCopy.discountedPrice

        const docRef = await addDoc( collection(db, 'listings'), formDataCopy);

        setLoading(false);
        toast.success('Listing saved');
        navigate(`/category/${formDataCopy.type}/${docRef.id}`);


    }







    


    return (
        <div className='profile'>
          <header>
            <p className='pageHeader'>Create a Listing</p>
          </header>
    
          <main>
            <form onSubmit={handleFormSubmit}>
              <label className='formLabel'>Sell / Rent</label>
              <div className='formButtons'>
                <button
                  type='button'
                  className={type === 'sale' ? 'formButtonActive' : 'formButton'}
                  id='type'
                  value='sale'
                  onClick={onInputChange}
                >
                  Sell
                </button>
                <button
                  type='button'
                  className={type === 'rent' ? 'formButtonActive' : 'formButton'}
                  id='type'
                  value='rent'
                  onClick={onInputChange}
                >
                  Rent
                </button>
              </div>
    
              <label className='formLabel'>Name</label>
              <input
                className='formInputName'
                type='text'
                id='name'
                value={name}
                onChange={onInputChange}
                maxLength='32'
                minLength='10'
                required
              />
    
              <div className='formRooms flex'>
                <div>
                  <label className='formLabel'>Bedrooms</label>
                  <input
                    className='formInputSmall'
                    type='number'
                    id='bedrooms'
                    value={bedrooms}
                    onChange={onInputChange}
                    min='1'
                    max='50'
                    required
                  />
                </div>
                <div>
                  <label className='formLabel'>Bathrooms</label>
                  <input
                    className='formInputSmall'
                    type='number'
                    id='bathrooms'
                    value={bathrooms}
                    onChange={onInputChange}
                    min='1'
                    max='50'
                    required
                  />
                </div>
              </div>
    
              <label className='formLabel'>Parking spot</label>
              <div className='formButtons'>
                <button
                  className={parking ? 'formButtonActive' : 'formButton'}
                  type='button'
                  id='parking'
                  value={true}
                  onClick={onInputChange}
                  min='1'
                  max='50'
                >
                  Yes
                </button>
                <button
                  className={
                    !parking && parking !== null ? 'formButtonActive' : 'formButton'
                  }
                  type='button'
                  id='parking'
                  value={false}
                  onClick={onInputChange}
                >
                  No
                </button>
              </div>
    
              <label className='formLabel'>Furnished</label>
              <div className='formButtons'>
                <button
                  className={furnished ? 'formButtonActive' : 'formButton'}
                  type='button'
                  id='furnished'
                  value={true}
                  onClick={onInputChange}
                >
                  Yes
                </button>
                <button
                  className={
                    !furnished && furnished !== null
                      ? 'formButtonActive'
                      : 'formButton'
                  }
                  type='button'
                  id='furnished'
                  value={false}
                  onClick={onInputChange}
                >
                  No
                </button>
              </div>
    
              <label className='formLabel'>Address</label>
              <textarea
                className='formInputAddress'
                type='text'
                id='address'
                value={address}
                onChange={onInputChange}
                required
              />
    
          
    
              <label className='formLabel'>Offer</label>
              <div className='formButtons'>
                <button
                  className={offer ? 'formButtonActive' : 'formButton'}
                  type='button'
                  id='offer'
                  value={true}
                  onClick={onInputChange}
                >
                  Yes
                </button>
                <button
                  className={
                    !offer && offer !== null ? 'formButtonActive' : 'formButton'
                  }
                  type='button'
                  id='offer'
                  value={false}
                  onClick={onInputChange}
                >
                  No
                </button>
              </div>
    
              <label className='formLabel'>Regular Price</label>
              <div className='formPriceDiv'>
                <input
                  className='formInputSmall'
                  type='number'
                  id='regularPrice'
                  value={regularPrice}
                  onChange={onInputChange}
                  min='50'
                  max='750000000'
                  required
                />
                {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
              </div>
    
              {offer && (
                <>
                  <label className='formLabel'>Discounted Price</label>
                  <input
                    className='formInputSmall'
                    type='number'
                    id='discountedPrice'
                    value={discountedPrice}
                    onChange={onInputChange}
                    min='50'
                    max='750000000'
                    required={offer}
                  />
                </>
              )}
    
              <label className='formLabel'>Images</label>
              <p className='imagesInfo'>
                The first image will be the cover (max 6).
              </p>
              <input
                className='formInputFile'
                type='file'
                id='images'
                onChange={onInputChange}
                max='6'
                accept='.jpg,.png,.jpeg'
                multiple
                required
              />
              <button type='submit' className='primaryButton createListingButton'>
                Create Listing
              </button>
            </form>
          </main>
        </div>
      )
}

export default CreateListing