// client/src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { DateRange } from 'react-date-range';
import styles from './Home.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
console.log('API_URL:', API_URL); // Debug

const Home = () => {
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({ location: '', maxPrice: '', dates: null });
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [priceData, setPriceData] = useState({ minPrice: 0, maxPrice: 1000, histogram: [], bucketSize: 100 });
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    // Fetch listings
    const fetchListings = async () => {
      try {
        const query = new URLSearchParams({
          ...(filters.location && { location: filters.location }),
          ...(filters.maxPrice && { price: filters.maxPrice }),
        });
        const res = await axios.get(`${API_URL}/api/listings?${query}`);
        console.log('Listings:', res.data); // Debug
        setListings(res.data);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
        setListings([]);
        setError('Failed to load listings. Ensure the backend is running.');
      }
    };

    // Fetch price distribution
    const fetchPriceDistribution = async () => {
      try {
        console.log('Fetching price distribution from:', `${API_URL}/api/listings/price-distribution`); // Debug
        const res = await axios.get(`${API_URL}/api/listings/price-distribution`);
        console.log('Price Distribution:', res.data); // Debug
        setPriceData(res.data);
        setPriceRange([res.data.minPrice, res.data.maxPrice]);
        setFilters((prev) => ({ ...prev, maxPrice: res.data.maxPrice }));
        await fetchListings();
      } catch (error) {
        console.error('Failed to fetch price distribution:', error);
        // Fallback to default values
        setPriceData({ minPrice: 0, maxPrice: 1000, histogram: [], bucketSize: 100 });
        setPriceRange([0, 1000]);
        setFilters((prev) => ({ ...prev, maxPrice: 1000 }));
        await fetchListings();
      }
    };

    fetchPriceDistribution();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
    setFilters((prev) => ({ ...prev, maxPrice: value[1] }));
  };

  const handleDateChange = (item) => {
    setDateRange([item.selection]);
    setFilters((prev) => ({ ...prev, dates: item.selection }));
    setShowDatePicker(false);
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    try {
      const query = new URLSearchParams({
        ...(filters.location && { location: filters.location }),
        ...(filters.maxPrice && { price: filters.maxPrice }),
      });
      const res = await axios.get(`${API_URL}/api/listings?${query}`);
      setListings(res.data);
    } catch (error) {
      console.error('Failed to filter listings:', error);
      setListings([]);
      setError('Failed to filter listings. Ensure the backend is running.');
    }
  };

  const chartData = {
    labels: Array.from({ length: 10 }, (_, i) => `${Math.round(priceData.minPrice + i * priceData.bucketSize)}-${Math.round(priceData.minPrice + (i + 1) * priceData.bucketSize)}`),
    datasets: [
      {
        label: 'Listings',
        data: priceData.histogram,
        backgroundColor: 'rgba(255, 90, 95, 0.5)', // Airbnb red
        borderColor: 'rgba(255, 90, 95, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={styles.container}>
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
          <div className={styles.datePickerWrapper}>
            <input
              type="text"
              placeholder="Select dates"
              value={
                filters.dates
                  ? `${filters.dates.startDate.toLocaleDateString()} - ${filters.dates.endDate.toLocaleDateString()}`
                  : ''
              }
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={styles.input}
              readOnly
            />
            {showDatePicker && (
              <div className={styles.datePicker}>
                <DateRange
                  ranges={dateRange}
                  onChange={handleDateChange}
                  minDate={new Date()}
                />
              </div>
            )}
          </div>
          <input
            type="text"
            placeholder="Add guests"
            className={styles.input}
            readOnly
            // Placeholder for future guest filter implementation
          />
          <button type="submit" className={styles.button}>
            Search
          </button>
        </div>
        <div>
          <label className={styles.sliderLabel}>Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
          <Slider
            range
            min={priceData.minPrice}
            max={priceData.maxPrice}
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
      <div className={styles.grid}>
        {listings.length === 0 ? (
          <p>No listings found. Ensure the backend is running and seed data is loaded.</p>
        ) : (
          listings.map((listing) => (
            <Link to={`/listing/${listing._id}`} key={listing._id} className={styles.card}>
              <img src={listing.images[0]} alt={listing.title} className={styles.cardImage} />
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{listing.title}</h2>
                <p className={styles.cardLocation}>{listing.location}</p>
                <p className={styles.cardPrice}>${listing.price}/day</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;