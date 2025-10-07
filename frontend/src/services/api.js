/**
 * API Service Layer
 * Handles all communication with Flask backend
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const getEngines = async () => {
  const response = await api.get('/engines');
  return response.data;
};

export const getEngine = async (engineId) => {
  const response = await api.get(`/engine/${engineId}`);
  return response.data;
};

export const getEngineHistory = async (engineId, hours = 168) => {
  const response = await api.get(`/engine/${engineId}/history?hours=${hours}`);
  return response.data;
};

export const predictFailure = async (engineId) => {
  const response = await api.get(`/predict/${engineId}`);
  return response.data;
};

export const getFleetStats = async () => {
  const response = await api.get('/fleet/stats');
  return response.data;
};

export const calculateROI = async (params) => {
  const response = await api.post('/roi/calculate', params);
  return response.data;
};

export default api;

