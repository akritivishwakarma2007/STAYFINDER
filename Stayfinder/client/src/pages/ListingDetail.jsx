import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import { AuthContext } from "../contexts/AuthContext";
import styles from "./ListingDetail.module.css";
import api from "../api";

const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [disabledDates, setDisabledDates] = useState([]);
  const [error, setError] = useState(null);
  const { user, loading, logout } = useContext(AuthContext); // Added logout and loading
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Listing ID:", id);

    const fetchListing = async () => {
      try {
        const res = await api.get(`/api/listings/${id}`);
        setListing(res.data);
      } catch (error) {
        console.error("Failed to fetch listing:", error.response?.data || error.message);
        setError("Failed to load listing details. Ensure the backend is running.");
      }
    };

    const fetchAvailability = async () => {
      try {
        const res = await api.get(`/api/listings/${id}/availability`);
        const booked = res.data.bookedDates.map((d) => new Date(d));
        setDisabledDates(booked);
      } catch (error) {
        console.error("Failed to fetch availability:", error.response?.data || error.message);
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
    console.log("Booking attempt:", { listingId: id, startDate, endDate });
    if (!user) {
      alert("Please log in to book this listing.");
      navigate("/login"); // Redirect to login page
      return;
    }
    if (loading) return;
    try {
      const res = await api.post("/api/bookings", { listingId: id, startDate, endDate }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log("Booking response:", res.data);
      alert("Booking successful");
    } catch (error) {
      console.error("Booking error:", error.response?.data || error.message);
      alert("Booking failed. Please try again. Details: " + (error.response?.data?.message || error.message));
    }
  };

  const handleLogout = () => {
    logout();
    alert("Logged out successfully!");
    navigate("/");
  };

  if (error) return <div>{error}</div>;
  if (!listing) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{listing.title}</h1>
      {user && (
        <button onClick={handleLogout} className={styles.button}>
          Logout
        </button>
      )}
      <div className={styles.grid}>
        <div>
          <img
            src={listing.images[0] || "https://placehold.co/300"}
            alt={listing.title}
            className={styles.image}
          />
        </div>
        <div>
          <p className={styles.description}>{listing.description}</p>
          <p className={styles.price}>₹{listing.price}/day</p> {/* Changed to ₹ */}
          <p className={styles.location}>{listing.location}</p>
          <form onSubmit={handleBooking} className={styles.form}>
            <DateRange
              ranges={dateRange}
              onChange={(item) => setDateRange([item.selection])}
              disabledDates={disabledDates}
              minDate={new Date()}
            />
            <button type="submit" className={styles.button} disabled={loading}>
              Book Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;