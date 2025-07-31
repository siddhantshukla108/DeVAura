import { createContext, useState, useEffect, useCallback } from 'react';
import { 
  getWeatherByCity, 
  getForecastByCity, 
  getWeatherByCoords,
  getForecastByCoords 
} from '../services/weatherService';

export const WeatherContext = createContext({
  weatherData: null,
  forecastData: null,
  loading: false,
  error: null,
  city: '',
  unit: 'metric',
  locationDenied: false,
  backgroundTheme: 'default',
  fetchWeather: () => {},
  fetchWeatherByLocation: () => {},
  toggleUnit: () => {}
});

export const WeatherProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('');
  const [unit, setUnit] = useState('metric');
  const [locationDenied, setLocationDenied] = useState(false);
  const [backgroundTheme, setBackgroundTheme] = useState('default');

  const getBackgroundTheme = useCallback((weatherId) => {
    if (weatherId >= 200 && weatherId < 300) return 'thunderstorm';
    if (weatherId >= 300 && weatherId < 600) return 'rain';
    if (weatherId >= 600 && weatherId < 700) return 'snow';
    if (weatherId === 800) return 'clear';
    return 'cloudy';
  }, []);

  const handleWeatherError = useCallback((err) => {
    const errorMessage = err.response?.data?.message || 
                       err.message || 
                       'Failed to fetch weather data. Please try again.';
    setError(errorMessage);
    console.error('Weather API Error:', err);
    return errorMessage;
  }, []);

  const updateWeatherState = useCallback((weather, forecast, cityName) => {
    setWeatherData(weather);
    setForecastData(forecast);
    setCity(cityName);
    setBackgroundTheme(getBackgroundTheme(weather.weather[0].id));
    setError(null);
  }, [getBackgroundTheme]);

  const fetchWeather = useCallback(async (cityName) => {
    try {
      setLoading(true);
      setError(null);
      
      const [weather, forecast] = await Promise.all([
        getWeatherByCity(cityName, unit),
        getForecastByCity(cityName, unit)
      ]);
      
      updateWeatherState(weather, forecast, cityName);
    } catch (err) {
      handleWeatherError(err);
    } finally {
      setLoading(false);
    }
  }, [unit, updateWeatherState, handleWeatherError]);

  const fetchWeatherByLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            setLoading(true);
            const { latitude, longitude } = position.coords;
            const [weather, forecast] = await Promise.all([
              getWeatherByCoords(latitude, longitude, unit),
              getForecastByCoords(latitude, longitude, unit)
            ]);
            updateWeatherState(weather, forecast, weather.name);
          } catch (err) {
            handleWeatherError(err);
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          setLocationDenied(true);
          setError('Location access denied. Using default location.');
          fetchWeather('London');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      fetchWeather('London');
    }
  }, [unit, fetchWeather, updateWeatherState, handleWeatherError]);

  const toggleUnit = useCallback(() => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);
    if (city) {
      fetchWeather(city);
    }
  }, [unit, city, fetchWeather]);

  useEffect(() => {
    fetchWeatherByLocation();
  }, [fetchWeatherByLocation]);

  useEffect(() => {
    if (city) {
      fetchWeather(city);
    }
  }, [unit, city, fetchWeather]);

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        forecastData,
        loading,
        error,
        city,
        unit,
        locationDenied,
        backgroundTheme,
        fetchWeather,
        fetchWeatherByLocation,
        toggleUnit,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};