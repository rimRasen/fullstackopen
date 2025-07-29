import './App.css'
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import loginService from './services/login'
import blogService from './services/blogs'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

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

  const blogFormRef = useRef()

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNotification(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Error creating blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

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
      {user === null ? loginForm() : (
        <BlogForm
          user={user}
          handleLogout={handleLogout}
          blogFormRef={blogFormRef}
          createBlog={createBlog}
          blogs={blogs}
          expandedBlog={expandedBlog}
          setExpandedBlog={setExpandedBlog}
          handleLike={handleLike}
          handleDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default App