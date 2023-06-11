# Node-Express-LangChain-TypeScript Boilerplate

## How to run
1. Define an environment variable OPENAI_API_KEY with your OpenAI API key e.g.`export OPENAI_API_KEY=...`
2. `npm run dev`

## How to test

### Streaming chat endpoint
```
curl -N --location --request POST 'http://localhost:3000/chatbot/chat/stream' \
--header 'Content-Type: application/json' \
--data-raw '{
    "message": "I'm in Gilroy, California"
}'
```

### Non-streaming chat endpoint

```
curl --location --request POST 'http://localhost:3000/chatbot/chat' \
--header 'Content-Type: application/json' \
--data-raw '{
    "message": "grit"
}'
```