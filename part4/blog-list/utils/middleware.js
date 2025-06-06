const User = require('../models/user');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method);
    logger.info('Path:  ', request.path);
    logger.info('Body:  ', request.body);
    logger.info('---');
    next();
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'invalid token' });
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
        return response.status(400).json({ error: 'username must be unique' });
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({ error: 'token expired' });
    }
    next(error);
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7);
    } else {
        request.token = null;
    }
    next();
}

const userExtractor = async (request, response, next) => {
    const token = request.token

    if (token) { 
        try { 
            const decodedToken = jwt.verify(token, process.env.SECRET);
            if (decodedToken.id) { 
                request.user = await User.findById(decodedToken.id);
            } else { 
                request.user = null;
            }
        } catch (error) {
            request.user = null;
        }
    } else {
        request.user = null;
    }

    next()
}

module.exports = { 
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}

