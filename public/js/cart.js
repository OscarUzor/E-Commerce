const cart = {
    items: JSON.parse(localStorage.getItem('cart')) || [],

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.product._id === product._id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({ product, quantity });
        }
        
        this.saveCart();
        this.updateCartCount();
    },

    removeItem(productId) {
        this.items = this.items.filter(item => item.product._id !== productId);
        this.saveCart();
        this.updateCartCount();
    },

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.product._id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
            this.updateCartCount();
        }
    },

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
    },

    getTotalAmount() {
        return this.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    },

    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    },

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    },

    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = this.getItemCount();
        }
    },

    renderCart() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <h2>Shopping Cart</h2>
            ${this.items.length === 0 ? '<p>Your cart is empty</p>' : `
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.items.map(item => `
                                <tr data-product-id="${item.product._id}">
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <img src="${item.product.image}" alt="${item.product.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                                            <span>${item.product.name}</span>
                                        </div>
                                    </td>
                                    <td>$${item.product.price}</td>
                                    <td>
                                        <input type="number" class="form-control quantity-input" value="${item.quantity}" min="1" style="width: 80px;">
                                    </td>
                                    <td>$${(item.product.price * item.quantity).toFixed(2)}</td>
                                    <td>
                                        <button class="btn btn-danger btn-sm remove-item">Remove</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3" class="text-end"><strong>Total:</strong></td>
                                <td colspan="2"><strong>$${this.getTotalAmount().toFixed(2)}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div class="d-flex justify-content-end gap-2">
                    <button class="btn btn-secondary" id="clear-cart">Clear Cart</button>
                    <button class="btn btn-primary" id="checkout">Proceed to Checkout</button>
                </div>
            `}
        `;

        // Add event listeners
        if (this.items.length > 0) {
            // Quantity change
            document.querySelectorAll('.quantity-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const productId = e.target.closest('tr').dataset.productId;
                    this.updateQuantity(productId, parseInt(e.target.value));
                    this.renderCart();
                });
            });

            // Remove item
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.closest('tr').dataset.productId;
                    this.removeItem(productId);
                    this.renderCart();
                });
            });

            // Clear cart
            document.getElementById('clear-cart').addEventListener('click', () => {
                this.clearCart();
                this.renderCart();
            });

            // Checkout
            document.getElementById('checkout').addEventListener('click', () => {
                if (!auth.isLoggedIn()) {
                    alert('Please login to proceed with checkout');
                    auth.renderAuthForms();
                    return;
                }
                this.renderCheckoutForm();
            });
        }
    },

    renderCheckoutForm() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="row">
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-body">
                            <h3>Shipping Information</h3>
                            <form id="checkout-form">
                                <div class="mb-3">
                                    <input type="text" class="form-control" placeholder="Street Address" required>
                                </div>
                                <div class="row mb-3">
                                    <div class="col">
                                        <input type="text" class="form-control" placeholder="City" required>
                                    </div>
                                    <div class="col">
                                        <input type="text" class="form-control" placeholder="State" required>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col">
                                        <input type="text" class="form-control" placeholder="Zip Code" required>
                                    </div>
                                    <div class="col">
                                        <input type="text" class="form-control" placeholder="Country" required>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary">Place Order</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h3>Order Summary</h3>
                            <div class="mb-3">
                                ${this.items.map(item => `
                                    <div class="d-flex justify-content-between mb-2">
                                        <span>${item.product.name} x ${item.quantity}</span>
                                        <span>$${(item.product.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                `).join('')}
                                <hr>
                                <div class="d-flex justify-content-between">
                                    <strong>Total:</strong>
                                    <strong>$${this.getTotalAmount().toFixed(2)}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('checkout-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            try {
                const orderData = {
                    items: this.items.map(item => ({
                        product: item.product._id,
                        quantity: item.quantity,
                        price: item.product.price
                    })),
                    totalAmount: this.getTotalAmount(),
                    shippingAddress: {
                        street: formData.get('street'),
                        city: formData.get('city'),
                        state: formData.get('state'),
                        zipCode: formData.get('zipCode'),
                        country: formData.get('country')
                    }
                };

                await api.createOrder(orderData);
                this.clearCart();
                alert('Order placed successfully!');
                window.location.href = '/';
            } catch (error) {
                console.error('Failed to place order:', error);
                alert('Failed to place order. Please try again.');
            }
        });
    }
};
