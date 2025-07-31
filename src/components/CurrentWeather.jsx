import { useContext } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import { WiDaySunny, WiRain, WiCloudy, WiSnow, WiThunderstorm, WiFog } from 'react-icons/wi';
import { RotateLoader } from 'react-spinners';
import '../styles/CurrentWeather.css';

const CurrentWeather = () => {
  const { 
    weatherData, 
    loading, 
    error, 
    city,
    unit  // Make sure this is included in the destructuring
  } = useContext(WeatherContext);

  const getWeatherIcon = (weatherId) => {
    if (weatherId >= 200 && weatherId < 300) return <WiThunderstorm size={60} />;
    if (weatherId >= 300 && weatherId < 400) return <WiRain size={60} />;
    if (weatherId >= 500 && weatherId < 600) return <WiRain size={60} />;
    if (weatherId >= 600 && weatherId < 700) return <WiSnow size={60} />;
    if (weatherId >= 700 && weatherId < 800) return <WiFog size={60} />;
    if (weatherId === 800) return <WiDaySunny size={60} />;
    return <WiCloudy size={60} />;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <RotateLoader color="#4A90E2" />
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!weatherData) return null;

  return (
    <div className="current-weather">
      <h2>{city}</h2>
      <div className="weather-main">
        {getWeatherIcon(weatherData.weather[0].id)}
        <div className="weather-temp">
          {Math.round(weatherData.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
        </div>
      </div>
      <div className="weather-details">
        <div>
          <span>Humidity:</span> {weatherData.main.humidity}%
        </div>
        <div>
          <span>Wind:</span> {Math.round(weatherData.wind.speed * (unit === 'metric' ? 3.6 : 1.60934))} {unit === 'metric' ? 'km/h' : 'mph'}
        </div>
        <div>
          <span>Feels like:</span> {Math.round(weatherData.main.feels_like)}°{unit === 'metric' ? 'C' : 'F'}
        </div>
      </div>
      <div className="weather-description">
        {weatherData.weather[0].description}
      </div>
    </div>
  );
};

export default CurrentWeather;