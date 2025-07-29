import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(
    <BlogForm
      createBlog={createBlog}
      user={{ name: 'Test User' }}
      handleLogout={() => {}}
      blogFormRef={{ current: { toggleVisibility: () => {} } }}
      blogs={[]}
      expandedBlog={null}
      setExpandedBlog={() => {}}
      handleLike={() => {}}
      handleDelete={() => {}}
    />
  )
  // show the form to get the title
  await user.click(screen.getByText('Create Blog'))

  const inputs = screen.getAllByRole('textbox')
  const submitButton = screen.getByText('Submit')

  await user.type(inputs[0], 'blog title input test')
  await user.click(submitButton)
  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog.mock.calls[0][0].title).toBe('blog title input test')

  const input = screen.get

})