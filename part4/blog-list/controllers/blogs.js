const blogsRouter = require('express').Router()
const { response } = require('express')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
  })

blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})
  
blogsRouter.post('/', async (request, response, next) => {
    const body = request.body 

    if (!body.title || !body.url) { 
      return response.status(400).json({ error: 'title or url missing' })
    }
    if (body.likes === undefined) {
      body.likes = 0
    }

    const blog = new Blog({
      content: body.content,
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
    })

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  })
  
blogsRouter.delete('/:id', async (request, response, next) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
  })

blogsRouter.put('/:id', (request, response, next) => {
    const { title, author, url, likes } = request.body

    Blog.findById(request.params.id)
    .then(blog => {
      if (!blog) {
        return response.status(404).json({ error: 'Blog not found' })
      }

      blog.title = title
      blog.author = author
      blog.url = url
      blog.likes = likes
      
      return blog.save()
      .then(updatedBlog => {
        response.json(updatedBlog)
      })
      .catch(error => {
        next(error)
      })
    })
})

module.exports = blogsRouter