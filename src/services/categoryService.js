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