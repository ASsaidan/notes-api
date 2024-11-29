# Notes API 📝

A serverless REST API for managing notes using AWS services.

## 📋 API Endpoints Table

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/user/signup` | Create new account |
| POST | `/api/user/login` | Login to account |
| GET | `/api/notes` | Get all notes |
| POST | `/api/notes` | Create note |
| PUT | `/api/notes/{id}` | Update note |
| DELETE | `/api/notes/{id}` | Delete note |
| POST | `/api/notes/restore/{id}` | Restore deleted note |

## 🛠️ Built With
- AWS Lambda
- API Gateway
- DynamoDB
- Node.js
- Serverless Framework

## 🚀 Quick Start

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Deploy:
```bash
serverless deploy
```

## 🧪 Testing with Insomnia

1. Import `insomnia/notes-api-insomnia.json` into Insomnia
2. Test endpoints in this order:
   - Sign Up → Create account
   - Login → Get token
   - Create Note
   - Other operations

## 📝 Note Requirements
- Title: Max 50 characters
- Text: Max 300 characters

## 🌐 Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error



