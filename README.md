# E-Commerce Platform

A modern e-commerce platform built with JavaScript, Express, and MongoDB. Features include product browsing, shopping cart management, user authentication, and an admin panel for managing products and orders.

## Features

- User Authentication (Register/Login)
- Product Browsing
- Shopping Cart Management
- Order Processing
- Admin Panel
  - Product Management
  - Order Management
  - Order Status Updates

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
- Copy `.env.example` to `.env`
- Update the variables as needed:
  - `PORT`: Server port (default: 5000)
  - `MONGODB_URI`: MongoDB connection string
  - `JWT_SECRET`: Secret key for JWT authentication

3. Start MongoDB service on your machine

4. Start the application:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Usage

1. Access the application at `http://localhost:5000`

2. Register a new account or login with existing credentials

3. Browse products and add them to cart

4. Proceed to checkout and place orders

5. View order history in the user dashboard

## Admin Access

To create an admin account:
1. Register a new account
2. Manually update the user's `isAdmin` field to `true` in the MongoDB database

Admin features:
- Add/Edit/Delete products
- View all orders
- Update order statuses

## API Endpoints

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get single product
- POST `/api/products` - Create product (Admin only)
- PATCH `/api/products/:id` - Update product (Admin only)
- DELETE `/api/products/:id` - Delete product (Admin only)

### Users
- POST `/api/users/register` - Register new user
- POST `/api/users/login` - Login user
- GET `/api/users/profile` - Get user profile

### Orders
- POST `/api/orders` - Create new order
- GET `/api/orders/my-orders` - Get user's orders
- GET `/api/orders` - Get all orders (Admin only)
- PATCH `/api/orders/:id` - Update order status (Admin only)

## Security Features

- Password hashing with bcrypt
- JWT authentication
- Protected admin routes
- Input validation
- CORS enabled
