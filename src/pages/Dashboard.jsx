import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getDashboardData } from '../services/dashboardService';

const Dashboard = ({ onLogout }) => {
  const [data, setData] = useState({
    kpis: { stockTotal: 0, vencenPronto: 0, vencidos: 0, valorEnRiesgo: 0 },
    lotes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const result = await getDashboardData();
        setData(result);
      } catch (error) {
        console.error("Error al cargar el dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDatos();
  }, []);

// Lógica de semaforización refinada (Ajustada al 05/05/2026)
  const renderSemaforo = (dias) => {
    let config = { text: 'Seguro', style: 'text-green-600 bg-green-50 border-green-200' };
    
    if (dias < 0) {
      // Ya pasó la fecha de vencimiento
      config = { text: 'Vencido', style: 'text-red-600 bg-red-100 border-red-200' };
    } else if (dias === 0) {
      // Es el último día de vida útil del producto
      config = { text: 'Vence Hoy', style: 'text-red-700 bg-red-200 border-red-300 animate-pulse font-black' };
    } else if (dias <= 30) {
      // Rango crítico (Rojo/Naranja fuerte según US 02)
      config = { text: `Crítico (${dias}d)`, style: 'text-orange-600 bg-orange-100 border-orange-200' };
    } else if (dias <= 90) {
      // Advertencia (Amarillo según US 02)
      config = { text: `Advertencia (${dias}d)`, style: 'text-amber-600 bg-amber-50 border-amber-200' };
    }
    
    return (
      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${config.style}`}>
        {config.text}
      </span>
    );
  };

  if (loading) return <div className="p-10 text-center font-bold">Cargando indicadores de farmacia...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800">Panel Operativo FEFO</h1>
            <p className="text-slate-500 font-medium italic">Control sanitario y financiero (Quetzales)</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <KpiCard title="Stock Total" value={data.kpis.stockTotal} icon="📦" color="blue" />
          <KpiCard title="Próximos a Vencer" value={data.kpis.vencenPronto} icon="⚠️" color="amber" sub="< 90 días" />
          <KpiCard title="Caducados" value={data.kpis.vencidos} icon="🚫" color="red" sub="Retiro inmediato" />
          
          {/* Valor en Riesgo (US 05) */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100 bg-gradient-to-br from-white to-blue-50/30">
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2 bg-blue-100 rounded-lg text-xl">💰</span>
              <p className="text-blue-600 font-bold text-xs uppercase tracking-wider">Valor en Riesgo</p>
            </div>
            <h2 className="text-3xl font-black text-blue-800">
              Q{data.kpis.valorEnRiesgo.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
            </h2>
            <p className="text-[10px] text-blue-400 mt-1 font-medium italic">Pérdida potencial por vencimiento</p>
          </div>
        </div>

{/* TABLA DE LOTES ACTUALIZADA */}
{/* TABLA DE ALERTAS DE LOTES (US 02 y US 05) */}
<div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
  {/* Encabezado Principal de la Tabla */}
  <div className="p-6 border-b border-slate-50 flex justify-between items-center">
    <h3 className="font-extrabold text-slate-800 text-lg">Alertas de Trazabilidad por Lote</h3>
    <span className="text-xs font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase">
      Control de Inventario
    </span>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead className="bg-slate-50/50 text-slate-400 text-[11px] uppercase font-black tracking-widest">
        <tr>
          <th className="px-6 py-4">Producto</th>
          <th className="px-6 py-4">Código Lote</th>
          <th className="px-6 py-4 text-center">Existencia</th>
          <th className="px-6 py-4">Costo Unit.</th>
          <th className="px-6 py-4">Subtotal Riesgo</th>
          <th className="px-6 py-4">Vencimiento</th>
          <th className="px-6 py-4">Estado</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {data.lotes.map((lote) => (
          <tr key={lote.loteID} className="hover:bg-slate-50/80 transition-colors">
            <td className="px-6 py-4 font-bold text-slate-700">{lote.producto}</td>
            <td className="px-6 py-4 font-mono text-xs text-slate-500">{lote.codigoLote}</td>
            <td className="px-6 py-4 text-center text-slate-600 font-bold">{lote.cantidadActual} uds.</td>
            <td className="px-6 py-4 text-slate-600">Q{lote.precioCosto.toFixed(2)}</td>
            
            {/* Resaltado del Valor en Riesgo por Lote */}
            <td className="px-6 py-4 font-black text-blue-600">
              Q{lote.costoTotalLote.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
            </td>
            
            <td className="px-6 py-4 text-slate-600">
              {new Date(lote.fechaVencimiento).toLocaleDateString('es-GT')}
            </td>
            <td className="px-6 py-4">
              {renderSemaforo(lote.diasParaVencer)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, icon, color, sub }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
    <div className="flex items-center gap-3 mb-2">
      <span className={`p-2 bg-${color}-50 rounded-lg text-xl`}>{icon}</span>
      <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">{title}</p>
    </div>
    <h2 className={`text-4xl font-black text-${color}-600`}>{value}</h2>
    {sub && <p className="text-[10px] text-slate-400 mt-1 font-medium">{sub}</p>}
  </div>
);

export default Dashboard;