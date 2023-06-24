# Node-Express-LangChain-TypeScript Boilerplate

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

### Event Stream with curl
```
curl --location 'http://localhost:3000/v1/conversations/travel-agent' \
--header 'Accept: text/event-stream' \
--header 'Content-Type: application/json' \
--data '{
    "conversationId": "67357705-7502-4f9e-819a-7656eabff3f5",
    "messages": [
        {
            "id": "67357705-7502-4f9e-819a-7656eabff3a6",
            "text": "I am in Gilroy, California."
        }
    ]
}'
```

### REST Client (VS Code)

[REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) allows you to send HTTP request and view the response in Visual Studio Code directly.

Modify `conversation.http` file in src/http folder to your source code.

