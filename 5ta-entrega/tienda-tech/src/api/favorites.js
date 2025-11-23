import { API_URL } from "./auth";

export const toggleFavorite = async (user, product) => {
  const res = await fetch(`${API_URL}/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, product }),
  });

  const json = await res.json();
  return json;  // contiene added o removed
};

export const getUserFavorites = async (userId) => {
  const res = await fetch(
    `${API_URL}/favorites?filters[user][id][$eq]=${userId}&populate=product`
  );

  const json = await res.json();

  // Si no hay data, devolvemos un array vacío
  if (!json.data || !Array.isArray(json.data)) return [];

  // Devolver SOLO los IDs de productos favoritos
  return json.data.map((fav) => fav.product?.id);
};