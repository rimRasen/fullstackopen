const info = (...args) => {
  if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
  console.log(...args);
  }
}

const error = (...args) => {
  if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
  console.error(...args);
  }
}

module.exports = { info, error }