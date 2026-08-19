const API_URL = 'http://localhost:8080/api/diary';

export const getDiaryEntries = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) throw new Error('Error loading diary entries');
    return response.json();
}

export const addDiaryEntry = async (entry) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(entry),
    });

    if (!response.ok) throw new Error('Error adding diary entry');
    return response.json();
}