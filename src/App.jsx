import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MenuPrincipal from './pages/MenuPrincipal';
import AgregarMedicamento from './pages/AgregarMedicamento';
import SalidaInventario from './pages/SalidaInventario';
import FormularioActualizar from './pages/FormularioActualizar';
import Dashboard from './pages/Dashboard'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  return (
    <Routes>
      <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
      
      {/* Rutas Protegidas */}
      <Route 
        path="/menu" 
        element={isAuthenticated ? <MenuPrincipal onLogout={handleLogout} /> : <Navigate to="/" />} 
      />
      <Route 
        path="/agregar" 
        element={isAuthenticated ? <AgregarMedicamento onLogout={handleLogout} /> : <Navigate to="/" />} 
      />
      <Route 
        path="/actualizar" 
        element={isAuthenticated ? <FormularioActualizar onLogout={handleLogout} /> : <Navigate to="/" />} 
      />
      <Route 
        path="/salida" 
        element={isAuthenticated ? <SalidaInventario onLogout={handleLogout} /> : <Navigate to="/" />} 
      />
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" />} 
      />
    </Routes>
  );
}

export default App;
