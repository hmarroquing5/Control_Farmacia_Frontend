import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUsuario } from '../services/authService';

const LoginPage = ({ onLogin }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await loginUsuario(user, pass);
      
      // Guardamos el token para las HUs de Auditoría
      localStorage.setItem('token', data.token); 
      if (data.usuario && data.usuario.username) {
          localStorage.setItem('usuarioNombre', data.usuario.username);
      }
      
      onLogin(true); // Cambia el estado en App.jsx
      navigate('/menu');
    } catch (err) {
      // Si el backend no devuelve JSON, capturamos el error aquí
      setError('Usuario o contraseña inválidos');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200">
        <h1 className="text-2xl font-black text-blue-700 mb-6 text-center">
          <span className="text-2xl">💊</span> Control Farmacia</h1>
       
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 font-bold border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="text" 
            placeholder="Usuario" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
            onChange={(e) => setUser(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
            onChange={(e) => setPass(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition active:scale-95">
            Ingresar al Sistema
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;