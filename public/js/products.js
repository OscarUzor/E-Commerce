const products = {
    async renderProducts() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = '<div class="row" id="products-container"></div>';
        
        try {
            const products = await api.getProducts();
            const container = document.getElementById('products-container');
            const template = document.getElementById('product-template');

            products.forEach(product => {
                const clone = template.content.cloneNode(true);
                
                clone.querySelector('.product-image').src = product.image;
                clone.querySelector('.product-name').textContent = product.name;
                clone.querySelector('.product-description').textContent = product.description;
                clone.querySelector('.product-price').textContent = product.price.toFixed(2);
                
                const addToCartBtn = clone.querySelector('.add-to-cart');
                addToCartBtn.addEventListener('click', () => {
                    cart.addItem(product);
                    alert('Product added to cart!');
                });

                container.appendChild(clone);
            });

            // Add admin controls if user is admin
            if (auth.isAdmin()) {
                this.addAdminControls();
            }
        } catch (error) {
            console.error('Failed to load products:', error);
            mainContent.innerHTML = '<p class="text-danger">Failed to load products. Please try again later.</p>';
        }
    },

    addAdminControls() {
        const mainContent = document.getElementById('main-content');
        const adminControls = document.createElement('div');
        adminControls.className = 'admin-controls mb-4';
        adminControls.innerHTML = `
            <h3>Admin Controls</h3>
            <button class="btn btn-primary" id="add-product-btn">Add New Product</button>
        `;
        mainContent.insertBefore(adminControls, mainContent.firstChild);

        document.getElementById('add-product-btn').addEventListener('click', () => {
            this.renderProductForm();
        });
    },

    renderProductForm(product = null) {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-body">
                            <h3>${product ? 'Edit' : 'Add'} Product</h3>
                            <form id="product-form">
                                <div class="mb-3">
                                    <input type="text" class="form-control" name="name" placeholder="Product Name" 
                                        value="${product?.name || ''}" required>
                                </div>
                                <div class="mb-3">
                                    <textarea class="form-control" name="description" placeholder="Product Description" 
                                        required>${product?.description || ''}</textarea>
                                </div>
                                <div class="mb-3">
                                    <input type="number" class="form-control" name="price" placeholder="Price" 
                                        value="${product?.price || ''}" step="0.01" required>
                                </div>
                                <div class="mb-3">
                                    <input type="text" class="form-control" name="image" placeholder="Image URL" 
                                        value="${product?.image || ''}" required>
                                </div>
                                <div class="mb-3">
                                    <input type="text" class="form-control" name="category" placeholder="Category" 
                                        value="${product?.category || ''}" required>
                                </div>
                                <div class="mb-3">
                                    <input type="number" class="form-control" name="stock" placeholder="Stock" 
                                        value="${product?.stock || ''}" required>
                                </div>
                                <button type="submit" class="btn btn-primary">${product ? 'Update' : 'Add'} Product</button>
                                <button type="button" class="btn btn-secondary" onclick="products.renderProducts()">Cancel</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('product-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const productData = {
                name: formData.get('name'),
                description: formData.get('description'),
                price: parseFloat(formData.get('price')),
                image: formData.get('image'),
                category: formData.get('category'),
                stock: parseInt(formData.get('stock'))
            };

            try {
                if (product) {
                    await api.request(`/products/${product._id}`, {
                        method: 'PATCH',
                        body: JSON.stringify(productData)
                    });
                } else {
                    await api.request('/products', {
                        method: 'POST',
                        body: JSON.stringify(productData)
                    });
                }
                
                alert(`Product ${product ? 'updated' : 'added'} successfully!`);
                this.renderProducts();
            } catch (error) {
                console.error('Failed to save product:', error);
                alert('Failed to save product. Please try again.');
            }
        });
    }
};
