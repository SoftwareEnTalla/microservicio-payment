// src/logging/logger-client.service.ts
import { Injectable } from "@nestjs/common";
import { HttpLoggerApiRest, ILoggerClient } from "src/interfaces/log-context";
import { LoggerCallback } from "../types/logger.type";
import { HttpLoggerClient } from "./http-logger.client";
import * as dotenv from "dotenv";

@Injectable()
export class LoggerClient {
  private clients: Map<string, ILoggerClient> = new Map();

  constructor() {
    dotenv.config();
  }

  /**
   * Agrega un nuevo cliente de logging
   * @param name Nombre del cliente
   * @param client Objeto ILoggerClient que implementa la interfaz
   */
  registerClient(name: string, client?: ILoggerClient): LoggerClient {
    if (client == null)
      client = new HttpLoggerClient(
        process.env.LOG_API_BASE_URL || "https://logs.api"
      );
    if (!this.has(name)) this.clients.set(name, client);
    return this;
  }

  /**
   * Elimina un cliente de logging
   * @param name Nombre del cliente
   */
  unRegisterClient(name: string): LoggerClient {
    if (this.has(name)) this.clients.delete(name);
    return this;
  }

  /**
   * Determina si un cliente de logging existe
   * @param name Nombre del cliente
   */
  has(name): boolean {
    return this.clients.has(name);
  }

  /**
   * Obtiene un cliente de logging
   * @param name Nombre del cliente
   */
  get(name): ILoggerClient | undefined {
    return this.has(name) ? this.clients.get(name) : undefined;
  }

  /**
   * Envía datos de log usando el callback proporcionado
   */
  async send(
    logData: HttpLoggerApiRest,
    callback: LoggerCallback
  ): Promise<void> {
    for (const [name, client] of this.clients) {
      try {
        // Conecta el cliente
        const connected = await client.connect();

        // Ejecuta el callback con el cliente configurado
        const success = connected ? await callback(logData, client) : connected;

        if (!success) {
          console.error(
            connected
              ? `LoggerClient: Callback failed for client ${name}`
              : `LoggerClient: Callback failed for client connection failed`
          );
        }
      } catch (error) {
        console.error(`LoggerClient: Error with client ${name}`, error);
      } finally {
        try {
          await client.close();
        } catch (closeError) {
          console.error(
            `LoggerClient: Error closing client ${name}`,
            closeError
          );
        }
      }
    }
  }

  /**
   * Versión simplificada para uso directo
   */
  async sendToRegisteredClients(logData: HttpLoggerApiRest): Promise<void> {
    for (const [name, client] of this.clients) {
      try {
        const connected = await client.connect();
        const success = connected ? await client.send(logData) : connected;
        if (!success) {
          console.error(
            connected
              ? `LoggerClient: Send failed for client ${name}`
              : `LoggerClient: Callback failed for client connection failed`
          );
        }
      } catch (error) {
        console.error(`LoggerClient: Error with client ${name}`, error);
      } finally {
        try {
          await client.close();
        } catch (closeError) {
          console.error(
            `LoggerClient: Error closing client ${name}`,
            closeError
          );
        }
      }
    }
  }
}
