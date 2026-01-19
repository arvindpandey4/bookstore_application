import axios from './axios';

const register = async (userData) => {
    const response = await axios.post('/api/auth/register', userData);
    if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data)); // Store user info
    }
    return response.data;
};

const login = async (userData) => {
    const response = await axios.post('/api/auth/login', userData);
    if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

const authService = {
    register,
    login,
    logout
};

export default authService;
