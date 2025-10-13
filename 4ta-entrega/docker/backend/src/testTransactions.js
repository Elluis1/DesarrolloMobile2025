import fetch from "node-fetch";
import WebSocket from "ws";

const HOST = "192.168.1.101"; // tu IP real
const WS_URL = `ws://${HOST}:8080?userId=user_123`;
const API_URL = `http://${HOST}:3000/transactions`;

// Conectar WebSocket y esperar a que esté listo
const ws = new WebSocket(WS_URL);

const waitForWS = () => new Promise(resolve => {
  ws.onopen = () => {
    console.log("✅ WebSocket conectado, listo para recibir eventos...");
    resolve();
  };
});

ws.onmessage = (message) => {
  const evt = JSON.parse(message.data);
  console.log("🔹 Evento recibido:", evt.type, evt.payload);
};

// Función para crear una transacción
const createTransaction = async (amount) => {
  const body = {
    fromAccount: "Cuenta_A",
    toAccount: "Cuenta_B",
    amount,
    currency: "USD",
    userId: USER_ID
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    console.log("➡ Transacción creada:", data.transactionId);
  } catch (err) {
    console.error("❌ Error creando transacción:", err.message);
  }
};

// Ejecutar test
const runTest = async () => {
  await waitForWS();
  for (let i = 1; i <= 5; i++) {
    await createTransaction(100 * i);
    await new Promise(res => setTimeout(res, 1000));
  }
};

runTest();
