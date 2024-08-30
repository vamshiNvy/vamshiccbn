const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Weather Information Service');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/weather', async (req, res) => {
    const city = req.query.city;
  
    if (!city) {
      return res.status(400).json({ error: 'City is required' });
    }
  
    try {
      const response = await axios.get(`http://api.weatherstack.com/current`, {
        params: {
          access_key: process.env.WEATHER_API_KEY,
          query: city,
        },
      });
  
      const data = response.data;
  
      if (data.error) {
        return res.status(400).json({ error: data.error.info });
      }
  
      res.json({
        location: data.location.name,
        temperature: data.current.temperature,
        description: data.current.weather_descriptions[0],
        wind_speed: data.current.wind_speed,
        humidity: data.current.humidity,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  });
  