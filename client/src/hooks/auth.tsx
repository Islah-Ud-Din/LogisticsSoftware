import axios from '@/lib/axios';

export const useAuth = () => {
    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post('/api/login', { email, password });
            localStorage.setItem('accessToken', response.data.accessToken);
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/logout');
            localStorage.removeItem('accessToken');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return { login, logout };
};
