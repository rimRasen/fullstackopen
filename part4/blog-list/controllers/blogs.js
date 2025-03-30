const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })
  
blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)
  
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
  })
  
blogsRouter.delete('/:id', (request, response) => {
      Blog.findByIdAndDelete(request.params.id)
          .then(result => {
              if (result) { 
                  response.status(204).end()
              } else { 
                  response.status(404).json({ error: 'Blog not found' })
              }
          })
          .catch(error => {
              console.error(error)
              response.status(500).json({ error: 'Internal server error' })
          })
  })

module.exports = blogsRouter