import { consumer, producer } from "./utils/kafka.js";

await consumer.connect();
await producer.connect();

await consumer.subscribe({ topic: "txn.commands", fromBeginning: true });

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
