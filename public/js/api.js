const API_URL ='http://localhost:5000/api'; 

const api = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    },

    // Products
    getProducts() {
        return this.request('/products');
    },

    getProduct(id) {
        return this.request(`/products/${id}`);
    },

    // Auth
    login(credentials) {
        return this.request('/users/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    },

    register(userData) {
        return this.request('/users/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    // Orders
    createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    },

    getMyOrders() {
        return this.request('/orders/my-orders');
    },

    // Admin endpoints
    getAllOrders() {
        return this.request('/orders');
    },

    updateOrderStatus(orderId, status) {
        return this.request(`/orders/${orderId}`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        });
    }
};
