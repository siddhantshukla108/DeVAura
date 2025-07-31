import { useContext } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import WeatherCard from './WeatherCard';
import { RotateLoader } from 'react-spinners';
import '../styles/Forecast.css';

const Forecast = () => {
  const { forecastData, loading, error, unit } = useContext(WeatherContext); // Added unit here

  if (loading) {
    return (
      <div className="loading-container">
        <RotateLoader color="#4A90E2" />
      </div>
    );
  }

  if (error) return null;

  if (!forecastData) return null;

  // Group forecast by day
  const dailyForecast = forecastData.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = item;
    }
    return acc;
  }, {});

  return (
    <div className="forecast-container">
      <h3>5-Day Forecast</h3>
      <div className="forecast-cards">
        {Object.entries(dailyForecast).slice(0, 5).map(([date, item]) => (
          <WeatherCard key={date} date={date} data={item} unit={unit} />
        ))}
      </div>
    </div>
  );
};

export default Forecast;