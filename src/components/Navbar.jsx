import { useNavigate } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  
  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="text-2xl">💊</span>
        <h1 className="text-xl font-bold text-slate-800">Control Farmacia</h1>
      </div>
      
      <div className="flex gap-4">
        <button 
          onClick={() => navigate('/menu')}
          className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-100 transition-all flex items-center gap-2 border border-blue-100"
        >
          <span>🏠</span> Menú Principal
        </button>

        <button 
          onClick={() => { onLogout(false); navigate('/'); }}
          className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition-all flex items-center gap-2 border border-red-100"
        >
          <span>🚪</span> Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;