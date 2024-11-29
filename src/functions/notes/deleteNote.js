const { dynamodb, Tables } = require('../../utils/dynamodb');
const { buildResponse } = require('../../utils/response');
const { commonMiddleware } = require('../../middlewares/auth');

const deleteNote = async (event) => {
  try {
    const { id } = event.pathParameters;
    const userId = event.user.email;

    // Get note before deletion for restoration feature
    const noteResult = await dynamodb.get({
      TableName: Tables.NOTES,
      Key: { userId, id }
    }).promise();

    if (!noteResult.Item) {
      return buildResponse(404, { error: 'Note not found' });
    }

    // Save to deleted notes table
    await dynamodb.put({
      TableName: Tables.DELETED_NOTES,
      Item: {
        ...noteResult.Item,
        deletedAt: new Date().toISOString()
      }
    }).promise();

    // Delete from main notes table
    await dynamodb.delete({
      TableName: Tables.NOTES,
      Key: { userId, id }
    }).promise();

    return buildResponse(200, { 
      message: 'Note deleted successfully',
      restorable: true
    });
  } catch (error) {
    return buildResponse(500, { error: 'Could not delete note' });
  }
};

exports.handler = commonMiddleware(deleteNote);