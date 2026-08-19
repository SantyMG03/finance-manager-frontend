const API_URL = 'http://localhost:8080/api/accounts';

const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No hay token, inicia sesión de nuevo');
  return token;
};

// Spring Boot devuelve el error en el body como { message: "..." }
const readBackendError = async (response, fallback) => {
  try {
    const body = await response.json();
    if (body && body.message) return body.message;
  } catch {
    // Body no es JSON
  }
  return `${fallback} (HTTP ${response.status})`;
};

export const getBankAccounts = async () => {
  const token = getToken();

  const response = await fetch(API_URL, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error(await readBackendError(response, 'Error al cargar las cuentas bancarias'));
  return response.json();
};

export const addBankAccount = async (accountData) => {
  const token = getToken();

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(accountData)
  });

  if (response.status === 409) {
    throw new Error('Ya existe una cuenta con ese nombre. Usa un nombre distinto.');
  }

  if (!response.ok) throw new Error(await readBackendError(response, 'Error al crear la cuenta'));
  return response.json();
};

export const deleteBankAccount = async (id) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) throw new Error(await readBackendError(response, 'Error al borrar la cuenta'));
};