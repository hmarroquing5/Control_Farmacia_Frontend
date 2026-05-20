import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { medicamentoService } from '../services/medicamentoService'; // 1. IMPORTANTE: Importar el servicio

const FormularioActualizar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);
  const [loteEncontrado, setLoteEncontrado] = useState(null);
  
  // Estado para controlar los cambios en el formulario
  const [formData, setFormData] = useState({ cantidad: 0, vencimiento: '' });

  const buscarLote = async () => {
    if (!busqueda) return;
    setLoading(true);
    try {
      // 2. Llamada real al servicio de búsqueda
      const data = await medicamentoService.buscarLotePorCodigo(busqueda);
      setLoteEncontrado(data);
      
      // Sincronizamos el estado con los datos de la DB
      setFormData({ 
        cantidad: data.cantidadActual, 
        vencimiento: data.vence 
      });
    } catch (error) {
      alert("Lote no encontrado en la base de datos.");
      setLoteEncontrado(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
        // 3. Llamada real para actualizar
        const exito = await medicamentoService.actualizarLote(loteEncontrado.loteID, formData);
        if (exito) {
            alert(`Lote ${loteEncontrado.lote} actualizado con éxito.`);
            navigate('/menu');
        }
    } catch (error) {
        alert("Error al actualizar el lote.");
    }
  };

  const handleBusquedaChange = (e) => {
  const value = e.target.value.toUpperCase();
  const prefix = 'LOTE-';

  // Si el usuario intenta borrar el prefijo, lo restauramos
  if (!value.startsWith(prefix)) {
    setBusqueda(prefix);
    return;
  }

  // Extraemos la parte después de 'LOTE-'
  const numericPart = value.slice(prefix.length);

  // Solo permitimos actualizar si la parte nueva son números y no excede 5 dígitos
  if (/^\d*$/.test(numericPart) && numericPart.length <= 5) {
    setBusqueda(value);
  }
};
const blockInvalidChars = (e) => {
  // Bloqueamos '+', '-', 'e' y '.' si solo permites enteros
  if (['+', '-', 'e', 'E'].includes(e.key)) {
    e.preventDefault();
  }
};
const handleCantidadChange = (e) => {
  const value = e.target.value;
  
  // Si el valor es negativo, lo forzamos a 0 o lo dejamos vacío
  if (value < 0) {
    setFormData({ ...formData, cantidad: 0 });
  } else {
    setFormData({ ...formData, cantidad: value });
  }
};

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onLogout={onLogout} />
      
      <div className="w-full flex justify-center items-start pt-10 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-2xl border border-slate-200">
          <header className="mb-8">
            <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
              <span className="p-2 bg-slate-100 rounded-xl text-2xl">🔄</span>
              Gestión de Lotes
            </h2>
            <p className="text-slate-500 font-medium mt-2">Modifique existencias o fechas de vencimiento de lotes registrados.</p>
          </header>

          {/* Buscador */}
          <div className="flex flex-col md:flex-row gap-3 mb-10 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={busqueda}
                onChange={handleBusquedaChange} // Siempre en mayúsculas
                placeholder="Ingrese Número de Lote (Eje: LOTE-00001)" 
                className="w-full p-4 pl-12 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
              />
              <span className="absolute left-4 top-4 text-slate-400">🔍</span>
            </div>
            <button 
              onClick={buscarLote}
              disabled={loading}
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
            >
              {loading ? 'Buscando...' : 'Buscar Lote'}
            </button>
          </div>

          {loteEncontrado && (
            <form onSubmit={handleUpdate} className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">Medicamento (Lectura)</label>
                  <input 
                    type="text" 
                    value={loteEncontrado.nombre} 
                    className="w-full p-4 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-bold cursor-not-allowed" 
                    readOnly 
                  />
                </div>
<div>
  <label className="block text-xs font-black text-indigo-600 uppercase mb-2 ml-1">
    Ajustar Cantidad
  </label>
  <input 
    type="number" 
    required
    min="0" // Evita flechas hacia abajo menores a 0
    onKeyDown={blockInvalidChars} // Bloquea símbolos + y -
    value={formData.cantidad}
    onChange={handleCantidadChange} // Doble validación de estado
    className="w-full p-4 bg-white border border-slate-200 rounded-xl text-black font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
  />
  <p className="text-[10px] text-slate-400 mt-1 italic">
    Cantidad actual en sistema: {loteEncontrado.cantidadActual}
  </p>
</div>
              </div>

              <div>
                <label className="block text-xs font-black text-indigo-600 uppercase mb-2 ml-1">Fecha de Vencimiento</label>
                <input 
                  type="date" 
                  required
                  value={formData.vencimiento} // Vinculado al estado
                  onChange={(e) => setFormData({...formData, vencimiento: e.target.value})}
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl text-black font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setLoteEncontrado(null)}
                  className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Limpiar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  Confirmar Actualización
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormularioActualizar;