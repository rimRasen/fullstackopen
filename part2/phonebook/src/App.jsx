import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import { useState, useEffect } from 'react'

import axios from 'axios'
import personService from './services/person'

const App = () => {
  useEffect(() => { 
     personService
     .getAll()
     .then(initialPersons => { 
      setPersons(initialPersons)
     })
  }, [])
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.find(person => person.name === newName)) { 
      alert(`${newName} is already added to phonebook`)
      return
    }
    const personObject = { 
      name: newName,
      number: newNumber
    }
    
    personService
    .create(personObject)
    .then(returnedPerson => { 
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
    })
  }

  const removePerson = (person) => { 
    if (window.confirm(`Delete ${person.name} ?`)) { 
      personService
      .remove(person.id)
      .then(() => { 
        setPersons(persons.filter(p => p.id !== person.id))
      })
    }
  }
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm 
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson} />

      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} removePerson={removePerson}/>
    </div>
  )
}

export default App