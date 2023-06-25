# Gen AI Chatbot written in TypeScript / LangChain

## Pre-requisites 
- Redis server must be running to store sessions

## How to run

### 1. Define environment variables

You'll need to define the following environment variables in order for the app to work. You can place these in files called `.env.development.local`, `.env.test.local`, `.env.production.local` under the root folder.

```
# PORT
PORT = 3000

# LOG
LOG_FORMAT = dev
LOG_DIR = ../logs

# CORS
ORIGIN = *
CREDENTIALS = true

# OpenAI 
OPENAI_API_KEY = <<YOUR_OPEN_AI_API_KEY_GOES_HERE>>
```

### 2. Run the app
- Launch the app in development mode using: `npm run deploy:dev` (or `npm run dev`)
- Run `pm2 logs` to watch the logs
- `pm2 kill`

## How to test

### 1. Create a new conversation

Save the unique id in the response body

```
curl --location --request POST 'http://localhost:3000/v1/conversations' \
--data ''
```

### 2. Send chat messages in the conversation

Use the id to add messages to the conversation

```
curl --location 'http://localhost:3000/v1/conversations/1ef78d70-a80d-4327-ae33-2c239a815e83/messages' \
--header 'Content-Type: application/json' \
--data '{
    "id": "67357705-7502-4f9e-819a-7656eabff3f5",
    "timezoneOffset": 45,
    "messages": [
        {
            "id": "67357705-7502-4f9e-819a-7656eabff3a6",
            "text": "give me some recommendations for alameda,ca",
            "role": "user"
        }
    ]
}'
```

### 3. Get all messages in the conversation

```
curl --location 'http://localhost:3000/v1/conversations/1ef78d70-a80d-4327-ae33-2c239a815e83'
```

### REST Client (VS Code)

[REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) allows you to send HTTP request and view the response in Visual Studio Code directly.

Modify `conversation.http` file in src/http folder to your source code.

