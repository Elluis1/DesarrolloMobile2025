// orchestrator.js
import { createConsumer, producer } from "./utils/kafka.js";

const RETRY_INTERVAL = 5000;

const consumer = createConsumer("orchestrator-group");

async function initKafka() {
  while (true) {
    try {
      console.log("Conectando a Kafka en broker:", process.env.KAFKA_BROKER);
      await producer.connect();
      await consumer.connect();
      await consumer.subscribe({ topic: "txn.commands", fromBeginning: true });
      console.log("✅ Orchestrator conectado a Kafka");
      break;
    } catch (err) {
      console.error("❌ Error conectando a Kafka:", err.message);
      console.log(`Reintentando en ${RETRY_INTERVAL / 1000}s...`);
      await new Promise(res => setTimeout(res, RETRY_INTERVAL));
    }
  }
}

(async () => {
  await initKafka();
  consumer.run({
    eachMessage: async ({ message }) => {
      const command = JSON.parse(message.value.toString());
      const { transactionId, payload } = command;
  
      try {
        // Paso 1: FundsReserved
        const fundsReserved = {
          transactionId,
          type: "FundsReserved",
          payload: { ok: true, holdId: "hold_" + transactionId, amount: payload.amount }
        };
        await producer.send({ topic: "txn.events", messages: [{ key: transactionId, value: JSON.stringify(fundsReserved) }] });
  
        // Paso 2: FraudChecked
        const fraudChecked = { transactionId, type: "FraudChecked", payload: { risk: "LOW" } };
        await producer.send({ topic: "txn.events", messages: [{ key: transactionId, value: JSON.stringify(fraudChecked) }] });
  
        // Paso 3: Committed
        const committed = { transactionId, type: "Committed", payload: { ledgerTxId: "ledger_" + transactionId } };
        await producer.send({ topic: "txn.events", messages: [{ key: transactionId, value: JSON.stringify(committed) }] });
  
        // Paso 4: Notified
        const notified = { transactionId, type: "Notified", payload: { channels: ["email", "sms"], userId: payload.userId } };
        await producer.send({ topic: "txn.events", messages: [{ key: transactionId, value: JSON.stringify(notified) }] });
  
      } catch (err) {
        console.error("Error processing transaction:", err);
        await producer.send({ topic: "txn.dlq", messages: [{ key: transactionId, value: JSON.stringify(command) }] });
      }
    }
  });
})();

