const { v4: uuidv4 } = require('uuid');
const { dynamodb, Tables } = require('../../utils/dynamodb');
const { buildResponse } = require('../../utils/response');
const { noteSchema } = require('../../utils/validation');
const { commonMiddleware } = require('../../middlewares/auth');

const createNote = async (event) => {
  try {
    const { title, text } = event.body;
    const userId = event.user.email;
    
    try {
      await noteSchema.validate({ title, text });
    } catch (error) {
      return buildResponse(400, { error: error.message });
    }

    const note = {
      id: uuidv4(),
      userId,
      title,
      text,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    };

    await dynamodb.put({
      TableName: Tables.NOTES,
      Item: note
    }).promise();

    return buildResponse(201, note);
  } catch (error) {
    return buildResponse(500, { error: 'Could not create note' });
  }
};

exports.handler = commonMiddleware(createNote);
