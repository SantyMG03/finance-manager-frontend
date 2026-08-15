const API_URL = 'http://localhost:8080/api/categories';

export const getCategories = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) throw new Error('Error loading categories');
    return response.json();
}

export const addCategory = async (categoryData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(categoryData)
  });
  
  if (!response.ok) throw new Error('Error al crear la categoría');
  return response.json();
};

export const deleteCategory = async (id) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) throw new Error('Error al borrar la categoría (quizás esté en uso)');
};