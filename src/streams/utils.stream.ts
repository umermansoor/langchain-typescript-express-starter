import { Response } from 'express';

export function streamToResponse(res: ReadableStream, response: Response) {
  // TODO support for additional headers callers may want to set
  response.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });

  const reader = res.getReader();
  const decoder = new TextDecoder();
  function read() {
    reader.read().then(({ done, value }: { done: boolean; value?: any }) => {
      if (done) {
        response.send();
        return;
      }
      const text = decoder.decode(value);
      response.write(`data: ${text}\n\n`);
      read();
    });
  }
  read();
}

export async function streamToString(stream) {
  // lets have a ReadableStream as a stream variable
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString('utf-8');
}
