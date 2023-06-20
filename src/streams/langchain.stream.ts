import { AIStreamCallbacks, createCallbacksTransformer } from "./ai.stream"

export function LangChainStream(callbacks?: AIStreamCallbacks) {
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  return {
    stream: stream.readable.pipeThrough(createCallbacksTransformer(callbacks)),
    handlers: {
      handleLLMNewToken: async (token: string) => {
        await writer.ready
        console.log('LLM token', token)
        await writer.write(token)
      },
      handleLLMEnd: async () => {
        await writer.ready
        await writer.close()
      },
      handleLLMError: async (e: any) => {
        await writer.ready
        await writer.abort(e)
      }
    }
  }
}