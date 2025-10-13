import WebSocket, { WebSocketServer } from "ws";
import { consumer } from "./utils/kafka.js";

const delay = (ms) => new Promise(res => setTimeout(res, ms));
const RETRY_INTERVAL = 5000;

// Map de clientes WS
const clients = new Map();

// Inicializar WebSocket Server
const wss = new WebSocketServer({ port: 8080, host: "0.0.0.0" }, () => {
  console.log("✅ WebSocket listo en 0.0.0.0:8080");
});

wss.on("connection", (ws, req) => {
  let userId = "unknown";
  try {
    const url = req.url.startsWith("/") ? req.url : `/${req.url}`;
    userId = new URL(url, "http://localhost").searchParams.get("userId") || "unknown";
  } catch (e) {
    console.error("❌ Error parseando userId:", e);
  }

  console.log("👤 Cliente conectado:", userId);
  clients.set(ws, userId);

  ws.on("close", () => {
    console.log("❌ Cliente desconectado:", userId);
    clients.delete(ws);
  });

  ws.on("error", (err) => {
    console.error("❌ Error WS cliente:", err);
    clients.delete(ws);
  });
});

// Función para conectar al consumer de Kafka
async function initKafkaConsumer() {
  while (true) {
    try {
      console.log("🔄 Intentando conectar Kafka consumer...");
      await consumer.connect();
      await consumer.subscribe({ topic: "txn.events", fromBeginning: true });

      await consumer.run({
        eachMessage: async ({ message }) => {
          const event = JSON.parse(message.value.toString());
          console.log("📨 Evento Kafka recibido:", event);

          // Enviar a todos los clientes (debug)
          for (let [ws, uid] of clients.entries()) {
            console.log(`🔔 Enviando evento a cliente ${uid}`);
            if (ws.readyState === ws.OPEN) {
              try {
                ws.send(JSON.stringify(event));
              } catch (e) {
                console.error("❌ Error enviando mensaje WS:", e);
              }
            }
          }
        }
      });

      console.log("✅ Kafka consumer conectado y escuchando eventos...");
      break;
    } catch (err) {
      console.error("❌ Error conectando Kafka consumer:", err.message);
      console.log(`Reintentando en ${RETRY_INTERVAL / 1000}s...`);
      await delay(RETRY_INTERVAL);
    }
  }
}

// Inicializar consumer con reintentos
(async () => {
  console.log("🚀 WebSocket iniciado en puerto 8080");
  await initKafkaConsumer();
})();
