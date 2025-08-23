import pino from "pino";
import { EventEmitter } from "node:events";

export const logger = pino({ level: process.env.LOG_LEVEL || "info" });

export const events = new EventEmitter();
events.on("error", () => {});

async function sendAlert(message: string) {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) return;
  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message }),
    });
  } catch (err) {
    logger.error({ err }, "Failed to send Slack alert");
  }
}

export function logError(error: unknown, context: string) {
  logger.error({ err: error }, context);
  events.emit("error", { error, context });
  void sendAlert(`${context}: ${(error as Error).message}`);
}
