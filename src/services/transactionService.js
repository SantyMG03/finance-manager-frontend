const API_URL = 'http://localhost:8080/api/transactions';

export const addTransaction = async (transactionData) => {

    const token = localStorage.getItem('token');
  
    if (!token) throw new Error('No authentication token found. Please log in first.');

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },

        body: JSON.stringify(transactionData) 
    });

  if (!response.ok) {
    throw new Error('Error adding transaction. Please check your input and try again.');
  }

  return response.json();
};

export const getUserTransactions = async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found. Please log in first.');

    const response = await fetch(`${API_URL}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) throw new Error('Error fetching transactions.');
    return response.json();
}

export const deleteTransaction = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found. Please log in first.');

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) throw new Error('Error deleting transaction.');
}