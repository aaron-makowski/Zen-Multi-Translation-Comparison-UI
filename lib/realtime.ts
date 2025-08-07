"use client"

/**
 * Real-time annotation utilities.
 *
 * WebRTC data channels offer peer-to-peer connectivity with very low latency.
 * They require a signalling server and can be complex to deploy but avoid a
 * central relay once connected. This can be ideal for small groups collaborating
 * on verses.
 *
 * WebSockets are simpler: a single persistent connection to a server that
 * broadcasts annotation updates. They are easier to implement and work in more
 * restrictive network environments but route all traffic through the server.
 *
 * The `createRealtimeConnection` helper lets the caller choose which transport
 * to use. For most cases, WebSockets are sufficient. Use WebRTC when direct
 * peer-to-peer communication is desired.
 */

export type RealtimeStrategy = "webrtc" | "websocket"

export interface RealtimeChannel {
  send: (message: unknown) => void
  onMessage: (cb: (message: unknown) => void) => void
  close: () => void
}

export async function createRealtimeConnection(
  url: string,
  strategy: RealtimeStrategy = "websocket",
): Promise<RealtimeChannel> {
  if (strategy === "webrtc") {
    // WebRTC uses a peer connection with a data channel for updates.
    // A full implementation requires signalling which is omitted here.
    const pc = new RTCPeerConnection()
    const channel = pc.createDataChannel("annotations")

    return {
      send: (msg) => channel.send(JSON.stringify(msg)),
      onMessage: (cb) =>
        channel.addEventListener("message", (e) => cb(JSON.parse(e.data))),
      close: () => {
        channel.close()
        pc.close()
      },
    }
  }

  // Default WebSocket implementation where the server relays messages.
  const socket = new WebSocket(url)
  return {
    send: (msg) => socket.send(JSON.stringify(msg)),
    onMessage: (cb) =>
      socket.addEventListener("message", (e) => cb(JSON.parse(e.data))),
    close: () => socket.close(),
  }
}

