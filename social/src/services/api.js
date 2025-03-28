import axios from 'axios';

// Verify these base URLs with your API documentation
const API_BASE_URL = 'http://20.244.56.144/test';
const AUTH_ENDPOINT = '/auth';
const USERS_ENDPOINT = '/users';
const POSTS_ENDPOINT = '/posts';

let authToken = null;

const handleApiError = (error, context) => {
  console.error(`Error in ${context}:`, {
    message: error.message,
    response: error.response?.data,
    status: error.response?.status,
    config: {
      url: error.config?.url,
      method: error.config?.method
    }
  });
  throw error;
};

export const authenticate = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${AUTH_ENDPOINT}`, 
      {
        companyName: "LBRCE",
        clientID: "a908b306-7822-472a-a1cb-50ee7b95fc63",
        clientSecret: "NgWAutbXvaFKWqJe",
        ownerName: "Gannnavarapu Gokul Madhav",
        ownerEmail: "gokulgannavarapu@gmail.com",
        rollNo: "23765A4204"
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    authToken = response.data.access_token;
    return authToken;
  } catch (error) {
    handleApiError(error, 'authentication');
    throw new Error('Authentication failed. Please verify the auth endpoint and credentials.');
  }
};

const getAuthHeader = () => {
  if (!authToken) {
    throw new Error('No authentication token available');
  }
  return {
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  };
};

export const fetchUsers = async () => {
  try {
    if (!authToken) await authenticate();
    const response = await axios.get(
      `${API_BASE_URL}${USERS_ENDPOINT}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetching users');
    return []; // Return empty array as fallback
  }
};

export const fetchAllPosts = async () => {
  try {
    if (!authToken) await authenticate();
    const response = await axios.get(
      `${API_BASE_URL}${POSTS_ENDPOINT}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetching posts');
    return []; // Return empty array as fallback
  }
};

export const fetchComments = async (postId) => {
  try {
    if (!authToken) await authenticate();
    const response = await axios.get(
      `${API_BASE_URL}/posts/${postId}/comments`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error, `fetching comments for post ${postId}`);
    return []; // Return empty array as fallback
  }
};