import axios from 'axios';
import { API_BASE_URL } from './constants';

export const postSession = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/sessions`, data);
        return response.data;
    } catch (error) {
        console.error('Error posting data', error)
    }
};

export const getSessions = async (page = 1, pageSize = 100) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/sessions`, {
            params: { page, pageSize }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting sessions', error) 
        throw error;
    }
};


export const clearDatabase = async () => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/clear-database`);
        return response.data;
    } catch (error) {
        console.error('Error posting data', error)
    }
};

export const getTopNTopics = async (n, weakest) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/top-topics`, {
        params: {
          n: n,
          weakest: weakest
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top N topics:', error);
      throw error;
    }
  };

  export const getFilteredByTopic = async (topic) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/filter-by-topic`, {
        params: {
            topic: topic
        }
      });
      return response.json();
    } catch (error) {
      console.error('Error filtering by topic:', error);
      throw error;
    }
  };