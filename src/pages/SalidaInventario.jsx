import  { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { medicamentoService } from '../services/medicamentoService';

const SalidaInventario = ({ onLogout }) => {
  // Estados
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loteSugerido, setLoteSugerido] = useState([]);
  const [carrito, setCarrito] = useState([]);

  const cancelarOperacion = () => {
    setLoteSugerido([]);
    setProductos([]);
    setCarrito([]);
const selectCat = document.getElementById('select-categoria');
    if (selectCat) {
        selectCat.value = ''; 
    }
  };

  useEffect(() => {
    const cargarCats = async () => {
      const data = await medicamentoService.obtenerCategorias();
      setCategorias(data);
    };
    cargarCats();
  }, []);

  const handleCategoriaChange = async (e) => {
    const id = e.target.value;
    setProductos([]);
    setLoteSugerido([]);
    if (id) {
      try {
        const data = await medicamentoService.obtenerProductosPorCategoria(id);
        setProductos(data);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleProductoChange = async (e) => {
    const nombre = e.target.value;
    if (!nombre) {
      setLoteSugerido([]);
      return;
    }
    try {
      const data = await medicamentoService.obtenerLoteSugeridoFEFO(nombre);
      setLoteSugerido(data);
    } catch (error) {
      console.warn("Aviso:", error.message);
      setLoteSugerido([]);
    }
  };

  const agregarAlCarrito = (lote, cantidad) => {
    if (!lote || lote.bloquearVenta === 1) return;
    const cant = parseInt(cantidad) || 1;

    if (cant > lote.disponible) {
      alert(`La cantidad solicitada supera el stock disponible.`);
      return;
    }

    const nuevoItem = {
      loteID: lote.loteID,
      codigoLote: lote.codigoLote,
      nombre: lote.productoNombre || "Producto",
      cantidadSolicitada: cant,
      precioUnitario: lote.precioVentaSugerido ?? 0,
      subtotal: (lote.precioVentaSugerido ?? 0) * cant,
      fechaVencimiento: lote.fechaVencimiento
    };

    setCarrito([...carrito, nuevoItem]);
    // Opcional: setLoteSugerido([]); // Si quieres que la tabla de arriba desaparezca al agregar
  };

const handleFinalizarDespacho = async () => {
    try {
        // 1. Validaciones iniciales
        if (carrito.length === 0) {
            alert("El carrito está vacío.");
            return;
        }

        const usuarioLogueado = localStorage.getItem('usuarioNombre');
        if (!usuarioLogueado) {
            alert("Sesión expirada. Por favor, inicia sesión de nuevo.");
            return;
        }

        // 2. Mapeo de datos asegurando tipos numéricos (Importante para SQL)
        const detallesMapeados = carrito.map(item => ({
            loteID: Number(item.loteID), // Forzamos a número para evitar el error de FK
            cantidad: Number(item.cantidadSolicitada),
            precioVentaUnitario: Number(item.precioUnitario)
        }));

        // 3. ESTA ES LA PARTE PARA VER EL JSON
        console.log("------------------------------------------");
        console.log("DATOS QUE VIAJAN AL SERVIDOR:");
        console.log("Usuario:", usuarioLogueado);
        console.log("JSON Detalles:", JSON.stringify(detallesMapeados, null, 2));
        console.log("------------------------------------------");

        // 4. Preparar el objeto final para el servicio
        const dataParaServicio = {
            usuarioID: usuarioLogueado,
            detalles: detallesMapeados
        };

        // 5. Llamada al servicio
        const response = await medicamentoService.finalizarVenta(dataParaServicio);

        if (response.success || response.numeroFactura) {
            alert(`✅ Despacho finalizado con éxito. Factura: ${response.numeroFactura}`);
            cancelarOperacion();
        }

    } catch (error) {
        console.error("Error completo:", error);
        
        // Si el error es el de "Unexpected token S", es un error de C#
        if (error.message.includes("Unexpected token")) {
            alert("Error crítico en el servidor. Revisa si el LoteID existe en la base de datos.");
        } else {
            alert("Error al finalizar: " + error.message);
        }
    }
};

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          {/* SECCIÓN 1: SELECCIÓN */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <span className="bg-blue-600 text-white p-1.5 rounded-lg text-sm">🛒</span>
              Selección de Despacho Inteligente
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase ml-1 mb-2 block">Categoría</label>
                <select id="select-categoria" onChange={handleCategoriaChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-700">
                  <option value="">Seleccione Categoría...</option>
                  {categorias.map(cat => <option key={cat.categoriaID} value={cat.categoriaID}>{cat.nombre}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase ml-1 mb-2 block">Producto</label>
                <select onChange={handleProductoChange} disabled={productos.length === 0} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-700 disabled:opacity-50">
                  <option value="">Seleccione Producto...</option>
                  {productos.map(prod => <option key={prod.productoID} value={prod.nombre}>{prod.nombre}</option>)}
                </select>
              </div>
            </div>

            {/* TABLA DE LOTES FEFO */}
            {loteSugerido.length > 0 && (
              <div className="mt-8 border-t border-slate-100 pt-6">
                <div className="overflow-hidden rounded-2xl border border-blue-100">
                  <table className="w-full text-left bg-blue-50/30">
                    <thead className="bg-blue-600 text-white text-[10px] uppercase font-black">
                      <tr>
                        <th className="px-4 py-3">Lote (FEFO)</th>
                        <th className="px-4 py-3 text-center">Vence</th>
                        <th className="px-4 py-3 text-center">Disponible</th>
                        <th className="px-4 py-3 text-center">Cant. Despacho</th>
                        <th className="px-4 py-3">Precio Unit.</th>
                        <th className="px-4 py-3 text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loteSugerido.map((lote) => {
                        const estaBloqueado = Number(lote.bloquearVenta) === 1;
                        return (
                          <tr key={lote.loteID} className={`text-slate-700 border-b border-slate-100 ${estaBloqueado ? 'bg-red-50/50' : ''}`}>
                            <td className="px-4 py-4 font-mono font-bold text-blue-700">{lote.codigoLote}</td>
                            <td className="px-4 py-4 text-center">
                              <span className={`font-bold ${estaBloqueado ? 'text-red-600' : 'text-slate-600'}`}>{lote.fechaVencimiento}</span>
                              {estaBloqueado && <div className="text-[9px] text-red-500 font-black uppercase leading-none">Vencido</div>}
                            </td>
                            <td className="px-4 py-4 text-center font-medium">{lote.disponible} uds.</td>
                            <td className="px-4 py-4">
                              <input 
                                type="number" min="1" max={lote.disponible} disabled={estaBloqueado} defaultValue="1"
                                onChange={(e) => { lote.tempCantidad = parseInt(e.target.value) || 1; }}
                                className="w-20 mx-auto block p-2 border-2 border-blue-200 rounded-lg text-center font-bold outline-none disabled:opacity-30"
                              />
                            </td>
                            <td className="px-4 py-4 font-black">Q{(lote.precioVentaSugerido ?? 0).toFixed(2)}</td>
                            <td className="px-4 py-4 text-center">
                              <button 
                                onClick={() => agregarAlCarrito(lote, lote.tempCantidad || 1)}
                                disabled={estaBloqueado}
                                className={`px-6 py-2 rounded-xl font-bold text-xs transition-all ${estaBloqueado ? 'bg-slate-200 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'}`}
                              >
                                {estaBloqueado ? 'Bloqueado' : 'Agregar'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* SECCIÓN 2: DESPACHO ACTUAL (ELIMINADA DUPLICACIÓN) */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-50">
               <h3 className="font-black text-slate-800 uppercase text-sm tracking-tighter text-blue-600">Productos en Despacho Actual</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black">
                  <tr>
                    <th className="px-6 py-4">Producto</th>
                    <th className="px-6 py-4 text-center">Lote</th>
                    <th className="px-6 py-4 text-center">Fecha Vencimiento</th>
                    <th className="px-6 py-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.map((item, index) => (
                    <tr key={index} className="text-slate-600 border-b border-slate-50 hover:bg-blue-50/30 transition-all">
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {item.nombre}
                        <div className="text-[10px] text-blue-500 font-normal">Cant: {item.cantidadSolicitada}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-slate-600">{item.codigoLote}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-xs">{item.fechaVencimiento}</td>
                      <td className="px-6 py-4 text-right font-black text-blue-600">Q{(item.subtotal ?? 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {carrito.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-400 font-medium">No hay productos en el despacho.</p>
                </div>
              )}

              {/* EL TOTAL VA AQUÍ: DENTRO DE LA CAJA DE LA TABLA PERO FUERA DEL TBODY */}
              {carrito.length > 0 && (
                <div className="bg-slate-50 p-6 flex justify-end items-center border-t border-slate-100">
                  <p className="font-black text-slate-500 uppercase text-xs tracking-widest mr-6">Monto Total:</p>
                  <p className="font-black text-slate-800 text-2xl tracking-tighter">
                    Q{carrito.reduce((acc, item) => acc + (item.subtotal ?? 0), 0).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: RESUMEN */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-800">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Resumen de Operación</h3>
            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
<span className="text-slate-400 font-bold">Items a despachar:</span>
  {/* Sumamos todas las cantidades de los productos en el carrito */}
  <span className="bg-blue-600 px-3 py-1 rounded-lg font-black text-sm">
    {carrito.reduce((total, item) => total + (item.cantidadSolicitada || 0), 0)}
  </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold">Total Venta:</span>
                <span className="text-3xl font-black text-blue-400 tracking-tighter">
                  Q{carrito.reduce((acc, item) => acc + (item.subtotal ?? 0), 0).toFixed(2)}
                </span>
              </div>
            </div>

<button 
  onClick={handleFinalizarDespacho} // <--- Agregar esta línea
  disabled={carrito.length === 0}
  className={`w-full py-5 rounded-2xl font-black text-lg transition-all transform active:scale-95 ${
    carrito.length === 0 ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'}`}>
  Finalizar Despacho
</button>           
            <button onClick={cancelarOperacion} className="w-full mt-4 py-4 rounded-2xl font-bold text-slate-400 hover:text-red-400 transition-all text-xs uppercase tracking-widest border border-transparent hover:border-red-400/20">
              ✕ Cancelar Operación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalidaInventario;