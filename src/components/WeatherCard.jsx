import { motion } from 'framer-motion';
import {
  WiDaySunny, WiRain, WiCloudy, WiSnow, 
  WiThunderstorm, WiFog, WiDayCloudyHigh,
  WiNightClear, WiHumidity, WiStrongWind
} from 'react-icons/wi';
import '../styles/WeatherCard.css';

const WeatherCard = ({ date, data, isCurrent = false, unit = 'metric' }) => {
  // Get more specific weather icons based on OpenWeatherMap icon codes
  const getWeatherIcon = (iconCode) => {
    const iconSize = isCurrent ? 80 : 50;
    
    const iconMap = {
      '01d': <WiDaySunny size={iconSize} />,
      '01n': <WiNightClear size={iconSize} />,
      '02d': <WiDayCloudyHigh size={iconSize} />,
      '02n': <WiDayCloudyHigh size={iconSize} />,
      '03d': <WiCloudy size={iconSize} />,
      '03n': <WiCloudy size={iconSize} />,
      '04d': <WiCloudy size={iconSize} />,
      '04n': <WiCloudy size={iconSize} />,
      '09d': <WiRain size={iconSize} />,
      '09n': <WiRain size={iconSize} />,
      '10d': <WiRain size={iconSize} />,
      '10n': <WiRain size={iconSize} />,
      '11d': <WiThunderstorm size={iconSize} />,
      '11n': <WiThunderstorm size={iconSize} />,
      '13d': <WiSnow size={iconSize} />,
      '13n': <WiSnow size={iconSize} />,
      '50d': <WiFog size={iconSize} />,
      '50n': <WiFog size={iconSize} />
    };

    return iconMap[iconCode] || <WiDayCloudyHigh size={iconSize} />;
  };

  const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
  const formattedDate = new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });

  // Convert wind speed based on unit
  const windSpeed = unit === 'metric' 
    ? Math.round(data.wind.speed * 3.6) // Convert m/s to km/h
    : Math.round(data.wind.speed * 2.237); // Convert m/s to mph

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
    }
  };

  const iconVariants = {
    hover: {
      rotate: [0, 10, -10, 0],
      transition: { duration: 2, repeat: Infinity }
    }
  };

  return (
    <motion.div 
      className={`weather-card ${isCurrent ? 'current' : ''}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div className="weather-card-header">
        <div className="weather-card-date">
          <div className="day">{dayName}</div>
          <div className="date">{formattedDate}</div>
        </div>
        {!isCurrent && (
          <div className="weather-minmax">
            <span>{Math.round(data.main.temp_max)}°</span>
            <span>{Math.round(data.main.temp_min)}°</span>
          </div>
        )}
      </div>

      <motion.div 
        className="weather-icon"
        variants={iconVariants}
        whileHover="hover"
      >
        {getWeatherIcon(data.weather[0].icon)}
      </motion.div>

      <div className="weather-temp">
        {Math.round(data.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
      </div>

      <div className="weather-description">
        {data.weather[0].description}
      </div>

      {isCurrent && (
        <div className="weather-details">
          <div className="detail-item">
            <WiHumidity size={24} />
            <span>{data.main.humidity}%</span>
          </div>
          <div className="detail-item">
            <WiStrongWind size={24} />
            <span>{windSpeed} {unit === 'metric' ? 'km/h' : 'mph'}</span>
          </div>
          <div className="detail-item">
            <span>Feels like:</span>
            <span>{Math.round(data.main.feels_like)}°{unit === 'metric' ? 'C' : 'F'}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WeatherCard;