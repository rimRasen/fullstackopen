import PropTypes from 'prop-types'
import Blog from './Blog'
import Togglable from './Togglable'
import { useState } from 'react'

const BlogForm = ({
  user,
  handleLogout,
  blogFormRef,
  createBlog,
  blogs,
  expandedBlog,
  setExpandedBlog,
  handleLike,
  handleDelete,
}) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title: newTitle, author: newAuthor, url: newUrl })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')

    if (blogFormRef && blogFormRef.current) {
      blogFormRef.current.toggleVisibility()
    }
  }
  return (
    <div>
      <h2>Welcome, {user.name}</h2>
      <button onClick={handleLogout}>logout</button>
      <h2>Create new blog</h2>
      <Togglable buttonLabel="Create Blog" ref={blogFormRef}>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title </label> <input id="title" value={newTitle} onChange={({ target }) => setNewTitle(target.value)}/>
          </div>
          <div>
            <label htmlFor="author">Author </label> <input id="author" value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)}/>
          </div>
          <div>
            <label htmlFor="url">URL </label> <input id="url" value={newUrl} onChange={({ target }) => setNewUrl(target.value)}/>
          </div>
          <button type="submit">Submit</button>
        </form>
      </Togglable>
      <p>Your Blogs</p>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            expanded={expandedBlog === blog.id}
            toggleBlog={() => setExpandedBlog(expandedBlog === blog.id ? null : blog.id)}
            onLike={() => handleLike(blog)}
            onDelete={() => handleDelete(blog)}
          />
        )}
    </div>
  )
}

BlogForm.propTypes = {
  user: PropTypes.object.isRequired,
  handleLogout: PropTypes.func.isRequired,
  blogFormRef: PropTypes.object,
  createBlog: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired,
  expandedBlog: PropTypes.string,
  setExpandedBlog: PropTypes.func.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
}

export default BlogForm