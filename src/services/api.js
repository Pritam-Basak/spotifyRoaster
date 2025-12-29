// API Configuration
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Helper function for API calls with credentials
const apiFetch = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultOptions = {
        credentials: 'include', // Include cookies for authentication
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
            status: response.status,
            message: errorData.error || errorData.message || `API Error: ${response.status}`,
            data: errorData,
        };
    }

    return response.json();
};

// Authentication APIs
export const authApi = {
    login: () => {
        // Redirect to backend login
        window.location.href = `${API_BASE_URL}/user/login`;
    },

    logout: async () => {
        return apiFetch('/user/logout');
    },

    getCurrentUser: async () => {
        return apiFetch('/user/me');
    },
};

// Music Data APIs
export const musicApi = {
    getTopTracks: async () => {
        return apiFetch('/api/v1/top-tracks');
    },

    getTopArtists: async () => {
        return apiFetch('/api/v1/top-artists');
    },

    getRecentlyPlayed: async () => {
        return apiFetch('/api/v1/recent-tracks');
    },

    generateRoast: async () => {
        return apiFetch('/api/v1/generate-roast', {
            method: 'POST',
        });
    },

    getDiscoverUsers: async () => {
        return apiFetch('/api/v1/get-db-users', {
            method: 'POST',
        });
    },
};

export default apiFetch;
