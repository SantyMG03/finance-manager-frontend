import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPortfolioAnalysis } from '../services/portfolioService';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658'];

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

    // KPIs logic
    const totalValue = portfolio.reduce((sum, item) => sum + parseFloat(item.marketValue), 0);
    const totalProfitLoss = portfolio.reduce((sum, item) => sum + parseFloat(item.profitLossEuros), 0);
    const bestAsset = portfolio.length > 0 
        ? portfolio.reduce((max, item) => parseFloat(item.profitLossPercent) > parseFloat(max.profitLossPercent) ? item : max, portfolio[0])
        : null;

    // Function to format currency (e.g., $1,234.56)
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };


    // Charging and error states
    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando datos...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Resumen de tu Portafolio</h2>
            <div>
                {/* Goes to Transaction History */}
                <button onClick={() => navigate('/history')} style={{ padding: '8px 12px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
                    Ver Historial
                </button>

                {/* Goes to Add Transaction */}
                <button onClick={() => navigate('/add-transaction')} style={{ padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
                    + Añadir Transacción
                </button>

                {/* Goes to Diary */}
                <button onClick={() => navigate('/diary')} style={{ padding: '8px 12px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
                    Ir al Diario
                </button>

                {/* Logout */}
                <button onClick={handleLogout} style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Cerrar Sesión
                </button>
            </div>
        </div>
        
        {portfolio.length === 0 ? (
            <p style={{ marginTop: '20px' }}>No tienes activos en tu portafolio todavía.</p>
        ) : (
            <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
            
                    {/* Total Value */}
                    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', borderLeft: '5px solid #007bff' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#6c757d', fontSize: '14px', textTransform: 'uppercase' }}>Valor del Portafolio</h4>
                        <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{formatCurrency(totalValue)}</p>
                    </div>

                    {/* Total Profit/Loss */}
                    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', borderLeft: `5px solid ${totalProfitLoss >= 0 ? '#28a745' : '#dc3545'}` }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#6c757d', fontSize: '14px', textTransform: 'uppercase' }}>Beneficio Total</h4>
                        <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: totalProfitLoss >= 0 ? '#28a745' : '#dc3545' }}>
                            {totalProfitLoss >= 0 ? '+' : ''}{formatCurrency(totalProfitLoss)}
                        </p>
                    </div>

                    {/* Best asset*/}
                    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', borderLeft: '5px solid #ffc107' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#6c757d', fontSize: '14px', textTransform: 'uppercase' }}>Mejor Activo</h4>
                        {bestAsset ? (
                            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                            {bestAsset.ticker} <span style={{ fontSize: '16px', color: '#28a745' }}>(+{bestAsset.profitLossPercent}%)</span>
                            </p>
                        ) : (
                            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>N/A</p>
                        )}
                    </div>

                </div>
                <div style={{ width: '100%', height: 300, marginTop: '30px', marginBottom: '30px' }}>
                    <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Distribución de Activos</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                            data={portfolio}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="portfolioWeight" // Calculated int backend
                            nameKey="ticker"          // Using ticker as name for each slice
                            label={({ ticker, portfolioWeight }) => `${ticker}: ${portfolioWeight}%`}
                            >
                            {portfolio.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

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
            </>
        )}
        </div>
    );
}