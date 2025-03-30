const lodash = require("lodash")
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

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null
    const blogsByAuthor = lodash.countBy(blogs, "author")
    const [author, count] = lodash.maxBy(Object.entries(blogsByAuthor), ([, count]) => count)
    return { author, blogs: count }
}

const mostLikes = (blogs) => { 
    if (blogs.length === 0) return null
    const likesByAuthor = lodash.groupBy(blogs, "author")
    const likesCount = lodash.mapValues(likesByAuthor, (blogs) => lodash.sumBy(blogs, "likes"))
    const [author, likes] = lodash.maxBy(Object.entries(likesCount), ([, likes]) => likes)
    return { author, likes }

}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}