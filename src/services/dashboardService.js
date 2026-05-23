const API_URL = import.meta.env.VITE_API_URL

export const getDashboardData = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/Dashboard/resumen`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('No se pudo obtener la información del servidor');
    }

    return await response.json();
};