import WebSocket from "ws";

// Cambia la IP por la de tu máquina si estás usando Docker
const ws = new WebSocket("ws://192.168.1.101:8080");

ws.on("open", () => {
  console.log("✅ Conectado al WS");
  ws.send("Hola servidor");
});

ws.on("message", (msg) => console.log("📩 Mensaje del servidor:", msg.toString()));
ws.on("error", (err) => console.error("❌ WS error:", err));
ws.on("close", () => console.log("🔌 WS cerrado"));
