// Change this if you decide to deploy
const API_URL = "http://localhost:8080/api/auth"

export const loginUser = async (username, password) => {
  let response;

  try {
    response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Converts to JSON format that LoginRequest backend expects
      body: JSON.stringify({ username, password }), 
    });
  } catch (error) {
    // Net error: Down server, wrong URL, CORS blocking, etc.
    throw new Error('Cannot connect to the server. Please check your network or try again later. ' + error.message);
  }

  if (!response.ok) {
    // Intenta extraer el mensaje real del backend (Spring Boot suele usar { message: "..." })
    // Tries
    let message = `Error ${response.status}`;
    try {
      const errorBody = await response.json();
      message = errorBody.message || errorBody.error || errorBody.detail || message;
    } catch (e) {
    }
    throw new Error(message + 'Error procesing the error response from the server.');
  }

  const data = await response.json();
  return data; // Returns the token
};
