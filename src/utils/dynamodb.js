const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

const Tables = {
  NOTES: process.env.NOTES_TABLE,
  USERS: process.env.USERS_TABLE,
  DELETED_NOTES: process.env.DELETED_NOTES_TABLE,
};

module.exports = {
  dynamodb,
  Tables,
};