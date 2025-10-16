import { Kafka } from "kafkajs";

const broker = process.env.KAFKA_BROKER || "192.168.1.101:9092"; // si no está la variable, usamos IP local
console.log("Conectando a Kafka en broker:", broker);

const kafka = new Kafka({
  clientId: "bank-txn",
  brokers: [broker],
});

export const producer = kafka.producer();

export function createConsumer(groupId) {
  return kafka.consumer({ groupId });
}