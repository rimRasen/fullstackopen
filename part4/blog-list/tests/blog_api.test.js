const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const helper = require('../utils/test_helper')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const blog = require('../models/blog')
let token

describe('deletion of a blog', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const passwordHash = await bcrypt.hash('testpassword', 10)
    const user = new User({
      username: 'testuser',
      name: 'Test User',
      passwordHash
    })
    const savedUser = await user.save()

    token = jwt.sign({
      username: savedUser.username,
      id: savedUser._id
    }, process.env.SECRET)

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://testblog.com',
        likes: 5
      })
      .expect(201)
  })

  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart.find(blog => blog.title === 'Test Blog')

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(blog => blog.title)
    assert(!titles.includes(blogToDelete.title))
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  })
})

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    // Create a user and token for POST tests
    const passwordHash = await bcrypt.hash('testpassword', 10)
    const user = new User({
      username: 'testuser',
      name: 'Test User',
      passwordHash
    })
    const savedUser = await user.save()
    token = jwt.sign({
      username: savedUser.username,
      id: savedUser._id
    }, process.env.SECRET)

    const blogObjects = helper.initialBlogs.map(blog => new Blog({ ...blog, user: savedUser._id }))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body.map(e => e.title)
    assert(blogs.includes('React patterns'))
  })

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(resultBlog.body.title, blogToView.title)
      assert.strictEqual(resultBlog.body.author, blogToView.author)
      assert.strictEqual(resultBlog.body.url, blogToView.url)
      assert.strictEqual(resultBlog.body.likes, blogToView.likes)
      assert.strictEqual(resultBlog.body.id, blogToView.id)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()
      await api.get(`/api/blogs/${validNonexistingId}`).expect(404)
    })

    test('fails with statuscode 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'
      await api.get(`/api/blogs/${invalidId}`).expect(400)
    })
  })

  describe('addition of a new blog', () => {
    test('fails with status code 401 if token is not provided', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const newBlog = { 
        title: "New blog",
        author: "John Doe",
        url: "https://example.com",
        likes: 5
      }
      await api 
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
      assert(!blogsAtEnd.some(blog => blog.title === newBlog.title))
    })
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: "New blog",
        author: "John Doe",
        url: "https://example.com",
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const titles = blogsAtEnd.map(blog => blog.title)
      assert(titles.includes('New blog'))
    })

    test('defaults likes to 0 if missing', async () => {
      const newBlog = {
        title: "New blog",
        author: "John Doe",
        url: "https://example.com"
      }
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const addedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
      assert.strictEqual(addedBlog.likes, 0)
    })

    test('fails with status code 400 if title and url are missing', async () => {
      const newBlog = {
        author: "John Doe",
        likes: 5
      }
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const titles = blogsAtEnd.map(blog => blog.title)
      assert(!titles.includes(blogToDelete.title))
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
    })
  })

  test('the blog identifier is named id', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]
    assert(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})

describe('updating a blog', () => {
  test('can update likes of a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = { 
      ...blogToUpdate, 
      likes: blogToUpdate.likes + 1
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})