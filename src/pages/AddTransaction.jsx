import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTransaction } from '../services/transactionService';

import toast from 'react-hot-toast';

export default function AddTransaction() {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        ticker: '',
        asset: '',
        type: 'BUY', // By default set to BUY
        shares: '',
        price: '',
        date: new Date().toISOString().split('T')[0], // Default to today's date
    });

    const handleChange = (e) => {
        // Update the field the user is currently editing
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const transactionPayload = {
                ...formData,
                shares: parseFloat(formData.shares),
                price: parseFloat(formData.price),
                totalPrice: parseFloat(formData.shares) * parseFloat(formData.price),
                commission: 0, // For now, we can set commission to 0.
                // TODO: Modify this to include commission in the form.
                isin: 'ND',
                broker: 'ND',
            };
            
            await addTransaction(transactionPayload);
            toast.success('Transaction added successfully!');

            navigate('/dashboard'); 
        } catch (err) {
            toast.error(err.message);
        }
    }

    return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2>Añadir Nueva Transacción</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        
        <label>
          <strong>Tipo de Operación:</strong>
          <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
            <option value="BUY">Compra (BUY)</option>
            <option value="SELL">Venta (SELL)</option>
          </select>
        </label>

        <label>
          <strong>Símbolo (Ticker):</strong>
          <input type="text" name="ticker" value={formData.ticker} onChange={handleChange} required placeholder="Ej: AAPL" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </label>

        <label>
          <strong>Nombre del Activo:</strong>
          <input type="text" name="asset" value={formData.asset} onChange={handleChange} required placeholder="Ej: Apple Inc." style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </label>

        <label>
          <strong>Número de Acciones:</strong>
          <input type="number" name="shares" value={formData.shares} onChange={handleChange} required step="0.0001" min="0" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </label>

        <label>
          <strong>Precio por Acción (€/$):</strong>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" min="0" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </label>

        <label>
          <strong>Fecha:</strong>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </label>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Guardar Transacción
          </button>
          <button type="button" onClick={() => navigate('/dashboard')} style={{ flex: 1, padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}