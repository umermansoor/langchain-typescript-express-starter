
import { Response } from 'express';

export function streamToResponse(res: ReadableStream, response: Response) {
  // TODO support for additional headers callers may want to set
  response.setHeader('Content-Type', 'text/event-stream',)
  response.setHeader('Cache-Control', 'no-cache');
  response.setHeader('Connection', 'keep-alive');
  response.flushHeaders();

  const reader = res.getReader()
  const decoder = new TextDecoder()
  function read() {
    reader.read().then(({ done, value }: { done: boolean; value?: any }) => {
      if (done) {
        response.send()
        return
      }
      const text = decoder.decode(value)
      response.write(`data: ${text}\n\n`)
      read()
    })
  }
  read()
}
