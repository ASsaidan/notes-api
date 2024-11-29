const { dynamodb, Tables } = require('../../utils/dynamodb');
const { buildResponse } = require('../../utils/response');
const { noteSchema } = require('../../utils/validation');
const { commonMiddleware } = require('../../middlewares/auth');

const updateNote = async (event) => {
  try {
    const { id } = event.pathParameters;
    const { title, text } = event.body;
    const userId = event.user.email;

    console.log('Updating note:', { id, userId, title, text }); 


    // Validate input
    try {
      await noteSchema.validate({ title, text });
    } catch (error) {
      return buildResponse(400, { error: error.message });
    }

    const updatedNote = {
      id,
      userId,
      title,
      text,
      modifiedAt: new Date().toISOString()
    };

    await dynamodb.put({
      TableName: Tables.NOTES,
      Item: updatedNote,
      ConditionExpression: 'userId = :userId AND id = :id',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':id': id
      }
    }).promise();

    return buildResponse(200, updatedNote);
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      return buildResponse(404, { error: 'Note not found or unauthorized' });
    }
    return buildResponse(500, { error: 'Could not update note' });
  }
};

exports.handler = commonMiddleware(updateNote);