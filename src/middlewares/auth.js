const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const jwt = require('jsonwebtoken');
const { buildResponse } = require('../utils/response');

const authMiddleware = () => {
  return {
    before: async (handler) => {
      try {
        const token = handler.event.headers.Authorization?.replace('Bearer ', '');
        
        if (!token) {
          return buildResponse(401, { error: 'No authorization token provided' });
        }

        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          handler.event.user = decoded;
        } catch (error) {
          return buildResponse(401, { error: 'Invalid or expired token' });
        }
      } catch (error) {
        return buildResponse(500, { error: 'Authentication error' });
      }
    }
  };
};

const commonMiddleware = handler =>
  middy(handler)
    .use(jsonBodyParser())
    .use(authMiddleware());

module.exports = { commonMiddleware };