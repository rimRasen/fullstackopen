import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import './index.css'
import { useState, useEffect } from 'react'

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
  const  [notificationMessage, setNotificationMessage] = useState(null)

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newName)
    
    if (existingPerson) { 
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) { 
        updateNumber(existingPerson)
      }
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

      // Add notification when a new person is added
      setNotificationMessage({
        text: `Added ${returnedPerson.name}`,
        type: 'success'
      })
    })
    .catch(error => {
      setNotificationMessage({
        text: error.response.data.error || 'Failed to add person',
        type: 'error'
      })
    })
    .finally(() => {
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
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

  const updateNumber = (person) => {
    const personObject = { 
      ...person,
      number: newNumber
    }
    personService
    .update(person.id, personObject)
    .then(returnedPerson => { 
      setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
      setNewNumber('')

      // Add notification when a person is updated
      setNotificationMessage({ 
        text: `Updated ${person.name}`,
        type: 'success'
      })
    })
    .catch(() => { 
      setNotificationMessage({
        text: `Cannot update ${person.name}, They may have been removed from the server`,
        type: 'error'
      })
      setPersons(persons.filter(p => p.id !== person.id))
    })
    .finally(() => {
      setTimeout(() => { 
        setNotificationMessage(null)
      }, 5000)
    })
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
      <Notification message={notificationMessage}/>
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