const API_URL = import.meta.env.VITE_API_URL
//const API_URL = 'http://localhost:5256/api';

export const loginUsuario = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la autenticación');
    }

    return await response.json();
  } catch (error) {
    console.error("Error en authService:", error);
    throw error;
  }
};