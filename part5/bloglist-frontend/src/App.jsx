import './App.css'
import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import loginService from './services/login'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notification, setNotification] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [expandedBlog, setExpandedBlog] = useState(null)

  const loginForm = () => (
    <div>
      <h1>Log in to application</h1>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const newBlogForm = async (event) => {
    event.preventDefault()
    try { 
      const newBlog = { 
        title: newTitle,
        author: newAuthor,
        url: newUrl
      }

      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      setShowForm(false)
      setNotification(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
    catch (exception) {
      setErrorMessage('Error creating blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  const blogForm = () => (
    <div>
      <h2>Welcome, {user.name}</h2>
      <button onClick={handleLogout}>logout</button>
      <h2>Create new blog</h2>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Create Blog'}
      </button>
      {showForm && (
        <form onSubmit={newBlogForm}>
          <div>
            Title: <input value={newTitle} onChange={({ target }) => setNewTitle(target.value)} />
          </div>
          <div>
            Author: <input value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)} />
          </div>
          <div>
            URL: <input value={newUrl} onChange={({ target }) => setNewUrl(target.value)} />
          </div>
          <button type="submit">Submit</button>
        </form>
      )}
      <p>Your Blogs</p>
      {[...blogs]
      .sort((a, b) => b.likes - a.likes)
      .map(blog =>
        <Blog 
          key = {blog.id}
          blog = {blog}
          expanded = {expandedBlog === blog.id}
          toggleBlog = {() => setExpandedBlog(expandedBlog === blog.id ? null : blog.id)}
          onLike = {() => handleLike(blog)}
          onDelete = {() => handleDelete(blog)}
        />
      )}
    </div>
  )

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) { 
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try { 
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLike = async (blog) => { 
    const updatedBlog = {
      user: typeof blog.user === 'object' ? blog.user.id || blog.user._id : blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    try { 
      const returnedBlog = await blogService.update(blog.id, updatedBlog)

      if (typeof blog.user === 'object') {
        returnedBlog.user = blog.user
      }
      setBlogs(blogs.map(b => b.id !== blog.id ? b : returnedBlog))
      
    } catch (exception) {
      setErrorMessage('Error liking blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} ${blog.author}?`)) {
     try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      setNotification(`Blog ${blog.title} ${blog.author} removed`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) { 
      setErrorMessage('Error deleting blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
   }
  }
 
  return (
    <div>
      <h1>Blogs</h1>
      {notification && <div className="notification">{notification}</div>}
      {errorMessage && <div className="error">{errorMessage}</div>}
      {user === null ? loginForm() : blogForm()}
    </div>
  )
}

export default App