const { dynamodb, Tables } = require('../../utils/dynamodb');
const { buildResponse } = require('../../utils/response');
const { commonMiddleware } = require('../../middlewares/auth');

const getNotes = async (event) => {
  try {
    const userId = event.user.email;

    const result = await dynamodb.query({
      TableName: Tables.NOTES,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise();

    return buildResponse(200, result.Items);
  } catch (error) {
    return buildResponse(500, { error: 'Could not retrieve notes' });
  }
};

exports.handler = commonMiddleware(getNotes);