import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
test('renders content', async () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://testblog.com',
    likes: 0,
    user: { name: 'Test User' }
  }

  const mockHandler = vi.fn()
  const { container } = render(
    <Blog
      blog={blog}
      expanded={false}
      toggleBlog={mockHandler}
      onLike={() => {}}
      onDelete={() => {}}
      currentUser={{ name: 'Test User' }}
    />
  )

  const button = screen.getByText('view')
  await userEvent.click(button)
  expect(mockHandler).toHaveBeenCalledOnce()
  const element = screen.getByText('Test Blog Test Author')
  screen.debug(element)
  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent(element.textContent)
})

test('renders title and author, but not url or likes by default', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://someurl.com',
    likes: 4,
    user: { name: 'Test User' }
  }
  render(
    <Blog
      blog={blog}
      expanded={false}
      toggleBlog={() => {}}
      onLike={() => {}}
      onDelete={() => {}}
      currentUser={{ name: 'Test User' }}
    />
  )

  expect(screen.getByText('Test Blog Test Author')).toBeDefined()
  expect(screen.queryByText('http://someurl.com')).toBeNull()
  expect(screen.queryByText('Likes: 4')).toBeNull()
})

test('renders url and likes when view button is clicked', async () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://someurl.com',
    likes: 4,
    user: { name: 'Test User' }
  }
  const TestWrapper = () => {
    const [expanded, setExpanded] = useState(false)
    return (
      <Blog
        blog={blog}
        expanded={expanded}
        toggleBlog={() => setExpanded(!expanded)}
        onLike={() => {}}
        onDelete={() => {}}
        currentUser={{ name: 'Test User' }}
      />
    )
  }
  render(<TestWrapper />)

  await userEvent.click(screen.getByText('view'))
  expect(screen.getByText('http://someurl.com')).toBeDefined()
  expect(screen.getByText('Likes: 4')).toBeDefined()
})

test('calls Like event handler twice when like button is called twice', async () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://someurl.com',
    likes: 4,
    user: { name: 'Test User' }
  }

  const mockHandler = vi.fn()

  render(
    <Blog
      blog={blog}
      expanded={true}  // Set to true so like button is visible
      toggleBlog={() => {}}
      onLike={mockHandler}
      onDelete={() => {}}
      currentUser={{ name: 'Test User' }}
    />
  )

  const likeButton = screen.getByText('Like')

  await userEvent.click(likeButton)
  await userEvent.click(likeButton)

  expect(mockHandler).toHaveBeenCalledTimes(2)
})