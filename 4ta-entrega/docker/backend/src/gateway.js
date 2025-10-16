import WebSocket, { WebSocketServer } from "ws";
import { consumer } from "./utils/kafka.js";

const RETRY_INTERVAL = 5000;

// Set de clientes WS
const clients = new Set();

// Inicializar WebSocket Server
const wss = new WebSocketServer({ port: 8080, host: "0.0.0.0" });
wss.on("listening", () => console.log("✅ WebSocket listo en ws://0.0.0.0:8080"));

// Conexión de clientes
wss.on("connection", (ws, req) => {
  console.log("👤 Cliente conectado");
  clients.add(ws);

  ws.on("close", () => {
    console.log("❌ Cliente desconectado");
    clients.delete(ws);
  });

  ws.on("error", (err) => {
    console.error("❌ Error WS cliente:", err);
    clients.delete(ws);
  });
});

// Inicializar Kafka consumer con reconexión automática
async function initKafkaConsumer() {
  while (true) {
    try {
      console.log("🔄 Intentando conectar Kafka consumer...");
      await consumer.connect();
      await consumer.subscribe({ topic: "txn.events", fromBeginning: true });

      await consumer.run({
        eachMessage: async ({ message }) => {
          try {
            const event = JSON.parse(message.value.toString());
            console.log("📩 Evento recibido de Kafka:", event);

            // Enviar a todos los clientes conectados
            for (const ws of clients) {
              if (ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify(event));
              }
            }
          } catch (err) {
            console.error("❌ Error procesando mensaje Kafka:", err);
          }
        },
      });

      console.log("✅ Kafka consumer conectado y escuchando eventos...");
      break;
    } catch (err) {
      console.error("❌ Error conectando Kafka consumer:", err.message || err);
      console.log(`Reintentando en ${RETRY_INTERVAL / 1000}s...`);
      await new Promise((res) => setTimeout(res, RETRY_INTERVAL));
    }
  }
}

// Inicializar consumer
(async () => {
  console.log("🚀 WebSocket gateway iniciado");
  await initKafkaConsumer();
})();
