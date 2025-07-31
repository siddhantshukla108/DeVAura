import { useState, useContext, useEffect } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import { FiSearch, FiMapPin, FiNavigation } from 'react-icons/fi';
import { WiHumidity, WiStrongWind } from 'react-icons/wi';
import '../styles/SearchBar.css';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { 
    fetchWeather, 
    fetchWeatherByLocation,
    locationDenied,
    unit,
    toggleUnit
  } = useContext(WeatherContext);

  const popularCities = [
    "Delhi,IN", "Mumbai,IN", "Bangalore,IN",
    "London,UK", "Paris,FR", "New York,US",
    "Tokyo,JP", "Sydney,AU", "Dubai,AE"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchWeather(searchTerm);
      setSearchTerm('');
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = popularCities.filter(city => 
        city.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  return (
    <div className="search-container">
      <form className="search-bar" onSubmit={handleSubmit}>
        <div className="search-input-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for a city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search for a city"
          />
          <button 
            type="button" 
            className="unit-toggle"
            onClick={toggleUnit}
            aria-label={`Toggle temperature unit to ${unit === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
          >
            °{unit === 'metric' ? 'C' : 'F'}
          </button>
        </div>
        <button 
          type="submit"
          className="search-button"
          aria-label="Search"
        >
          <FiSearch />
        </button>
      </form>

      <div className="location-buttons">
        <button
          onClick={fetchWeatherByLocation}
          disabled={locationDenied}
          className={`location-button ${locationDenied ? 'disabled' : ''}`}
          aria-label="Get weather for current location"
        >
          <FiNavigation />
          My Location
        </button>
      </div>

      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((city, index) => (
            <li 
              key={index} 
              onClick={() => {
                fetchWeather(city);
                setSearchTerm('');
                setSuggestions([]);
              }}
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && fetchWeather(city)}
            >
              <FiMapPin className="suggestion-icon" />
              {city.split(',')[0]}
              <span className="country-code">{city.split(',')[1]}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;