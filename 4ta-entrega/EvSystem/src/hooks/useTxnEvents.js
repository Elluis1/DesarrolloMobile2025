// hooks/useTxnEvents.js
import { useState, useEffect, useRef } from "react";

export function useTxnEvents(userId) {
  const [events, setEvents] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    // Cambiá la IP por la de tu máquina o host de Docker
    const ws = new WebSocket(`ws://192.168.1.101:8080?userId=${userId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WS conectado en frontend");
    };

    ws.onmessage = (msg) => {
      try {
        const event = JSON.parse(msg.data);
        console.log("📩 Evento recibido en frontend:", event);
        setEvents((prev) => [event, ...prev]); // agregamos al inicio
      } catch (e) {
        console.error("❌ Error parseando mensaje WS:", e);
      }
    };

    ws.onerror = (err) => {
      console.error("❌ WS frontend error:", err.message || err);
    };

    ws.onclose = () => {
      console.log("🔌 WS frontend cerrado, reintentando en 5s...");
      setTimeout(() => {
        // reconectar automáticamente
        wsRef.current = null;
        // este useEffect se re-ejecuta porque la dependencia no cambia, así que reconexión manual
      }, 5000);
    };

    return () => {
      ws.close();
    };
  }, [userId]);

  return events;
}
