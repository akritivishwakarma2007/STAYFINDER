// client/src/pages/Home.jsx
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { DateRange } from "react-date-range";
import { AuthContext } from "../contexts/AuthContext";

import styles from "./Home.module.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
console.log("API_URL:", API_URL); // Debug
const Home = () => {
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({
    location: "",
    maxPrice: "",
    dates: null,
    guests: { adults: 0, children: 0, infants: 0, pets: 0 },
  });
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [priceData, setPriceData] = useState({
    minPrice: 0,
    maxPrice: 10000,
    histogram: [],
    bucketSize: 1000,
  });
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    console.log("useEffect triggered", { hasInitialized });
    if (hasInitialized) return;

    const fetchListings = async () => {
      try {
        const query = new URLSearchParams({
          ...(filters.location && { location: filters.location }),
          ...(filters.maxPrice && { price: filters.maxPrice }),
          ...(filters.guests.adults > 0 && {
            guests:
              filters.guests.adults +
              filters.guests.children +
              filters.guests.infants,
          }),
        }).toString();
        const res = await axios.get(`${API_URL}/api/listings?${query}`, {
          headers: { Authorization: undefined },
        });
        setListings(res.data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch listings:", error.response || error);
        setListings([]);
        setError("Failed to load listings. Ensure the backend is running.");
      }
    };

    const fetchPriceDistribution = async () => {
      try {
        console.log(
          "Fetching price distribution from:",
          `${API_URL}/api/listings/price-distribution`
        );
        const res = await axios.get(`${API_URL}/api/listings/price-distribution`);
        console.log("Price Distribution:", res.data);
        setPriceData(res.data);
        setPriceRange([res.data.minPrice, res.data.maxPrice]);
        setFilters((prev) => ({ ...prev, maxPrice: res.data.maxPrice }));
        await fetchListings();
        setHasInitialized(true);
      } catch (error) {
        console.error("Failed to fetch price distribution:", error);
        setPriceData({
          minPrice: 0,
          maxPrice: 10000,
          histogram: [],
          bucketSize: 1000,
        });
        setPriceRange([0, 10000]);
        setFilters((prev) => ({ ...prev, maxPrice: 10000 }));
        await fetchListings();
        setHasInitialized(true);
      }
    };

    fetchPriceDistribution();
  }, [hasInitialized]);

  const handlePriceChange = (value) => {
    setPriceRange(value);
    setFilters((prev) => ({ ...prev, maxPrice: value[1] }));
  };

  const handleDateChange = (item) => {
    setDateRange([item.selection]);
    setFilters((prev) => ({ ...prev, dates: item.selection }));
    setShowDatePicker(false);
  };

  const handleGuestChange = (category, delta) => {
    setFilters((prev) => {
      const newGuests = { ...prev.guests };
      newGuests[category] = Math.max(0, newGuests[category] + delta);
      return { ...prev, guests: newGuests };
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    try {
      const query = new URLSearchParams({
        ...(filters.location && { location: filters.location }),
        ...(filters.maxPrice && { price: filters.maxPrice }),
        ...(filters.guests.adults > 0 && {
          guests:
            filters.guests.adults +
            filters.guests.children +
            filters.guests.infants,
        }),
      }).toString();
      const res = await axios.get(`${API_URL}/api/listings?${query}`);
      setListings(res.data);
    } catch (error) {
      console.error(
        "Failed to filter listings:",
        error.response?.data?.message || error.message
      );
      setListings([]);
      setError(
        `Failed to filter listings: ${
          error.response?.data?.message || "Ensure the backend is running."
        }`
      );
    }
  };

  const chartData = {
    labels: Array.from(
      { length: 10 },
      (_, i) =>
        `${Math.round(
          priceData.minPrice + i * priceData.bucketSize
        )}-${Math.round(priceData.minPrice + (i + 1) * priceData.bucketSize)}`
    ),
    datasets: [
      {
        label: "Listings",
        data: priceData.histogram,
        backgroundColor: "rgba(255, 90, 95, 0.5)",
        borderColor: "rgba(255, 90, 95, 1)",
        borderWidth: 1,
      },
    ],
  };

  const totalGuests =
    filters.guests.adults + filters.guests.children + filters.guests.infants;

  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>airbnb</div>
        <ul className={styles.navLinks}>
          <li>
            <a href="#homes">Homes</a>
          </li>
          <li>
            <a href="#experiences">
              Experiences <span className={styles.newBadge}>NEW</span>
            </a>
          </li>
          <li>
            <a href="#services">
              Services <span className={styles.newBadge}>NEW</span>
            </a>
          </li>
        </ul>
        <div className={styles.navRight}>
          <a href="#become-a-host" className={styles.becomeHost}>
            Become a host
          </a>
          <div
            className={styles.dropdownTrigger}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <hr className={styles.dropdownLine} />
            <hr className={styles.dropdownLine} />
            <hr className={styles.dropdownLine} />
          </div>
        </div>
      </nav>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className={styles.dropdown}>
          <Link to="/login" className={styles.dropdownItem}>
            Login
          </Link>
          <Link to="/register" className={styles.dropdownItem}>
            Register
          </Link>
        </div>
      )}

      <h1 className={styles.heading}>Find Your Perfect Stay</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleFilterSubmit} className={styles.filterForm}>
        <div className={styles.filterRow}>
          <input
            type="text"
            name="location"
            placeholder="Where are you going?"
            value={filters.location}
            onChange={handleFilterChange}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Check in"
            value={
              filters.dates ? filters.dates.startDate.toLocaleDateString() : ""
            }
            onClick={() => setShowDatePicker(true)}
            className={styles.input}
            readOnly
          />
          <input
            type="text"
            placeholder="Check out"
            value={
              filters.dates ? filters.dates.endDate.toLocaleDateString() : ""
            }
            onClick={() => setShowDatePicker(true)}
            className={styles.input}
            readOnly
          />
          <div className={styles.guestInputWrapper}>
            <input
              type="text"
              placeholder="Add guests"
              value={totalGuests > 0 ? `${totalGuests} guests` : "Add guests"}
              onClick={() => setShowGuestModal(true)}
              className={styles.input}
              readOnly
            />
          </div>
          <button type="submit" className={styles.button}>
            Search
          </button>
        </div>
        {showDatePicker && (
          <div className={styles.datePicker}>
            <DateRange
              ranges={dateRange}
              onChange={handleDateChange}
              minDate={new Date()}
            />
            <button
              onClick={() => setShowDatePicker(false)}
              className={styles.closeButton}
            >
              Close
            </button>
          </div>
        )}
        {showGuestModal && (
          <div className={styles.guestModal}>
            <div className={styles.guestModalContent}>
              <div className={styles.guestCategory}>
                <span>Adults</span>
                <span>Ages 13 or above</span>
                <div className={styles.counter}>
                  <button onClick={() => handleGuestChange("adults", -1)}>
                    -
                  </button>
                  <span>{filters.guests.adults}</span>
                  <button onClick={() => handleGuestChange("adults", 1)}>
                    +
                  </button>
                </div>
              </div>
              <div className={styles.guestCategory}>
                <span>Children</span>
                <span>Ages 2-12</span>
                <div className={styles.counter}>
                  <button onClick={() => handleGuestChange("children", -1)}>
                    -
                  </button>
                  <span>{filters.guests.children}</span>
                  <button onClick={() => handleGuestChange("children", 1)}>
                    +
                  </button>
                </div>
              </div>
              <div className={styles.guestCategory}>
                <span>Infants</span>
                <span>Under 2</span>
                <div className={styles.counter}>
                  <button onClick={() => handleGuestChange("infants", -1)}>
                    -
                  </button>
                  <span>{filters.guests.infants}</span>
                  <button onClick={() => handleGuestChange("infants", 1)}>
                    +
                  </button>
                </div>
              </div>
              <div className={styles.guestCategory}>
                <span>Pets</span>
                <span>Bringing a service animal?</span>
                <div className={styles.counter}>
                  <button onClick={() => handleGuestChange("pets", -1)}>
                    -
                  </button>
                  <span>{filters.guests.pets}</span>
                  <button onClick={() => handleGuestChange("pets", 1)}>
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowGuestModal(false)}
                className={styles.modalCloseButton}
              >
                Close
              </button>
            </div>
          </div>
        )}
        <div>Welcome {user?.email || "Guest"}</div>
        <div>
          <label className={styles.sliderLabel}>
            Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
          </label>
          <Slider
            range
            min={priceData.minPrice}
            max={10000}
            value={priceRange}
            onChange={handlePriceChange}
          />
        </div>
        <div className={styles.chartContainer}>
          {priceData.histogram.length > 0 ? (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                scales: { y: { beginAtZero: true } },
                plugins: { legend: { display: false } },
              }}
            />
          ) : (
            <p>No price distribution data available.</p>
          )}
        </div>
      </form>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Popular homes in [Location] <span className={styles.arrow}>›</span>
        </h2>
        <div className={styles.grid}>
          {listings.length === 0 ? (
            <p>
              No listings found. {error || "Ensure the backend is running."}
            </p>
          ) : (
            listings.map((listing) => (
              <Link
                to={`/listing/${listing._id}`}
                key={listing._id}
                className={styles.card}
              >
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className={styles.cardImage}
                />
                <div className={styles.cardContent}>
                  <h2 className={styles.cardTitle}>{listing.title}</h2>
                  <p className={styles.cardLocation}>{listing.location}</p>
                  <p className={styles.cardPrice}>₹{listing.price}/day</p>
                  <span className={styles.badge}>Guest favourite</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;