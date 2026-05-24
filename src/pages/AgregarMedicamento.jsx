import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { medicamentoService } from '../services/medicamentoService';

const AgregarMedicamento = ({ onLogout }) => {
  const navigate = useNavigate();

  // Estado para las categorías
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({ 
    categoriaID: '', 
    nombreProducto: '', 
    codigoBarras: 'CODBAR-', // Prefijo inicial
    precioCosto: '', 
    codigoLote: 'LOTE-', // Prefijo inicial
    cantidadActual: 1, 
    fechaVencimiento: '' 
  });

  const blockSpecialChars = (e) => {
    if (['+', '-', 'e', 'E'].includes(e.key)) e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await medicamentoService.ingresarLote({
        nombre: formData.nombreProducto,
        codigoBarras: formData.codigoBarras,
        precioCosto: parseFloat(formData.precioCosto),
        categoriaID: parseInt(formData.categoriaID),
        codigoLote: formData.codigoLote,
        cantidadActual: parseInt(formData.cantidadActual),
        fechaVencimiento: formData.fechaVencimiento
      });
      
      alert(response.message);
      navigate('/menu');
    } catch (error) {
      alert("Error en el registro: " + error.message);
    }
  };

  const handleCodigoBarrasChange = (e) => {
    const value = e.target.value.toUpperCase();
    const prefix = 'CODBAR-';

    if (value.startsWith(prefix)) {
      const numericPart = value.slice(prefix.length);
      // Validamos que lo que sigue después del guion sean solo números
      if (/^\d*$/.test(numericPart)) {
        setFormData({ ...formData, codigoBarras: value });
      }
    }
  };

  // Manejador para Lote (Impedir borrar el prefijo)
  const handleLoteChange = (e) => {
    const value = e.target.value.toUpperCase();
    const prefix = 'LOTE-';

    // Solo permite el cambio si el valor sigue comenzando con el prefijo
    if (value.startsWith(prefix)) {
      setFormData({ ...formData, codigoLote: value });
    }
  };

useEffect(() => {
  const cargarDatosIniciales = async () => {
    try {
      // 1. Cargar Categorías
      const cats = await medicamentoService.obtenerCategorias();
      setCategorias(cats);

      // 2. Cargar Correlativos del Backend
      const correlativos = await medicamentoService.obtenerSiguienteCorrelativo();
      setFormData(prev => ({
        ...prev,
        codigoBarras: correlativos.siguienteCodigoBarras,
        codigoLote: correlativos.siguienteLote
      }));

    } catch (error) {
      console.error("Error al cargar datos iniciales:", error);
    } finally {
      setLoading(false);
    }
  };
  cargarDatosIniciales();
}, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onLogout={onLogout} />
      
      <div className="w-full flex justify-center items-start pt-10 pb-20 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-2xl border border-slate-200">
          <header className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-800">Registrar Nuevo Ingreso</h2>
            <p className="text-slate-500 font-medium">Complete los datos en el orden solicitado.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* SECCIÓN 1: DATOS DEL PRODUCTO */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase text-blue-600 tracking-wider">Identificación del Producto</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {/* 1. Categoría */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Categoría</label>
<select 
      required 
      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
      onChange={(e) => setFormData({...formData, categoriaID: e.target.value})}
      disabled={loading} // Bloquear si aún no cargan
    >
      <option value="">
        {loading ? "Cargando categorías..." : "Seleccione una categoría..."}
      </option>
      {categorias.map(cat => (
        <option key={cat.categoriaID} value={cat.categoriaID}>
          {cat.nombre}
        </option>
      ))}
    </select>
                </div>

                {/* 2. Nombre Comercial */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nombre Comercial</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                    onChange={(e) => setFormData({...formData, nombreProducto: e.target.value})} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 3. Código de Barras */}
<div>
  <label className="block text-sm font-bold text-slate-700 mb-2">Código de Barras</label>
  <input 
    type="text" 
    readOnly
    required 
    value={formData.codigoBarras}
    onChange={handleCodigoBarrasChange}
    placeholder='CODBAR-00000'
    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
  />
</div>
                {/* 4. Precio Costo */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Precio Costo (Q)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required 
                    onKeyDown={blockSpecialChars}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                    onChange={(e) => setFormData({...formData, precioCosto: e.target.value})} 
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* SECCIÓN 2: DETALLE DEL LOTE */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase text-orange-600 tracking-wider">Detalle del Lote</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">No. de Lote</label>
                  <input 
                    type="text" 
                    readOnly
                    required 
                    value={formData.codigoLote}
                    onChange={handleLoteChange}
                    placeholder='LOTE-00000'
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                        
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Cantidad</label>
                  <input 
                    type="number" 
                    required 
                    min="1" 
                    onKeyDown={blockSpecialChars}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                    onChange={(e) => setFormData({...formData, cantidadActual: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Vencimiento</label>
                  <input 
                    type="date" 
                    required 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                    onChange={(e) => setFormData({...formData, fechaVencimiento: e.target.value})} 
                  />
                </div>
              </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex gap-4 pt-6">
              <button 
                type="button" 
                onClick={() => navigate('/menu')} 
                className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                Guardar Ingreso
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgregarMedicamento;
