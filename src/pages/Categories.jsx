import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCategories, addCategory, deleteCategory } from '../services/categoryService';

export default function Category() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
        const data = await getCategories();
        setCategories(data);
        } catch (error) {
        toast.error(error.message);
        } finally {
        setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newCategory = await addCategory(formData);
            setCategories([...categories, newCategory]);
            toast.success('Categoría agregada con éxito');
            setFormData({ name: '', description: '' }); // Reset form
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleDelete = (id) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'center' }}>
        <span style={{ fontWeight: 'bold' }}>¿Borrar esta categoría?</span>
        <span style={{ fontSize: '14px', color: '#666' }}>Si hay registros usándola, podría fallar.</span>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '5px' }}>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteCategory(id);
                setCategories(categories.filter(c => c.id !== id));
                toast.success('Categoría eliminada');
              } catch (error) {
                toast.error(error.message);
              }
            }} 
            style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Sí, borrar
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)} 
            style={{ padding: '6px 12px', backgroundColor: '#e2e8f0', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cancelar
          </button>
        </div>
      </div>
    ), { duration: 5000, icon: '⚠️' });
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando categorías...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Gestión de Categorías</h2>
        <div>
          <button onClick={() => navigate('/diary')} style={{ padding: '8px 12px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
            Ir al Diario
          </button>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Ir al Dashboard
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* Formulario */}
        <div style={{ flex: '1 1 300px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', height: 'fit-content' }}>
          <h3>Nueva Categoría</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
            <label>
              <strong>Nombre:</strong>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ej: Supermercado" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </label>

            <label>
              <strong>Descripción:</strong>
              <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Ej: Gastos de alimentación" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </label>

            <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Guardar
            </button>
          </form>
        </div>

        {/* Lista de Categorías */}
        <div style={{ flex: '2 1 400px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3>Tus Categorías</h3>
          {categories.length === 0 ? (
            <p style={{ marginTop: '15px', color: '#666' }}>No has creado ninguna categoría.</p>
          ) : (
            <table style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Nombre</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Descripción</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>{c.name}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd', color: '#666' }}>{c.description}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                      <button onClick={() => handleDelete(c.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>
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