import PropTypes from 'prop-types'
const Blog = ({ blog, expanded, toggleBlog, onLike, onDelete }) => (
  <div style={{ paddingTop: 10,paddingLeft: 2,border: 'solid',borderWidth: 1,marginBottom: 5 }}>
    <div className="blog">
      {blog.title} {blog.author}
      <button onClick={toggleBlog}>{expanded ? 'hide' : 'view'}</button>
    </div>
    {expanded && (
      <div>
        <div style={{ margin: 0 }}>{blog.url}</div>
        <div style={{ display: 'flex', alignItems: 'center', margin: 0 }}>
          Likes: {blog.likes}
          <button style={{ marginLeft: '8px' }} onClick={onLike}>Like</button>
        </div>
        <div style={{ margin: 0 }}>
          {blog.user && blog.user.name ? blog.user.name : String(blog.user)}
        </div>
        <button onClick={onDelete} style={{ marginTop: '8px', backgroundColor: 'lightcoral' }}>remove</button>
      </div>
    )}
  </div>
)

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  expanded: PropTypes.bool.isRequired,
  toggleBlog: PropTypes.func.isRequired,
  onLike: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
}

export default Blog