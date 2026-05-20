import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Importamos el componente que extrajimos

const MenuPrincipal = ({ onLogout }) => {
  const navigate = useNavigate();

  const acciones = [
    { 
      titulo: 'Nuevo Ingreso', 
      subtitulo: 'Registro de lotes y productos',
      icon: '➕', 
      ruta: '/agregar', 
      color: 'hover:border-blue-400 bg-blue-50' 
    },
    { 
      titulo: 'Actualización de Inventario', 
      subtitulo: 'Rastreo por número de lote',
      icon: '🔍', 
      ruta: '/actualizar', 
      color: 'hover:border-slate-400 bg-slate-300 text-slate-700' 
    },
    { 
      titulo: 'Dashboard Semaforizado', 
      subtitulo: 'Control de vencimientos',
      icon: '📊', 
      ruta: '/dashboard', 
      color: 'hover:border-green-400 bg-green-50' 
    },
    { 
      titulo: 'Punto de Venta (FEFO)', 
      subtitulo: 'Ventas y despacho automático',
      icon: '📦', 
      ruta: '/salida', 
      color: 'hover:border-orange-400 bg-orange-50' 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar reutilizable con la lógica de cierre de sesión integrada */}
      <Navbar onLogout={onLogout} />

      <div className="max-w-6xl mx-auto px-8 pt-12">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-slate-800">
            Panel de Gestión Farmacéutica
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Sistema de trazabilidad bajo normativa sanitaria y lógica FEFO
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {acciones.map((acc, i) => (
            <button 
              key={i}
              onClick={() => navigate(acc.ruta)}
              className={`${acc.color} p-8 rounded-3xl border-2 border-transparent shadow-sm hover:shadow-2xl transition-all flex flex-col items-center text-center group`}
            >
              <div className="bg-white p-4 rounded-2xl shadow-inner mb-4 group-hover:rotate-12 transition-transform">
                <span className="text-4xl">{acc.icon}</span>
              </div>
              <span className="text-xl font-bold text-slate-800 mb-1">{acc.titulo}</span>
              <span className="text-xs text-slate-500 font-medium px-2 italic">{acc.subtitulo}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuPrincipal;