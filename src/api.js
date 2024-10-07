// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Adjust this if deploying to production

export const fetchRecords = async () => {
    const response = await axios.get(`${API_URL}/records`);
    return response.data;
};

export const addRecord = async (record) => {
    const response = await axios.post(`${API_URL}/records`, record);
    return response.data;
};

export const fetchSavings = async () => {
    const response = await axios.get(`${API_URL}/savings`);
    return response.data;
};

export const addSavings = async (goal) => {
    const response = await axios.post(`${API_URL}/savings`, goal);
    return response.data;
};
