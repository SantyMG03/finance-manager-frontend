import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getDiaryEntries, addDiaryEntry } from '../services/diaryService';
import { getCategories } from '../services/categoryService';

export default function Diary() {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        concept: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'EXPENSE',
        categoryId: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [entriesData, categoriesData] = await Promise.all([
                    getDiaryEntries(),
                    getCategories()
                ]);
                setEntries(entriesData);
                setCategories(categoriesData);
            } catch (err) {
                toast.error('Error fetching data: ' + err.message);
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
        if (!formData.categoryId) {
            toast.error('Por favor, selecciona una categoría');
            return;
        }

        try{
            const payload = {
                ...formData,
                amount: parseFloat(formData.amount),
                categoryId: {id: parseInt(formData.categoryId)},
            };

            const newEntry = await addDiaryEntry(payload);
            setEntries([newEntry, ...entries]);
            toast.success('Registro agregado con éxito');

            // Reset everything except data and type
            setFormData({ ...formData, concept: '', amount: '' });
        } catch (err) {
            toast.error('Error adding diary entry: ' + err.message);
        }
    }

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando diario...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Diario de Finanzas</h2>
            <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Volver al Dashboard
            </button>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            
            {/* COLUMNA IZQUIERDA: FORMULARIO */}
            <div style={{ flex: '1 1 300px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', height: 'fit-content' }}>
            <h3>Nuevo Registro</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                
                <label>
                <strong>Tipo:</strong>
                <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                    <option value="EXPENSE">Gasto (EXPENSE)</option>
                    <option value="INCOME">Ingreso (INCOME)</option>
                </select>
                </label>

                <label>
                <strong>Concepto:</strong>
                <input type="text" name="concept" value={formData.concept} onChange={handleChange} required placeholder="Ej: Compra supermercado" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </label>

                <label>
                <strong>Monto (€/$):</strong>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} required step="0.01" min="0" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </label>

                <label>
                <strong>Categoría:</strong>
                <select name="categoryId" value={formData.categoryId} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                    <option value="">-- Selecciona una categoría --</option>
                    {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                </label>

                <label>
                <strong>Fecha:</strong>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </label>

                <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
                Guardar Registro
                </button>
            </form>
            </div>

            {/* COLUMNA DERECHA: LISTA DE MOVIMIENTOS */}
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
                    <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Categoría</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>Monto</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry) => (
                    <tr key={entry.id}>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{entry.date}</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{entry.concept}</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        <span style={{ fontSize: '12px', backgroundColor: '#e2e8f0', padding: '4px 8px', borderRadius: '12px' }}>
                            {entry.category?.name || 'Sin categoría'}
                        </span>
                        </td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'right', fontWeight: 'bold', color: entry.type === 'INCOME' ? '#28a745' : '#dc3545' }}>
                        {entry.type === 'INCOME' ? '+' : '-'}${entry.amount}
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