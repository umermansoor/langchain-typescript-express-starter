# CodeAhoy Gen AI Chatbot

This project is a general purpose AI chatbot built using TypeScript and [LangChain](https://github.com/hwchase17/langchainjs) as an ExpressJS app. The chatbot is designed with a pluggable architecture, allowing you to easily extend and integrate it with various language models and data sources.

## Features
- Powered by the OpenAI GPT-3 engine, providing rich and interactive conversational experiences.
- Uses Redis for efficient session and conversation management.
- Adopts clean architecture principles, leading to an easily maintainable and scalable codebase.
- In-built RESTful API for chat interactions.
- Supports custom prompt templates for versatile conversation flow.

## Pre-requisites 
- Node.js v19 or above
- Redis server instance
- An API key from [OpenAI](https://openai.com/)

## Setup

### 1. Clone the repository
First, clone this repository to your local machine using `git clone`.

### 2. Install Dependencies
Navigate to the project root and run `npm install` to install all necessary dependencies.

### 3. Define environment variables
Create `.env` files (`.env.development.local`, `.env.test.local`, `.env.production.local`) at the root of your project and add the following variables:

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

Replace `<<YOUR_OPEN_AI_API_KEY_GOES_HERE>>` with your actual OpenAI API key.


### 4. Run the Application
You can launch the application in development mode by running `npm run deploy:dev`.

To watch the logs, you can use `pm2 logs`.

To stop the logs and the application, use `pm2 kill`.


## Testing the API
You can interact with the chatbot using the exposed RESTful API. Here are some examples on how to use it with curl.

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

#### REST Client (VS Code)

[REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) allows you to send HTTP request and view the response in Visual Studio Code directly.

Modify `conversation.http` file in src/http folder to your source code.

