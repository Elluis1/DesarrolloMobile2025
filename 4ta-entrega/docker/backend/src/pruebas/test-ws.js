// src/pruebas/test-ws.js
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "test-client",
  brokers: ["kafka:9092"], // o la URL de tu contenedor Kafka
});

const producer = kafka.producer();

async function sendTestEvent() {
  await producer.connect();
  const event = {
    type: "TRANSACTION_CREATED",
    payload: {
      userId: "user_123",
      amount: 250,
      status: "success",
    },
  };

  await producer.send({
    topic: "transaction-events",
    messages: [{ value: JSON.stringify(event) }],
  });

  console.log("📤 Evento enviado a Kafka:", event);
  await producer.disconnect();
}

sendTestEvent().catch(console.error);
