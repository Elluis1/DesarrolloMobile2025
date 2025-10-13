import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080, host: "0.0.0.0" });

wss.on("listening", () => console.log("✅ WebSocket escuchando en ws://0.0.0.0:8080"));

wss.on("connection", (ws, req) => {
  console.log("Cliente conectado");

  ws.on("message", (msg) => {
    console.log("📩 Mensaje recibido del cliente:", msg.toString());
    ws.send(`Recibido: ${msg}`);
  });

  ws.on("close", () => console.log("Cliente desconectado"));
  ws.on("error", (err) => console.error("Error WS cliente:", err));
});
