const Persons = ({ persons, filter, removePerson}) => {
    const personsToShow = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons
  return (
    <div>
      <h2>Numbers</h2>
      {personsToShow.map(person => 
        <div key={person.name}>
          {person.name} {person.number}
          <button onClick={() => removePerson(person)}>delete</button>
        </div>
      )}
    </div>
  )
}

export default Persons