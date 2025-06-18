// client/src/pages/ListingDetail.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { DateRange } from 'react-date-range';
import styles from './ListingDetail.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [disabledDates, setDisabledDates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Listing ID:', id); // Debug

    // Fetch listing details
    const fetchListing = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/listings/${id}`);
        setListing(res.data);
      } catch (error) {
        console.error('Failed to fetch listing:', error);
        setError('Failed to load listing details. Ensure the backend is running.');
      }
    };

    // Fetch availability and booked dates
    const fetchAvailability = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/listings/${id}/availability`);
        const booked = res.data.bookedDates.map(d => new Date(d));
        setDisabledDates(booked);
      } catch (error) {
        console.error('Failed to fetch availability:', error);
      }
    };

    if (id) {
      fetchListing();
      fetchAvailability();
    }
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    const { startDate, endDate } = dateRange[0];
    try {
      await axios.post(
        `${API_URL}/api/bookings`,
        { listingId: id, startDate, endDate },
        { withCredentials: true }
      );
      alert('Booking successful');
    } catch (error) {
      alert('Booking failed');
      console.error('Booking error:', error);
    }
  };

  if (error) return <div>{error}</div>;
  if (!listing) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{listing.title}</h1>
      <div className={styles.grid}>
        <div>
          <img src={listing.images[0]} alt={listing.title} className={styles.image} />
        </div>
        <div>
          <p className={styles.description}>{listing.description}</p>
          <p className={styles.price}>${listing.price}/day</p>
          <p className={styles.location}>{listing.location}</p>
          <form onSubmit={handleBooking} className={styles.form}>
            <DateRange
              ranges={dateRange}
              onChange={(item) => setDateRange([item.selection])}
              disabledDates={disabledDates}
              minDate={new Date()}
            />
            <button type="submit" className={styles.button}>
              Book Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;