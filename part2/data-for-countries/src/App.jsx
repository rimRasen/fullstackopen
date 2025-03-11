import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import CountryList from './components/CountryList'
import CountryDetail from './components/CountryDetail'
import countriesService from './services/countries'

const App = () => {
    const [countries, setCountries] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCountry, setSelectedCountry] = useState(null)

    useEffect(() => {
        countriesService
            .getAll()
            .then(initialCountries => {
                setCountries(initialCountries)
            })
    }, [])

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value)
        setSelectedCountry(null)
    }

    const filteredCountries = countries.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div>
            <SearchBar value={searchTerm} onChange={handleSearchChange} />
            
            {searchTerm && (
                <>
                    <CountryList 
                        countries={filteredCountries} 
                        setSelectedCountry={setSelectedCountry}
                    />
                    {(filteredCountries.length === 1 || selectedCountry) && (
                        <CountryDetail 
                            country={selectedCountry || filteredCountries[0]} 
                        />
                    )}
                </>
            )}
        </div>
    )
}

export default App