const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, addPerson }) => {
  return (
    <form>
      <div style= {{marginBottom: '0.5rem'}}>
        <label htmlFor="name">
          name:
        </label>
        <input
          value={newName}
          onChange={handleNameChange}
        />
      </div>
      <div> 
        <label htmlFor="number">
          number:
        </label>
        <input
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>
      <div>
        <button type="submit" onClick={addPerson}>add</button>
      </div>
    </form>
  )
}

export default PersonForm