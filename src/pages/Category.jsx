import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import ListingItem from '../components/ListingItem';

function Category() {
  const [listings, setListings] = useState(null);
  const [loadFetchedListing, setLoadFetchedListing] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    const fetchListing = async () => {
      try {
        const listingsRef = collection(db, 'listings');

        const q = query(
          listingsRef,
          where('type', '==', params.categoryName),
          orderBy('timestamp', 'desc'),
          limit(10)
        );

        const listingsSnap = await getDocs(q);

        const lastVisible = listingsSnap.docs[listingsSnap.docs.length - 1];
        setLoadFetchedListing(lastVisible);

        const listing = [];

        listingsSnap.forEach((doc) => {
          return listing.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        if (isMounted.current) {
          setListings(listing);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted.current) {
          toast.error('Could not fetch data.');
          setLoading(false);
        }
      }
    };

    fetchListing();

    // (async () => {
    //   if (isMounted.current) {

    //       try {
    //         const listingsRef = collection(db, 'listings');

    //         const q = query(
    //           listingsRef,
    //           where('type', '==', params.categoryName),
    //           orderBy('timestamp', 'desc'),
    //           limit(10)
    //         );

    //         const listingsSnap = await getDocs(q);

    //         const listing = [];

    //         listingsSnap.forEach((doc) => {
    //           return listing.push({
    //             id: doc.id,
    //             data: doc.data(),
    //           });
    //         });

    //         setListings(listing);
    //         setLoading(false);
    //       } catch (error) {
    //         toast.error('Could not fetch data.');
    //       }
    //     }
    //   })()

    return () => {
      isMounted.current = false;
    };
  }, [isMounted, params.categoryName]);

  const onFetchMoreListing = async () => {
    try {
      const listingsRef = collection(db, 'listings');

      const q = query(
        listingsRef,
        where('type', '==', params.categoryName),
        orderBy('timestamp', 'desc'),
        startAfter(loadFetchedListing),
        limit(10)
      );

      const listingsSnap = await getDocs(q);

      const lastVisible = listingsSnap.docs[listingsSnap.length - 1];
      setLoadFetchedListing(lastVisible);

      const listing = [];

      listingsSnap.forEach((doc) => {
        return listing.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      if (isMounted.current) {
        setListings((prevState) => {
          return [...prevState, ...listing];
        });
        setLoading(false);
      }
    } catch (error) {
      if (isMounted.current) {
        toast.error('Could not fetch data.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryName === 'rent'
            ? 'Places for rent'
            : 'Places for sale'}
        </p>

        {loading ? (
          <Spinner />
        ) : listings && listings.length > 0 ? (
          <>
            <main>
              <ul className="categoryListings">
                {listings.map((listing) => (
                  <ListingItem
                    listing={listing.data}
                    id={listing.id}
                    key={listing.id}
                  />
                ))}
              </ul>
            </main>
            <br />
            <br />

            {loadFetchedListing && (
              <p className="loadMore" onClick={onFetchMoreListing}>
                Load More
              </p>
            )}
          </>
        ) : (
          <p>No listings for {params.categoryName}</p>
        )}
      </header>
    </div>
  );
}

export default Category;
