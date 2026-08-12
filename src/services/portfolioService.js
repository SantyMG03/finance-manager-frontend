const API_URL = 'http://localhost:8080/api/transactions';

export const getPortfolioAnalysis = async () => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('No authentication token found. Please log in first.');
    }

    const response = await fetch(`${API_URL}/portfolio`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
    });

    return response.json();
};