import WebSocket from "ws";

const USER_ID = "user_123";
const ws = new WebSocket(`ws://localhost:8080?userId=${USER_ID}`);

ws.on("open", () => console.log("✅ Conectado al WS"));
ws.on("message", (msg) => {
  console.log("📩 Evento recibido:", msg.toString());
});
ws.on("error", (err) => console.error("❌ WS error:", err));
ws.on("close", () => console.log("🔌 WS cerrado"));
