const Persons = ({ persons, filter}) => {
    const personsToShow = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons
  return (
    <div>
      <h2>Numbers</h2>
      {personsToShow.map(person => 
        <div key={person.name}>
          {person.name} {person.number}
        </div>
      )}
    </div>
  )
}

export default Persons