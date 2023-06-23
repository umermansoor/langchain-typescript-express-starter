export interface AIStreamCallbacks {
  onStart?: () => Promise<void>;
  onCompletion?: (completion: string) => Promise<void>;
  onToken?: (token: string) => Promise<void>;
}

/**
 * This function creates a TransformStream that allows transforming incoming
 * string messages into Uint8Array chunks and invoking optional callbacks during
 * the lifecycle of the stream processing.
 *
 * @param callbacks - An object containing optional onStart, onToken, and onCompletion callbacks.
 */
export function createCallbacksTransformer(callbacks: AIStreamCallbacks | undefined) {
  const encoder = new TextEncoder();
  let fullResponse = '';

  const { onStart, onToken, onCompletion } = callbacks || {};

  return new TransformStream<string, Uint8Array>({
    async start(): Promise<void> {
      if (onStart) {
        try {
          await onStart();
        } catch (error) {
          console.error('Error in onStart callback', error);
        }
      }
    },

    async transform(message, controller): Promise<void> {
      controller.enqueue(encoder.encode(message));

      if (onToken) {
        try {
          await onToken(message);
        } catch (error) {
          console.error('Error in onToken callback', error);
        }
      }

      if (onCompletion) fullResponse += message;
    },

    async flush(): Promise<void> {
      if (onCompletion) {
        try {
          await onCompletion?.(fullResponse);
        } catch (error) {
          console.error('Error in onCompletion callback', error);
        }
      }
    },
  });
}
