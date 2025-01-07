import axios from 'axios';
import { API_BASE_URL } from './constants';

export const postSession = async (data) => {
  try {
    const mappedData = {
        problemname: data.problemName,
        topics: data.topics,
        attempts: data.attempts,
        timespent: data.timeSpent,
        trafficlight: data.trafficLight,
    };

    const response = await axios.post(`${API_BASE_URL}/sessions`, mappedData, {
    });
    return response.data;
} catch (error) {
    console.error('Error posting data', error);
    alert("Error posting data!");
}
};

export const getSessions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sessions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sessions:', error);
  }
};




export const getTopNTopics = async (n, weakest) => {
    const response = await axios.get(`${API_BASE_URL}/top-topics`, {
      params: {
        n: n,
        weakest: weakest
      }
    });
    return response.data;
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

  export const getStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats`, {
      });
      return response.data;
    } catch (error) {
      console.error('Error retrieving stats:', error);
      throw error;
    }
  };