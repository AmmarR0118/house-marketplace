/* eslint-disable jsx-a11y/anchor-has-content */
import { doc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState } from 'react/cjs/react.development';
import Spinner from '../components/Spinner';
import { db } from '../firebase.config';

function Contact() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [landlord, setLandlord] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, 'users', params.landlordId);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLandlord(docSnap.data());
        setLoading(false);
      } else {
        setLoading(false);
        navigate('/');
        toast.error('Could not get landlord data.');
      }
    };

    getLandlord();
  }, [params.landlordId, navigate]);

  const onChange = (e) => setMessage(e.target.value);

  if (loading) return <Spinner />;
  console.log(searchParams.get('listingName'));
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact Landlord</p>
      </header>

      {landlord && (
        <main>
          <div className="contactLandlord">
            <p className="landlordName">Contact {landlord.name}</p>
          </div>

          <form className="mesageForm">
            <div className="messageDiv">
              <label htmlFor="message" className="messageLabel">
                Message
              </label>

              <textarea
                name="message"
                id="message"
                className="textarea"
                value={message}
                onChange={onChange}
              ></textarea>
            </div>

            <a
              href={`mailto:${landlord.email}?Subject=${searchParams.get(
                'listingName'
              )}&body=${message}`}
            >
              <button type="button" className="primaryButton">
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
}

export default Contact;
