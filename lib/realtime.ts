// Utilities for choosing realtime transports for verse annotations.
// The module exposes a small helper that decides whether a WebRTC
// data channel or a WebSocket connection should be used.

export type RealtimeTransport = "webrtc" | "websocket"

export interface RealtimeConfig {
  /** Prefer a specific transport when available */
  prefer?: RealtimeTransport
}

/**
 * Decide which realtime transport to use for verse annotation updates.
 * WebRTC can reduce server load by enabling peer to peer messaging but
 * requires browser support and a signalling server. WebSockets work
 * everywhere but relay traffic through the server.
 */
export function chooseTransport(cfg: RealtimeConfig = {}): RealtimeTransport {
  if (cfg.prefer) return cfg.prefer

  if (typeof window !== "undefined" && "RTCPeerConnection" in window) {
    return "webrtc"
  }

  return "websocket"
}

export interface WebSocketChannel {
  type: "websocket"
  socket: WebSocket
  send: (data: unknown) => void
  close: () => void
}

/** Minimal connection wrapper. In real usage the WebRTC branch would
 * include signalling and data channel setup. Here we only return the
 * type to allow the caller to handle it or fall back to WebSocket.
 */
export function createRealtimeChannel(
  url: string,
  cfg: RealtimeConfig = {}
): WebSocketChannel | { type: "webrtc" } {
  const transport = chooseTransport(cfg)

  if (transport === "websocket") {
    const socket = new WebSocket(url)
    return {
      type: "websocket",
      socket,
      send: (data) => socket.readyState === 1 && socket.send(JSON.stringify(data)),
      close: () => socket.close(),
    }
  }

  // Placeholder for a future WebRTC implementation.
  return { type: "webrtc" }
}

