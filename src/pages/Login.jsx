// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';

import toast from 'react-hot-toast';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Function executed when the buttom is clicked
  const handleSubmit = async (e) => {
      e.preventDefault(); // Prevent the page from reloading
      setError(''); // Removes previous error

      try {
          const data = await loginUser(username, password);

          localStorage. setItem('token', data.token);
          toast.success('Login success!');

          navigate('/dashboard');
      } catch (err) {
          toast.error(err.message);
      }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
      <h2>Iniciar Sesión en Finances</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Nombre de usuario" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ padding: '10px' }}
        />
        
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '10px' }}
        />

        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          Entrar
        </button>
      </form>
      <p style={{ marginTop: '20px' }}>
        ¿No tienes cuenta? <Link to="/register" style={{ color: '#007bff' }}>Regístrate aquí</Link>
      </p>
    </div>
  );
}