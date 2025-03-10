import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import {
  WiHumidity,WiStrongWind,WiSunrise,WiSunset,WiThermometer,WiThermometerExterior,} from "react-icons/wi";
import "./index.css";

function AnalogClock({ hours, minutes, seconds }) {
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6;
  const secondDeg = seconds * 6;
  return (
    <div  className="relative w-56 h-56 md:w-72 md:h-72 lg:w-96 lg:h-96 border-4 border-white rounded-full flex justify-center items-center">
      <div className="absolute w-3 h-3 bg-white rounded-full z-10"></div>
      {/* Hour Hand */}
      <div
        className="absolute w-[4px] h-16 md:h-20 lg:h-24 bg-white top-1/2 left-1/2 origin-bottom"
        style={{
          transform: `translate(-50%, -100%) rotate(${hourDeg}deg)`,
          transformOrigin: "50% 100%",
        }}
      ></div>
      {/* Minute Hand */}
      <div
        className="absolute w-[3px] h-24 md:h-28 lg:h-32 bg-gray-300 top-1/2 left-1/2 origin-bottom"
        style={{
          transform: `translate(-50%, -100%) rotate(${minuteDeg}deg)`,
          transformOrigin: "50% 100%",
        }}
      ></div>
      {/* Second Hand */}
      <div
        className="absolute w-[2px] h-28 md:h-32 lg: bg-red-500 top-1/2 left-1/2 origin-bottom"
        style={{
          transform: `translate(-50%, -100%) rotate(${secondDeg}deg)`,
          transformOrigin: "50% 100%",
        }}
      ></div>
      {/* Clock Numbers */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute text-white text-sm md:text-lg font-bold"
          style={{
            transform: `rotate(${i * 30}deg) translateY(var(--clock-number-offset)) rotate(-${i * 30}deg)`,
          }}
        >
          {i === 0 ? 12 : i}
        </div>
      ))}
    </div>
  );
}
function App() {
  const [Search, setSearch] = useState("");
  const [Loading, setLoading] = useState(false);
  const API_KEY = "e97105be1a34aa4bf3aae55784ec9a1c";
  const [temprature, setTemprature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [windspeed, setWindspeed] = useState(null);
  const [city, setCity] = useState("");
  const [weathericon, setWeathericon] = useState("01d");
  const [weatherDesc, setWeatherDesc] = useState("");
  const [minTemp, setMinTemp] = useState(null);
  const [maxTemp, setMaxTemp] = useState(null);
  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);
  const [timezone, setTimezone] = useState(null);
  const [localTime, setLocalTime] = useState("");
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const fetchCity = async () => {
    if (!Search.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${Search}&appid=${API_KEY}&units=metric`
      );
      if (data) {
        setTemprature(data.main.temp);
        setHumidity(data.main.humidity);
        setCity(data.name);
        setWindspeed(data.wind.speed);
        setWeathericon(data.weather[0].icon);
        setWeatherDesc(data.weather[0].description);
        setMinTemp(data.main.temp_min);
        setMaxTemp(data.main.temp_max);
        setSunrise(data.sys.sunrise);
        setSunset(data.sys.sunset);
        setTimezone(data.timezone);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setCity("city not found");
      setWeathericon("01d");
      setTemprature(null);
     setHumidity(null);
       setWindspeed(null);
      setWeathericon("01d");
      setWeatherDesc("");
      setMinTemp(null);
      setMaxTemp(null);
      setSunrise(null);
      setSunset(null);
      setTimezone(null);
      setLocalTime("");
      setTime({ hours: 0, minutes: 0, seconds: 0 });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!timezone) return;
    const updateTime = () => {
      const now = new Date();
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
      const cityTime = new Date(utcTime + timezone * 1000);
      setTime({
        hours: cityTime.getHours(),
        minutes: cityTime.getMinutes(),
        seconds: cityTime.getSeconds(),
      });
      setLocalTime(cityTime.toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);
  const getBackgroundClass = () => {
    if (!timezone) return "bg-day";
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const cityTime = new Date(utcTime + timezone * 1000);
    const hour = cityTime.getHours();
    if (hour >= 18 && hour < 20) return "bg-evening";
    if (hour >= 20 || hour < 6) return "bg-night"; 
    return "bg-day";
  };
  return (
    <>
      <div
        className={`flex flex-col lg:flex-row justify-center items-center lg:justify-between text-white ${getBackgroundClass()} p-3`}>
      {/* Evening Sun */}
  {getBackgroundClass() === "bg-evening" && <div className="sun"></div>}
{/* Night Moon */}
{getBackgroundClass() === "bg-night" && <div className="moon"></div>}
        {/* Analog Clock - Left */}
        <div className="flex flex-col items-center  mb-6 lg:mb-0">
          <AnalogClock
            hours={time.hours}
            minutes={time.minutes}
            seconds={time.seconds}
          />
              <p className="text-lg font-semibold text-center">{city ? `${city} Analog Clock` : "City Clock"}</p>
        </div>
        {/* Weather Card - Center */}
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-lg p-6 w-full max-w-sm text-center border border-white/30">
          {/* Search Bar */}
          <div className="flex items-center bg-white/20 px-4 py-2 rounded-full mb-4">
            <input
              type="text"
              placeholder="Search city..."
              value={Search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-white placeholder-gray-300 bg-transparent outline-none text-lg"
            />
            <FaSearch
              onClick={fetchCity}
              className="text-gray-500 cursor-pointer hover:text-white transition"
            />
          </div>
          {/* weather data */}
          <img
            src={`http://openweathermap.org/img/wn/${weathericon}@2x.png`}
            alt="Weather Icon"
            className="w-20 mx-auto"
          />
          <p className="capitalize text-lg text-gray-200">
            {weatherDesc || "--"}
          </p>
          {/* Temprature and city */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mt-3 drop-shadow-md">
            {" "}
            <span
              className={`bg-clip-text text-transparent bg-gradient-to-r 
            ${
              temprature < 10
          ? "from-blue-400 to-blue-600"
          : temprature < 25
          ? "from-green-400 to-green-600"
          : temprature < 35
          ? "from-yellow-400 to-yellow-600"
          : "from-red-500 to-red-700"
              }`}
            >
              {Loading
                ? "loading..."
                : temprature !== null
                ? `${temprature}°C`
                : "--"}
            </span>
          </h1>
          <h2 className="text-2xl font-semibold text-white mt-1">
            {city || "Type city name to check weather"}
          </h2>
          {/* Weather Details */}
          <div className="mt-4 grid grid-cols-2 gap-4 text-gray-200">
            {/* Max & Min Temperature */}
            <div className="flex flex-col items-center">
              <WiThermometer className="text-4xl text-red-400 drop-shadow-md" />
              <span>{maxTemp !== null ? `${maxTemp}°C` : "--"}</span>
              <p className="text-sm">Max Temp</p>
            </div>
            <div className="flex flex-col items-center">
              <WiThermometerExterior className="text-4xl text-blue-400 drop-shadow-md" />
              <span>{minTemp !== null ? `${minTemp}°C` : "--"}</span>
              <p className="text-sm">Min Temp</p>
            </div>
            {/* Humidity & Wind Speed */}
            <div className="flex flex-col items-center">
              <WiHumidity className="text-5xl text-blue-200 drop-shadow-md" />
              <span className="text-lg font-medium">
                {humidity !== null ? `${humidity}%` : "--"}
              </span>
              <p className="text-sm">Humidity</p>
            </div>
            <div className="flex flex-col items-center">
              <WiStrongWind className="text-5xl text-gray-300 drop-shadow-md" />
              <span className="text-lg font-medium">
                {windspeed !== null ? `${windspeed} km/hr` : "--"}
              </span>
              <p className="text-sm">Wind Speed</p>
            </div>
            {/* Sunrise & Sunset */}
            <div className="flex flex-col items-center">
              <WiSunrise className="text-4xl text-yellow-300 drop-shadow-md" />
              <span>
                {sunrise ? new Date(sunrise * 1000).toLocaleTimeString() : "--"}
              </span>
              <p className="text-sm">Sunrise</p>
            </div>
            <div className="flex flex-col items-center">
              <WiSunset className="text-4xl text-orange-300 drop-shadow-md" />
              <span>
                {sunset ? new Date(sunset * 1000).toLocaleTimeString() : "--"}
              </span>
              <p className="text-sm">Sunset</p>
            </div>
          </div>
        </div>
        {/* Digital Clock - Right */}
        <div className="text-3xl font-bold bg-black/40 px-6 py-3 rounded-lg mt-6 lg:mt-0">
          {time.hours.toString().padStart(2, "0")}:
          {time.minutes.toString().padStart(2, "0")}:
          {time.seconds.toString().padStart(2, "0")}
          <p className="mt-2 text-lg font-semibold text-center">{city ? `${city} Digital Clock` : "City Clock"}</p>
        </div>
      </div>
    </>
  );
}
export default App;
