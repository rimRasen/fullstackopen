import React, { useState } from 'react'

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const StatisticLine = ({ text, value }) => (
  <>
    <td>{text}</td>
    <td>{value}</td>
  </>
)

const Statistics = ({ good, neutral, bad }) => {
  if (good === 0 && neutral === 0 && bad === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  // display the statistics into a table, separate the text and value into different columns
  return (
    <div>
      <table>
        <tbody>
         <tr>
          <StatisticLine text='good' value={good} />
         </tr>
          <tr>
            <StatisticLine text='neutral' value={neutral} />
          </tr>
          <tr>
            <StatisticLine text='bad' value={bad} />
          </tr>
          <tr>
            <StatisticLine text='all' value={good + neutral + bad} />
          </tr>
          <tr>
            <StatisticLine text='average' value={(good - bad) / (good + neutral + bad)} />
          </tr>
          <tr>
            <StatisticLine text='positive' value={(good / (good + neutral + bad)) * 100 + ' %'} />
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }
  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }
  const handleBadClick = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleGoodClick} text='good' />
      <Button onClick={handleNeutralClick} text='neutral' />
      <Button onClick={handleBadClick} text='bad' />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}


export default App