import express from "express";
import { producer } from "./utils/kafka.js";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());

const PORT = 3000;
await producer.connect();
console.log("✅ Kafka producer connected");

app.post("/transactions", async (req, res) => {
  const transactionId = uuidv4();
  const { fromAccount, toAccount, amount, currency, userId } = req.body;

  const txnCommand = {
    transactionId,
    type: "TransactionInitiated",
    payload: { fromAccount, toAccount, amount, currency, userId }
  };

  await producer.send({
    topic: "txn.commands",
    messages: [{ key: transactionId, value: JSON.stringify(txnCommand) }]
  });

  res.json({ transactionId });
});

app.listen(PORT, () => console.log(`API running on port ${PORT}`));
