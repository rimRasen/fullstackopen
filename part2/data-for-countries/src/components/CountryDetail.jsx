import { useEffect, useState } from "react"
import axios from 'axios'
const CountryDetail = ({ country }) => {
    const [weather, setWeather] = useState(null)
    const api_key = import.meta.env.VITE_SOME_KEY

    useEffect(() => {
        axios.
        get(`http://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${api_key}&units=metric`)
        .then(response => {
            setWeather(response.data)
        })
        .catch(error => {
            console.error(error)
        })
    }, [country, api_key])

    if (!country) return null

    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>capital {country.capital}</p>
            <p>area {country.area}</p>
            
            <h3>languages:</h3>
            <ul>
                {Object.values(country.languages).map(language => 
                    <li key={language}>{language}</li>
                )}
            </ul>
            
            <img 
                src={country.flags.png} 
                alt={`Flag of ${country.name.common}`}
                width="150"
            />

            {weather && (
                <div>
                    <h3>Weather in {country.capital}</h3>
                    <p>temperature {weather.main.temp} Celcius</p>
                    <img 
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                        alt={weather.weather[0].description}
                    />
                    <p>wind {weather.wind.speed} m/s</p>
                </div>
            )}
        </div>
    )
}

export default CountryDetail