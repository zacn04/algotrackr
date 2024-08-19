import axios from 'axios';
import { API_BASE_URL } from './constants';
import { supabase } from './supabaseClient';

export const postSession = async (data) => {
  try {
    const mappedData = {
        problemname: data.problemName,
        topics: data.topics,
        attempts: data.attempts,
        timespent: data.timeSpent,
        trafficlight: data.trafficLight,
        userid: data.userId
    };

    const response = await axios.post(`${API_BASE_URL}/sessions`, mappedData, {
    });
    return response.data;
} catch (error) {
    console.error('Error posting data', error);
    alert("Error posting data");
}
};

export const getSessions = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  if (!userId) {
    console.error('No user is signed in.');
    return;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/sessions`, {
      params: {
        userId: userId  
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching sessions:', error);
  }
};




export const getTopNTopics = async (n, weakest) => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      console.error('No user is signed in.');
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/top-topics`, {
        params: {
          userId: userId,
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
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      console.error('No user is signed in.');
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/filter-by-topic`, {
        params: {
            userId: userId,
            topic: topic
        }
      });
      return response.json();
    } catch (error) {
      console.error('Error filtering by topic:', error);
      throw error;
    }
  };