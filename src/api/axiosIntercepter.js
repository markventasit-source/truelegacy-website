import axios from "axios";

const baseURL = import.meta.env.VITE_APP_API_URL || 'https://api.truelegacy.in';
const apiKey = import.meta.env.VITE_APP_API_KEY;

if (!apiKey) {
  console.error('API Key not found. Please set VITE_APP_API_KEY environment variable.');
}

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const successionData = JSON.parse(localStorage.getItem("successionData"));
    let token = successionData?.temporary_user?.token;
    
    // Fallback to sessionStorage if localStorage doesn't have token
    if (!token) {
      const sessionData = JSON.parse(sessionStorage.getItem("successionData"));
      token = sessionData?.temporary_user?.token;
    }
    
    // Debug logging
    console.log('🔑 Axios interceptor - Token check:', {
      url: config?.url,
      hasSuccessionData: !!successionData,
      hasTemporaryUser: !!successionData?.temporary_user,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
      hasApiKey: !!apiKey,
      apiKeyPreview: apiKey ? `${apiKey.substring(0, 10)}...` : 'none'
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (apiKey) {
      config.headers["x-api-key"] = apiKey;
    }
    config.headers["ngrok-skip-browser-warning"] = "true";

    // Add cache-busting for GET requests to prevent 304 responses
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now() // Add timestamp to prevent caching
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
