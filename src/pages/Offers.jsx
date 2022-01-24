import { useEffect, useState } from 'react';

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

function Offers() {
  const [listings, setListings] = useState(null);
  const [loadFetchedListing, setLoadFetchedListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingsRef = collection(db, 'listings');

        const q = query(
          listingsRef,
          where('offer', '==', true),
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

        setListings(listing);
        setLoading(false);
      } catch (error) {
        toast.error('Could not fetch data.');
      }
    };

    fetchListing();
  }, []);

  const onFetchMoreListing = async () => {
    try {
      const listingsRef = collection(db, 'listings');

      const q = query(
        listingsRef,
        where('offer', '==', true),
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

      setListings((prevState) => {
        return [...prevState, ...listing];
      });
      setLoading(false);
    } catch (error) {
      toast.error('Could not fetch data.');
      setLoading(false);
    }
  };

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>

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
          <p>There are no current offers.</p>
        )}
      </header>
    </div>
  );
}

export default Offers;
