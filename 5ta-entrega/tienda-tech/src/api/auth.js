export const API_URL = "http://192.168.1.101:1337/api";

export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: email,
      password,
    }),
  });

  if (!res.ok) throw new Error("Error en login");

  return res.json();
}

export async function registerUser(username, email, password) {
  const res = await fetch(`${API_URL}/auth/local/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  if (!res.ok) throw new Error("Error en registro");

  return res.json();
}

export async function getMe(jwt) {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (!res.ok) throw new Error("No autorizado");

  return res.json();
}

