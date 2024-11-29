const { dynamodb, Tables } = require('../../utils/dynamodb');
const { buildResponse } = require('../../utils/response');
const { commonMiddleware } = require('../../middlewares/auth');

const restoreNote = async (event) => {
  try {
    const { id } = event.pathParameters;
    const userId = event.user.email;

    // Get deleted note
    const deletedNoteResult = await dynamodb.get({
      TableName: Tables.DELETED_NOTES,
      Key: { userId, id }
    }).promise();

    if (!deletedNoteResult.Item) {
      return buildResponse(404, { error: 'Deleted note not found' });
    }

    // Prepare note for restoration
    const { deletedAt, ...noteToRestore } = deletedNoteResult.Item;
    noteToRestore.modifiedAt = new Date().toISOString();

    // Restore to main notes table
    await dynamodb.put({
      TableName: Tables.NOTES,
      Item: noteToRestore
    }).promise();

    // Remove from deleted notes
    await dynamodb.delete({
      TableName: Tables.DELETED_NOTES,
      Key: { userId, id }
    }).promise();

    return buildResponse(200, {
      message: 'Note restored successfully',
      note: noteToRestore
    });
  } catch (error) {
    return buildResponse(500, { error: 'Could not restore note' });
  }
};

exports.handler = commonMiddleware(restoreNote);