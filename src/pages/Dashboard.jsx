import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPortfolioAnalysis } from '../services/portfolioService';

export default function Dashboard() {
    const [portfolio, setPortfolio] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        // Protect the dashboard route by checking for a token in localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/'); // Redirect to login if no token is found
            return;
        }

        const fetchPortfolio = async () => {
            try {
                const data = await getPortfolioAnalysis();
                setPortfolio(data);
            } catch (err) {
                setError('Portfolio could not be loaded. ' + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPortfolio();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };


    // Charging and error states
    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando datos...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Resumen de tu Portafolio</h2>
            <button onClick={handleLogout} style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Cerrar Sesión
            </button>
        </div>
        
        {portfolio.length === 0 ? (
            <p style={{ marginTop: '20px' }}>No tienes activos en tu portafolio todavía.</p>
        ) : (
            <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
            <thead>
                <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Ticker</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Acciones</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Precio Actual</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Valor Mercado</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Beneficio/Pérdida</th>
                </tr>
            </thead>
            <tbody>
                {portfolio.map((item) => (
                <tr key={item.ticker}>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}><strong>{item.ticker}</strong></td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{item.totalShares}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>${item.currentPrice}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>${item.marketValue}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd', color: item.profitLossEuros >= 0 ? 'green' : 'red' }}>
                    ${item.profitLossEuros} ({item.profitLossPercent}%)
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
        </div>
    );
}