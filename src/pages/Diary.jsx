import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getDiaryEntries, addDiaryEntry } from '../services/diaryService';
import { getCategories } from '../services/categoryService';
import { getBankAccounts } from '../services/bankAccountService';

export default function Diary() {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [categories, setCategories] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    diaryType: 'OUTCOME', 
    concept: '',
    amount: '',
    info: '',             // Extra information field
    categoryId: '',
    bankAccountId: ''
  });

    useEffect(() => {
    const fetchData = async () => {
      try {
        const [entriesData, categoriesData, bankAccountsData] = await Promise.all([
          getDiaryEntries(),
          getCategories(),
          getBankAccounts() 
        ]);
        
        setEntries(entriesData);
        setCategories(categoriesData);
        setBankAccounts(bankAccountsData);

      } catch (error) {
        toast.error('Error cargando datos: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.categoryId || !formData.bankAccountId) {
      toast.error('Categoría y Cuenta Bancaria son obligatorios');
      return;
    }

    try {
      const payload = {
        date: formData.date,
        diaryType: formData.diaryType,
        concept: formData.concept,
        amount: parseFloat(formData.amount),
        info: formData.info,
        category: { id: parseInt(formData.categoryId) },
        bankAccount: { id: parseInt(formData.bankAccountId) }
      };

      const newEntry = await addDiaryEntry(payload);
      setEntries([newEntry, ...entries]); 
      toast.success('Registro añadido al diario');
      
      setFormData({ ...formData, concept: '', amount: '', info: '', categoryId: '' });
    } catch (error) {
      toast.error(error.message);
    }
  };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando diario...</div>;

    return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Diario de Finanzas</h2>
        <div>
          <button onClick={() => navigate('/categories')} style={{ padding: '8px 12px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
            Categorías
          </button>
          <button onClick={() => navigate('/accounts')} style={{ padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
            Cuentas
          </button>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Dashboard
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* FORMULARIO */}
        <div style={{ flex: '1 1 300px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', height: 'fit-content' }}>
          <h3>Nuevo Registro</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <label style={{ flex: 1 }}>
                <strong>Tipo:</strong>
                <select name="diaryType" value={formData.diaryType} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                  <option value="OUTCOME">Gasto</option>
                  <option value="INCOME">Ingreso</option>
                </select>
              </label>

              <label style={{ flex: 1 }}>
                <strong>Fecha:</strong>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
              </label>
            </div>

            <label>
              <strong>Concepto:</strong>
              <input type="text" name="concept" value={formData.concept} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </label>

            <label>
              <strong>Monto (€/$):</strong>
              <input type="number" name="amount" value={formData.amount} onChange={handleChange} required step="0.01" min="0" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </label>

            <label>
              <strong>Categoría:</strong>
              <select name="categoryId" value={formData.categoryId} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                <option value="">-- Seleccionar --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>

            <label>
              <strong>Cuenta Bancaria:</strong>
              <select name="bankAccountId" value={formData.bankAccountId} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                <option value="">-- Seleccionar --</option>
                {bankAccounts.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </label>

            <label>
              <strong>Info extra (Opcional):</strong>
              <input type="text" name="info" value={formData.info} onChange={handleChange} placeholder="Detalles adicionales..." style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </label>

            <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px', fontWeight: 'bold' }}>
              Guardar Registro
            </button>
          </form>
        </div>

        {/* LISTA DE MOVIMIENTOS */}
        <div style={{ flex: '2 1 500px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3>Últimos Movimientos</h3>
          {entries.length === 0 ? (
            <p style={{ marginTop: '15px', color: '#666' }}>No hay registros en el diario.</p>
          ) : (
            <table style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Fecha</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Concepto</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Categoría / Cuenta</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>Monto</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd', whiteSpace: 'nowrap' }}>{entry.date}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                      {entry.concept}
                      {entry.info && <div style={{ fontSize: '11px', color: '#888' }}>{entry.info}</div>}
                    </td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                      <div style={{ fontSize: '12px', color: '#555' }}>
                        <span style={{ backgroundColor: '#e9ecef', padding: '2px 6px', borderRadius: '4px', marginRight: '5px' }}>
                          {entry.category?.name || 'N/A'}
                        </span>
                        <br/>
                        <span style={{ color: '#0056b3', marginTop: '3px', display: 'inline-block' }}>
                          🏦 {entry.bankAccount?.name || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'right', fontWeight: 'bold', color: entry.diaryType === 'INCOME' ? '#28a745' : '#dc3545' }}>
                      {entry.diaryType === 'INCOME' ? '+' : '-'}${entry.amount}
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