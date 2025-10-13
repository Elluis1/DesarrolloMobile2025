const WebSocket = require("ws");

const ws = new WebSocket("ws://192.168.1.101:8080?userId=user_123");

ws.on("open", () => {
  console.log("✅ Conectado al WS");
});

ws.on("message", (msg) => {
  console.log("📩 Mensaje recibido:", msg.toString());
});

ws.on("error", (err) => {
  console.error("❌ WS error:", err);
});

ws.on("close", () => console.log("🔌 WS cerrado"));
