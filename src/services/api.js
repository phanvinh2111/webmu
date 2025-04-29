import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Thay bằng IP thực hoặc localhost:5000
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getUserInfo = (token) => {
    console.log('Gọi API getUserInfo, token:', token);
    return api.get('/auth/user/info', { headers: { Authorization: `Bearer ${token}` } }).catch((err) => {
        console.error('Lỗi getUserInfo:', err.message, err.response?.data);
        throw err;
    });
};

export const getUserCharacters = (token) => api.get('/auth/user/characters', { headers: { Authorization: `Bearer ${token}` } });

export const getCharacterInfo = (name, token) => api.get(`/character/${name}`, { headers: { Authorization: `Bearer ${token}` } });
export const resetMasterLevel = (name, token) => api.post(`/character/${name}/reset-master`, {}, { headers: { Authorization: `Bearer ${token}` } });
export const masterReset = (name, token) => api.post(`/character/${name}/master-reset`, {}, { headers: { Authorization: `Bearer ${token}` } });
export const changeGender = (name, gender, token) => api.post(`/character/${name}/change-gender`, { gender }, { headers: { Authorization: `Bearer ${token}` } });

export const getRankings = () => api.get('/character/ranking');

export const getNews = () => api.get('/news');

export const createNews = (data, token) => api.post('/news', data, { headers: { Authorization: `Bearer ${token}` } });
export const updateNews = (id, data, token) => api.put(`/news/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteNews = (id, token) => {
    console.log('Gọi API deleteNews, id:', id, 'token:', token);
    return api.delete(`/news/${id}`, { headers: { Authorization: `Bearer ${token}` } }).catch((err) => {
        console.error('Lỗi deleteNews:', err.message, err.response?.data);
        throw err;
    });
};



export const checkDonation = (data, token) => api.post('/donation/check', data, { headers: { Authorization: `Bearer ${token}` } });

export default api;