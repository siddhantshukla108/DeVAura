import axios from 'axios';

const API_KEY = '2f8f3722c3b007d7642189bda0f9c6d8'; // Note: In production, use environment variables
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherByCity = async (city, units = 'metric') => {
  try {
    const encodedCity = encodeURIComponent(city);
    const url = `${BASE_URL}/weather?q=${encodedCity}&appid=${API_KEY}&units=${units}`;
    
    console.log('API Request:', url);
    const response = await axios.get(url);
    
    return response.data;
  } catch (error) {
    console.error('API Error:', {
      city: city,
      status: error.response?.status,
      message: error.response?.data?.message,
    });
    throw new Error(error.response?.data?.message || 'Failed to fetch weather data');
  }
};

export const getForecastByCity = async (city, units = 'metric') => {
  try {
    const encodedCity = encodeURIComponent(city);
    const response = await axios.get(
      `${BASE_URL}/forecast?q=${encodedCity}&appid=${API_KEY}&units=${units}`
    );
    return response.data;
  } catch (error) {
    console.error('Forecast Error:', {
      city: city,
      error: error.response?.data?.message
    });
    throw new Error(error.response?.data?.message || 'Failed to fetch forecast');
  }
};

export const getWeatherByCoords = async (lat, lon, units = 'metric') => {
  try {
    const response = await axios.get(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`
    );
    return response.data;
  } catch (error) {
    console.error('Coordinates Error:', {
      lat: lat,
      lon: lon,
      error: error.response?.data?.message
    });
    throw new Error(error.response?.data?.message || 'Failed to fetch location weather');
  }
};

// Add this missing function
export const getForecastByCoords = async (lat, lon, units = 'metric') => {
  try {
    const response = await axios.get(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`
    );
    return response.data;
  } catch (error) {
    console.error('Forecast Coordinates Error:', {
      lat: lat,
      lon: lon,
      error: error.response?.data?.message
    });
    throw new Error(error.response?.data?.message || 'Failed to fetch forecast by coordinates');
  }
};

export const getCompleteWeatherData = async (location, units = 'metric', isCoords = false) => {
  try {
    const [weather, forecast] = await Promise.all([
      isCoords 
        ? getWeatherByCoords(location.lat, location.lon, units)
        : getWeatherByCity(location, units),
      isCoords
        ? getForecastByCoords(location.lat, location.lon, units)
        : getForecastByCity(location, units)
    ]);
    return { weather, forecast };
  } catch (error) {
    console.error('Complete Weather Error:', error);
    throw error;
  }
};