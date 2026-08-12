// Change this if you decide to deploy
const API_URL = "http://localhost:8080/api/auth"

export const loginUser = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringnify({username, password}),
        });

        if (!response.ok) {
            throw new Error('Credentials not Valid');
        }

        const data = await response.json();
        return data; // Returns auth token
    } catch (error){
        throw error;
    }
}