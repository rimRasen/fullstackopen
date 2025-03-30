const blog = require("../models/blog")

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blog.length === 0
    ? 0
    : blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blog.length === 0
    ? 0
    : blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blogs[0])
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}