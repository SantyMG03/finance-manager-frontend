// src/pages/BankAccounts.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getBankAccounts, addBankAccount, deleteBankAccount } from '../services/bankAccountService';

export default function BankAccounts() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    initialBalance: ''
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await getBankAccounts();
        setAccounts(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        initialBalance: parseFloat(formData.initialBalance)
      };
      
      const newAccount = await addBankAccount(payload);
      setAccounts([...accounts, newAccount]);
      toast.success('Cuenta creada correctamente');
      setFormData({ name: '', initialBalance: '' });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'center' }}>
        <span style={{ fontWeight: 'bold' }}>¿Borrar esta cuenta?</span>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '5px' }}>
          <button onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteBankAccount(id);
                setAccounts(accounts.filter(a => a.id !== id));
                toast.success('Cuenta eliminada');
              } catch (error) {
                toast.error(error.message);
              }
            }} style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Borrar
          </button>
          <button onClick={() => toast.dismiss(t.id)} style={{ padding: '6px 12px', backgroundColor: '#e2e8f0', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Cancelar
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando cuentas...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Gestión de Cuentas Bancarias</h2>
        <div>
          <button onClick={() => navigate('/diary')} style={{ padding: '8px 12px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
            Ir al Diario
          </button>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Dashboard
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* FORMULARIO */}
        <div style={{ flex: '1 1 300px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', height: 'fit-content' }}>
          <h3>Nueva Cuenta</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
            <label>
              <strong>Nombre de la cuenta:</strong>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ej: Cuenta Nómina" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </label>
            <label>
              <strong>Balance Inicial (€/$):</strong>
              <input type="number" name="initialBalance" value={formData.initialBalance} onChange={handleChange} required step="0.01" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </label>
            <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Guardar
            </button>
          </form>
        </div>

        {/* LISTA */}
        <div style={{ flex: '2 1 400px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3>Tus Cuentas</h3>
          {accounts.length === 0 ? (
            <p style={{ marginTop: '15px', color: '#666' }}>No has añadido ninguna cuenta bancaria.</p>
          ) : (
            <table style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Nombre</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Balance Inicial</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((a) => (
                  <tr key={a.id}>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>{a.name}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>${a.initialBalance}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                      <button onClick={() => handleDelete(a.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}