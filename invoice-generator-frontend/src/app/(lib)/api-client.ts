import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
    // Important for CORS with credentials
    withCredentials: true,
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Invoice API methods
export const invoiceAPI = {
    // List all invoices for current user
    list: () => apiClient.get('/api/invoices'),

    // Get single invoice by ID
    get: (id: string) => apiClient.get(`/api/invoices/${id}`),

    // Create new invoice
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create: (invoice: any) => apiClient.post('/api/invoices', invoice),

    // Update existing invoice
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update: (id: string, invoice: any) => apiClient.put(`/api/invoices/${id}`, invoice),

    // Delete invoice
    delete: (id: string) => apiClient.delete(`/api/invoices/${id}`),

    // Generate PDF for invoice
    generatePDF: (id: string) => apiClient.post(`/api/invoices/${id}/generate-pdf`),

    // Download PDF
    downloadPDF: (id: string) => {
        return apiClient.get(`/api/invoices/${id}/download-pdf`, {
            responseType: 'blob',
        });
    },

    // Preview PDF (returns blob for iframe)
    previewPDF: (id: string) => {
        return apiClient.get(`/api/invoices/${id}/preview-pdf`, {
            responseType: 'blob',
        });
    },
};

// Template API methods
export const templateAPI = {
    // List all templates for current user
    list: () => apiClient.get('/api/templates'),

    // Upload new template
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    upload: (template: any) => apiClient.post('/api/templates', template),
};

export default apiClient;
