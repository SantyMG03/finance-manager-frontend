import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserTransactions, deleteTransaction } from '../services/transactionService';

import toast from 'react-hot-toast';

export default function TransactionHistory() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try{
            const data = await getUserTransactions();
            setTransactions(data);
        } catch (err) {
            toast.error('Error fetching transactions: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
    // Usamos toast() pasándole un componente visual (t representa este toast específico)
    toast((t) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>¿Seguro que quieres eliminarla?</span>
            <span style={{ fontSize: '14px', color: '#666' }}>Esta acción no se puede deshacer.</span>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '5px' }}>
            <button 
                onClick={async () => {
                toast.dismiss(t.id); // Hide the toast immediately
                
                try {
                    // Actually delete the transaction
                    await deleteTransaction(id);
                    setTransactions(transactions.filter(transaction => transaction.id !== id));
                    toast.success('Transacción eliminada con éxito');
                } catch (error) {
                    toast.error('Error al borrar: ' + error.message);
                }
                }} 
                style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
                Sí, borrar
            </button>
            
            <button 
                onClick={() => toast.dismiss(t.id)} // Simply dismiss the toast without doing anything
                style={{ padding: '6px 12px', backgroundColor: '#e2e8f0', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
                Cancelar
            </button>
            
            </div>
        </div>
    ), {
      duration: 6000, // Extra time to decide
      icon: '⚠️',
    });
  };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando historial...</div>;

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Historial de Operaciones</h2>
            <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Volver al Dashboard
            </button>
        </div>

        {transactions.length === 0 ? (
            <p style={{ marginTop: '20px' }}>No hay transacciones registradas.</p>
        ) : (
            <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
            <thead>
                <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Fecha</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Tipo</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Ticker</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Acciones</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Precio</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Total</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Acción</th>
                </tr>
            </thead>
            <tbody>
                {transactions.map((t) => (
                <tr key={t.id}>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{t.date}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd', color: t.type === 'BUY' ? 'green' : 'red' }}>
                    <strong>{t.type}</strong>
                    </td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{t.ticker}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{t.shares}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>${t.price}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>${t.totalPrice}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                    <button onClick={() => handleDelete(t.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>
                        Borrar
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
        </div>
    );
}