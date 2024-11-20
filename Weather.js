import React, { useState, useEffect } from 'react';
import './Weather.css'; // For custom CSS styling
import './App.css';

const Weather = () => {
  const [city, setCity] = useState('London');  // Default city
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeatherData = async (city) => {
    try {
      const response = await fetch(
        `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${city}&days=5`, // Get 5 days of forecast (today + 4 days)
        {
          method: 'GET',
          headers: {
            'x-rapidapi-key': '2f99f3ee84mshe5be842722a671ap16b411jsn2fe319d0d8ab',
            'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com',
          },
        }
      );

      // Check if response is ok (status code in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched weather data:', data); // Log API response for debugging
      setWeatherData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please check the city name or try again later.');
    }
  };

  useEffect(() => {
    fetchWeatherData(city);  // Fetch weather data for the default city
  }, [city]);

  const handleSearch = (event) => {
    event.preventDefault();
    // Trim city input to avoid unnecessary whitespace issues
    const trimmedCity = city.trim();
    if (trimmedCity) {
      fetchWeatherData(trimmedCity);
    } else {
      setError('Please enter a valid city name.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 weather-card">
        <h3 className="text-center">Weather Forecast</h3>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="d-flex mb-4">
          <input
            type="text"
            placeholder="Enter a City"
            className="form-control me-2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        {/* Error Handling */}
        {error && <p className="text-danger">{error}</p>}

        {/* Weather Data */}
        {weatherData && (
          <div>
            {/* Today's Weather */}
            <div className="today-weather mb-4">
              <h4 className="text-center">{weatherData.location.name}</h4>
              <div className="d-flex justify-content-center align-items-center">
                <img src={weatherData.forecast.forecastday[0].day.condition.icon} alt="weather icon" className="weather-icon-large" />
                <div className="ms-3">
                  <h1>{weatherData.forecast.forecastday[0].day.avgtemp_c}°C</h1>
                  <p>{weatherData.forecast.forecastday[0].day.condition.text}</p>
                </div>
              </div>
            </div>

            {/* Next 4 Days Forecast */}
            <div className="row text-center">
              {weatherData.forecast.forecastday.map((day, index) => (
                <div className="col-sm-3" key={day.date}>
                  <div className="forecast-box p-3">
                    <p>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                    <img src={day.day.condition.icon} alt="weather icon" className="weather-icon" />
                    <p>{day.day.avgtemp_c}°C</p>
                    <p>{day.day.condition.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
