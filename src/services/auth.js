import axiosInstance from './axiosInstance';

/**
 * Auth Service - Frontend Application Layer
 * 
 * Handles all user authentication communications with the backend.
 */

export const login = async (email, password) => {
    try {
        const response = await axiosInstance.post('/auth/login', { email, password });
        
        if (response.data.success) {
            // Store token and basic user info
            const { token, user } = response.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        }
        
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Login failed';
    }
};

export const register = async (userData) => {
    try {
        const response = await axiosInstance.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Registration failed';
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};
