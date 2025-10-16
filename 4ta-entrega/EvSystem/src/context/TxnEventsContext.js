// context/TxnEventsContext.js
import React, { createContext, useState, useEffect, useRef } from "react";

export const TxnEventsContext = createContext([]);

export function TxnEventsProvider({ children, userId }) {
  const [events, setEvents] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const connect = () => {
      if (wsRef.current) wsRef.current.close();

      const ws = new WebSocket(`ws://192.168.1.101:8080?userId=${userId}`);
      wsRef.current = ws;

      ws.onopen = () => console.log("✅ WS conectado global");
      ws.onmessage = (msg) => {
        try {
          const event = JSON.parse(msg.data);
          if (isMounted) setEvents((prev) => [event, ...prev]);
        } catch (e) {
          console.error("❌ Error parseando mensaje WS:", e);
        }
      };

      ws.onerror = (err) => console.error("❌ WS error global:", err);
      ws.onclose = () => {
        console.log("🔌 WS cerrado, reconectando en 5s...");
        setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      isMounted = false;
      wsRef.current?.close();
    };
  }, [userId]);

  return (
    <TxnEventsContext.Provider value={events}>
      {children}
    </TxnEventsContext.Provider>
  );
}
