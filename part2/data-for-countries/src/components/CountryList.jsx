const CountryList = ({ countries, setSelectedCountry }) => {
    if (countries.length > 10) {
        return <p>Too many matches, specify another filter</p>
    }

    if (countries.length === 1) {
        return null
    }

    return (
        <div>
            {countries.map(country => (
                <div key={country.name.common}>
                    {country.name.common}
                    <button onClick={() => setSelectedCountry(country)}>show</button>
                </div>
            ))}
        </div>
    )
}

export default CountryList