import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/login', credentials),
};

export const profile = {
  create: async (data) => {
    const formData = new FormData();
    formData.append('organizationName', data.organizationName);
    formData.append('contactNumber', data.contactNumber);
    formData.append('aboutOrganization', data.aboutOrganization);
    formData.append('organizationType', data.organizationType);
    formData.append('location', data.location);
    formData.append('website', data.website);
    if (data.profileImage) {
      formData.append('profileImage', data.profileImage);
    }
    if (data.previouslySponsoredEvents) {
      formData.append('previously_sponsored_events', data.previouslySponsoredEvents);
    }

    // Log the FormData contents
    console.log('FormData contents:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    return api.post('/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  get: () => api.get('/profile'),
};

export const posts = {
  create: (formData) => {
    // Log the FormData contents
    console.log('Post FormData contents:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
    }

    return api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getAll: () => api.get('/posts'),
};

export default api; 