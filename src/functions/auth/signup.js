const bcrypt = require('bcryptjs');
const { dynamodb, Tables } = require('../../utils/dynamodb');
const { buildResponse } = require('../../utils/response');
const { userSchema } = require('../../utils/validation');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');

const signup = async (event) => {
  try {
    const { email, password } = event.body;
    
    // Validate input
    try {
      await userSchema.validate({ email, password });
    } catch (error) {
      return buildResponse(400, { error: error.message });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    await dynamodb.put({
      TableName: Tables.USERS,
      Item: {
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      },
      ConditionExpression: 'attribute_not_exists(email)',
    }).promise();

    return buildResponse(201, { 
      message: 'User created successfully',
      email 
    });
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      return buildResponse(400, { error: 'Email already exists' });
    }
    return buildResponse(500, { error: 'Could not create user' });
  }
};

exports.handler = middy(signup).use(jsonBodyParser());