// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    // Update UI based on auth state
    const updateAuthUI = () => {
        const authContainer = document.getElementById('auth-container');
        if (auth.isLoggedIn()) {
            authContainer.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" href="#" id="orders-link">My Orders</a>
                </li>
                ${auth.isAdmin() ? `
                    <li class="nav-item">
                        <a class="nav-link" href="#" id="admin-link">Admin Panel</a>
                    </li>
                ` : ''}
                <li class="nav-item">
                    <a class="nav-link" href="#" id="logout-link">Logout</a>
                </li>
            `;
        } else {
            authContainer.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" href="#" id="login-link">Login</a>
                </li>
            `;
        }
    };

    // Initialize auth state
    if (auth.token) {
        await auth.loadUserProfile();
    }
    updateAuthUI();
    cart.updateCartCount();

    // Navigation event listeners
    document.addEventListener('click', async (e) => {
        if (e.target.matches('#home-link, #products-link')) {
            e.preventDefault();
            products.renderProducts();
        } else if (e.target.matches('#cart-link')) {
            e.preventDefault();
            cart.renderCart();
        } else if (e.target.matches('#login-link')) {
            e.preventDefault();
            auth.renderAuthForms();
        } else if (e.target.matches('#logout-link')) {
            e.preventDefault();
            auth.logout();
        } else if (e.target.matches('#orders-link')) {
            e.preventDefault();
            renderOrders();
        } else if (e.target.matches('#admin-link')) {
            e.preventDefault();
            renderAdminPanel();
        }
    });

    // Render orders page
    async function renderOrders() {
        const mainContent = document.getElementById('main-content');
        try {
            const orders = await api.getMyOrders();
            mainContent.innerHTML = `
                <h2>My Orders</h2>
                ${orders.length === 0 ? '<p>No orders found</p>' : `
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orders.map(order => `
                                    <tr>
                                        <td>${order._id}</td>
                                        <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>${order.items.map(item => 
                                            `${item.product.name} x ${item.quantity}`
                                        ).join(', ')}</td>
                                        <td>$${order.totalAmount.toFixed(2)}</td>
                                        <td>${order.status}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            `;
        } catch (error) {
            console.error('Failed to load orders:', error);
            mainContent.innerHTML = '<p class="text-danger">Failed to load orders. Please try again later.</p>';
        }
    }

    // Render admin panel
    async function renderAdminPanel() {
        if (!auth.isAdmin()) {
            window.location.href = '/';
            return;
        }

        const mainContent = document.getElementById('main-content');
        try {
            const orders = await api.getAllOrders();
            mainContent.innerHTML = `
                <h2>Admin Panel</h2>
                <div class="row">
                    <div class="col-md-12">
                        <h3>All Orders</h3>
                        ${orders.length === 0 ? '<p>No orders found</p>' : `
                            <div class="table-responsive">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>User</th>
                                            <th>Date</th>
                                            <th>Items</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${orders.map(order => `
                                            <tr>
                                                <td>${order._id}</td>
                                                <td>${order.user.name}</td>
                                                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                                                <td>${order.items.map(item => 
                                                    `${item.product.name} x ${item.quantity}`
                                                ).join(', ')}</td>
                                                <td>$${order.totalAmount.toFixed(2)}</td>
                                                <td>
                                                    <select class="form-select status-select" data-order-id="${order._id}">
                                                        ${['pending', 'processing', 'shipped', 'delivered']
                                                            .map(status => `
                                                                <option value="${status}" 
                                                                    ${status === order.status ? 'selected' : ''}>
                                                                    ${status}
                                                                </option>
                                                            `).join('')}
                                                    </select>
                                                </td>
                                                <td>
                                                    <button class="btn btn-primary btn-sm update-status" 
                                                        data-order-id="${order._id}">
                                                        Update
                                                    </button>
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        `}
                    </div>
                </div>
            `;

            // Add event listeners for status updates
            document.querySelectorAll('.update-status').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const orderId = e.target.dataset.orderId;
                    const status = document.querySelector(`.status-select[data-order-id="${orderId}"]`).value;
                    
                    try {
                        await api.updateOrderStatus(orderId, status);
                        alert('Order status updated successfully!');
                    } catch (error) {
                        console.error('Failed to update order status:', error);
                        alert('Failed to update order status. Please try again.');
                    }
                });
            });
        } catch (error) {
            console.error('Failed to load admin panel:', error);
            mainContent.innerHTML = '<p class="text-danger">Failed to load admin panel. Please try again later.</p>';
        }
    }

    // Initial render
    products.renderProducts();
});
