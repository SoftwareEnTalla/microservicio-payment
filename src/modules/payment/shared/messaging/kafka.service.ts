import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { Kafka, Producer, Consumer } from "kafkajs";
import { KafkaMessageCallback } from "../../../interfaces/kafka";

@Injectable()
export class KafkaService implements OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      brokers: ["kafka:9092"],
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: "nestjs-group" });
  }

  async connect() {
    await Promise.all([this.producer.connect(), this.consumer.connect()]);
  }

  async sendMessage(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(message),
          headers: {
            "event-type": message.constructor?.name || "unknown",
            timestamp: new Date().toISOString(),
          },
        },
      ],
    });
  }

  async subscribe<T = any>(
    topic: string | string[],
    callback: KafkaMessageCallback<T>
  ): Promise<void> {
    await this.consumer.subscribe({
      topics: Array.isArray(topic) ? topic : [topic],
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          if (!message.value) return;

          const parsedMessage: T = JSON.parse(message.value.toString());
          await callback(parsedMessage, {
            topic,
            partition,
            offset: message.offset,
            headers: message.headers,
            timestamp: message.timestamp,
          });
        } catch (error) {
          console.error("Error processing Kafka message:", error);
          // Aquí puedes agregar lógica de reintento o dead-letter queue
        }
      },
    });
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  async disconnect() {
    await Promise.all([this.producer.disconnect(), this.consumer.disconnect()]);
  }
}
