export const API_URL = 'http://localhost:3001'; // Make sure this matches your backend port

export const getToken = () => localStorage.getItem('access_token');
export const setToken = (token) => localStorage.setItem('access_token', token);
export const removeToken = () => localStorage.removeItem('access_token');
export const isAuthenticated = () => !!getToken();

export const api = async (endpoint, options = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (getToken()) {
        headers['Authorization'] = `Bearer ${getToken()}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        removeToken();
        window.location.hash = '/login';
        throw new Error('Unauthorized');
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Request failed');
    }

    if (response.status === 204) {
        return null; // No content
    }

    try {
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    } catch (e) {
        return null;
    }
};
