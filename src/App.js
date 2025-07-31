import { useContext } from 'react';
import { WeatherContext } from './context/WeatherContext';
import { AnimatePresence, motion } from 'framer-motion';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import './styles/App.css';

function App() {
  // First, call useContext unconditionally
  const weatherContext = useContext(WeatherContext);
  
  // Then destructure with fallback values
  const { 
    weatherData = null, 
    forecastData = null,
    loading = false,
    error = null,
    city = '',
    fetchWeather = () => {},
    fetchWeatherByLocation = () => {},
    toggleUnit = () => {},
    unit = 'metric',
    backgroundTheme = 'default'
  } = weatherContext || {};

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { opacity: 0 }
  };

  return (
    <div className={`app ${backgroundTheme}-theme`}>
      <motion.div
        className="container"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <header className="app-header">
          <motion.h1 
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            WeatherSphere
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Accurate weather forecasts for any location
          </motion.p>
        </header>

        <SearchBar />

        <main className="weather-content">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                className="loading-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="spinner"></div>
                <p>Loading weather data...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                className="error-message"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.div>
            ) : (
              <>
                {weatherData && (
                  <>
                    <CurrentWeather />
                    <Forecast />
                  </>
                )}
              </>
            )}
          </AnimatePresence>
        </main>

        <footer className="app-footer">
          <p>Data provided by OpenWeatherMap</p>
        </footer>
      </motion.div>
    </div>
  );
}

export default App;