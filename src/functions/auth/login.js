const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dynamodb, Tables } = require('../../utils/dynamodb');
const { buildResponse } = require('../../utils/response');
const { userSchema } = require('../../utils/validation');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');

const login = async (event) => {
  try {
    const { email, password } = event.body;

    // Validate input
    try {
      await userSchema.validate({ email, password });
    } catch (error) {
      return buildResponse(400, { error: error.message });
    }

    // Get user
    const result = await dynamodb.get({
      TableName: Tables.USERS,
      Key: { email }
    }).promise();

    const user = result.Item;
    if (!user) {
      return buildResponse(404, { error: 'User not found' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return buildResponse(401, { error: 'Invalid password' });
    }

    // Generate token
    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return buildResponse(200, { token });
  } catch (error) {
    return buildResponse(500, { error: 'Login failed' });
  }
};

exports.handler = middy(login).use(jsonBodyParser());