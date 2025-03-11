const auth = {
    token: localStorage.getItem('token'),
    user: null,

    isLoggedIn() {
        return !!this.token;
    },

    isAdmin() {
        return this.user?.isAdmin;
    },

    async login(email, password) {
        try {
            const { token } = await api.login({ email, password });
            this.setToken(token);
            await this.loadUserProfile();
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    },

    async register(name, email, password) {
        try {
            const { token } = await api.register({ name, email, password });
            this.setToken(token);
            await this.loadUserProfile();
            return true;
        } catch (error) {
            console.error('Registration failed:', error);
            return false;
        }
    },

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        window.location.href = '/';
    },

    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    },

    async loadUserProfile() {
        try {
            this.user = await api.request('/users/profile');
            return this.user;
        } catch (error) {
            console.error('Failed to load user profile:', error);
            this.logout();
        }
    },

    renderAuthForms() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <ul class="nav nav-tabs" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active" data-bs-toggle="tab" href="#login-form">Login</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" data-bs-toggle="tab" href="#register-form">Register</a>
                                </li>
                            </ul>
                            <div class="tab-content mt-3">
                                <div class="tab-pane fade show active" id="login-form">
                                    <form id="login-form">
                                        <div class="mb-3">
                                            <input type="email" class="form-control" placeholder="Email" required>
                                        </div>
                                        <div class="mb-3">
                                            <input type="password" class="form-control" placeholder="Password" required>
                                        </div>
                                        <button type="submit" class="btn btn-primary">Login</button>
                                    </form>
                                </div>
                                <div class="tab-pane fade" id="register-form">
                                    <form id="register-form">
                                        <div class="mb-3">
                                            <input type="text" class="form-control" placeholder="Name" required>
                                        </div>
                                        <div class="mb-3">
                                            <input type="email" class="form-control" placeholder="Email" required>
                                        </div>
                                        <div class="mb-3">
                                            <input type="password" class="form-control" placeholder="Password" required>
                                        </div>
                                        <button type="submit" class="btn btn-primary">Register</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            const password = e.target.querySelector('input[type="password"]').value;
            
            if (await this.login(email, password)) {
                window.location.reload();
            } else {
                alert('Login failed. Please check your credentials.');
            }
        });

        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = e.target.querySelector('input[type="text"]').value;
            const email = e.target.querySelector('input[type="email"]').value;
            const password = e.target.querySelector('input[type="password"]').value;
            
            if (await this.register(name, email, password)) {
                window.location.reload();
            } else {
                alert('Registration failed. Please try again.');
            }
        });
    }
};
