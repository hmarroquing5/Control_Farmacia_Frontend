const API_URL = import.meta.env.VITE_API_URL
//const API_URL = "http://localhost:5256/api"; 

export const medicamentoService = {
    ingresarLote: async (loteData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/Medicamentos/nuevo-lote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(loteData)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al ingresar el lote');
            return data;
        } catch (error) {
            console.error("Error en medicamentoService:", error);
            throw error;
        }
    },

    obtenerCategorias: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/Categorias`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error('Error al cargar categorías');
            return await response.json();
        } catch (error) {
            console.error("Error en obtenerCategorias:", error);
            throw error;
        }
    },

obtenerSiguienteCorrelativo: async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/Medicamentos/siguiente-correlativo`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Error al obtener correlativos');
        return await response.json();
    } catch (error) {
        console.error("Error en obtenerSiguienteCorrelativo:", error);
        throw error;
    }
  },

buscarLotePorCodigo: async (codigo) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/Medicamentos/buscar-lote/${codigo}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Lote no encontrado');
    return await response.json();
},

actualizarLote: async (id, data) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/Medicamentos/actualizar-lote/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar');
    }
    return true;
},
obtenerProductosPorCategoria: async (categoriaId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/Medicamentos/categoria/${categoriaId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error al cargar productos');
        return await response.json();
    },

obtenerLoteSugeridoFEFO: async (nombre) => {
    const token = localStorage.getItem('token'); 

    const params = new URLSearchParams({ nombre });
    
    const response = await fetch(`${API_URL}/Medicamentos/sugerido-fefo-sp?${params.toString()}`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        if (response.status === 404) throw new Error("Sin stock");
        throw new Error("Error en el servidor");
    }

    return await response.json();
},

finalizarVenta: async (datos) => {
    if (!datos.detalles) {
        throw new Error("El detalle de la venta no está definido");
    }

    const payload = {
        UsuarioID: datos.usuarioID,
        JsonDetalles: JSON.stringify(datos.detalles)
    };

    const response = await fetch(`${API_URL}/Medicamentos/finalizar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error 400: Datos mal formados");
    }
    return await response.json();
}
};