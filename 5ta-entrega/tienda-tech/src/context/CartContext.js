import React, { createContext, useContext, useState } from "react";
import { API_URL } from "../api/auth"; // asegúrate de importarlo

const CartContext = createContext();

export const CartProvider = ({ children, jwt }) => {
  const [cartItems, setCartItems] = useState([]);

  // Agregar producto al carrito
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCartItems([]);

  const getTotal = () =>
    cartItems.reduce((total, item) => total + item.precio * item.quantity, 0);

  const createOrder = async (userId) => {
    if (!userId || cartItems.length === 0) return null;

    // Mapeamos los items del carrito usando "cantidad" como espera Strapi
    const items = cartItems.map((item) => ({
      product: item.id, // relación con el producto
      nombre: item.nombre, // redundante, opcional
      cantidad: item.quantity, // ⚠️ aquí usamos "cantidad"
      precio: item.precio,
    }));

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            user: userId,
            items,
            total: getTotal(),
            orderStatus: "pendiente",
          },
        }),
      });

      if (!res.ok) throw new Error("Error creando pedido");

      const data = await res.json();
      clearCart(); // vaciamos el carrito
      return data;
    } catch (err) {
      console.log("❌ Error creando pedido:", err);
      throw err;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        getTotal,
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
