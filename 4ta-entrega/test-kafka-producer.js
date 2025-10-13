import { Kafka } from "kafkajs";

// ⚠️ Esto es la IP de tu host, no 'kafka'
const kafka = new Kafka({
  clientId: "bank-txn",
  brokers: ["192.168.1.101:9092"], 
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();
  console.log("✅ Conectado a Kafka");

  await producer.send({
    topic: "txn.events",
    messages: [
      { value: JSON.stringify({ payload: { userId: "user_123", amount: 100 } }) }
    ]
  });

  console.log("✅ Evento enviado a Kafka");
  await producer.disconnect();
};

run().catch(console.error);
