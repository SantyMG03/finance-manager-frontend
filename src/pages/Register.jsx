import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';

export default function Register() {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            await registerUser(formData.username, formData.email, formData.password);
            alert('User registered successfully. Now you can log in.');
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2>Crear Cuenta Nueva</h2>
      
      {error && <p style={{ color: 'red', margin: '10px 0' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <input 
          type="text" 
          name="username"
          placeholder="Nombre de usuario" 
          value={formData.username}
          onChange={handleChange}
          required
          style={{ padding: '10px' }}
        />
        
        <input 
          type="email" 
          name="email"
          placeholder="Correo electrónico" 
          value={formData.email}
          onChange={handleChange}
          required
          style={{ padding: '10px' }}
        />

        <input 
          type="password" 
          name="password"
          placeholder="Contraseña" 
          value={formData.password}
          onChange={handleChange}
          required
          style={{ padding: '10px' }}
        />

        <input 
          type="password" 
          name="confirmPassword"
          placeholder="Repetir Contraseña" 
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          style={{ padding: '10px' }}
        />

        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
          Registrarse
        </button>
      </form>

      <p style={{ marginTop: '20px' }}>
        ¿Ya tienes una cuenta? <Link to="/" style={{ color: '#007bff' }}>Inicia sesión aquí</Link>
      </p>
    </div>
  );
}