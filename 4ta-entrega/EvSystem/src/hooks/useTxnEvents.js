import { useState, useEffect, useRef } from "react";

export function useTxnEvents(userId) {
  const [events, setEvents] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const connect = () => {
      const ws = new WebSocket(`ws://192.168.1.101:8080?userId=${userId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("✅ WS conectado en frontend");
      };

      ws.onmessage = (msg) => {
        try {
          const event = JSON.parse(msg.data);
          console.log("📩 Evento recibido en frontend:", event);
          if (isMounted) setEvents((prev) => [event, ...prev]);
        } catch (e) {
          console.error("❌ Error parseando mensaje WS:", e);
        }
      };

      ws.onerror = (err) => {
        console.error("❌ WS frontend error:", err.message || err);
      };

      ws.onclose = () => {
        console.log("🔌 WS frontend cerrado, reintentando en 5s...");
        setTimeout(connect, 5000); // reconexión automática
      };
    };

    connect();

    return () => {
      isMounted = false;
      wsRef.current?.close();
    };
  }, [userId]);

  return events;
}
