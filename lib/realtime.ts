/**
 * Provides a thin abstraction for delivering real-time verse annotations.
 *
 * WebSocket
 *   + Simple server implementation
 *   + Works in both browser and Node environments
 *   - Requires a central server for relay
 *
 * WebRTC
 *   + Peer-to-peer with potential for lower latency and bandwidth
 *   - Requires additional signalling infrastructure
 *   - Browser-only APIs and more complex to debug
 *
 * The current default uses WebSocket, while keeping a placeholder for WebRTC
 * should future development favour a peer-to-peer model.
 */

export type RealtimeTransport = "websocket" | "webrtc"

export interface RealtimeChannel {
  send: (data: string) => void
  close: () => void
}

export function createRealtime(
  url: string,
  transport: RealtimeTransport = "websocket"
): RealtimeChannel {
  if (transport === "webrtc") {
    // Full WebRTC implementation would require signalling; not provided yet.
    console.warn("WebRTC not implemented. Falling back to WebSocket.")
  }

  const ws = new WebSocket(url)

  return {
    send: (data: string) => {
      if (ws.readyState === WebSocket.OPEN) ws.send(data)
    },
    close: () => ws.close()
  }
}
