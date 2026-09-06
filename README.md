# 🛒 E-Commerce Platform

A full-stack **E-Commerce application** built with **React, Node.js, Express.js, MongoDB, and Mongoose**.

This project is designed as a complete e-commerce backend and frontend system with **Customer, Seller, Controller/Delivery, Product, Order, Cart, Wishlist, Review, and Location management**.

The backend contains the core business logic of the application, while the React frontend provides the user interfaces for interacting with the system.

---

## 🚀 Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* React Router
* HTML5
* CSS3

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Multer
* Cloudinary
* REST APIs

---

# ✨ Main Features

## 👤 Customer Management

* Customer registration
* Customer login
* Authentication
* Customer profile management
* Location management
* Product browsing
* Cart management
* Wishlist management
* Product reviews and ratings
* Order placement
* Order tracking

---

## 🏪 Seller Management

* Seller registration
* Seller login
* Seller authentication
* Seller profile management
* Product management
* Product stock management
* Product availability
* Category management
* Seller order management

---

# 🎛️ Controller & Delivery Management

The **Controller** system is one of the core parts of this project.

Controllers are responsible for managing the delivery and order-processing workflow.

### Controller Features

* Controller authentication
* Controller login/logout
* Supplier management
* Supplier status management
* Local order management
* Global order management
* Assign delivery jobs
* Receive products/orders
* Transfer orders between delivery points
* Delivery status management
* Collector status management
* New-order filtering
* District/location-based order management
* Supplier management
* Delivery updates

### Delivery Workflow

```text
Customer places order
        │
        ▼
      Order
        │
        ▼
 Controller receives order
        │
        ├───────────────┐
        │               │
        ▼               ▼
 Local Delivery    Global Delivery
        │               │
        ▼               ▼
   Supplier        Transfer Point
        │               │
        └───────┬───────┘
                ▼
          Delivery Process
                │
                ▼
          Customer receives
```

---

# 📦 Product Management

The application supports product-related operations including:

* Create products
* Product categories
* Product descriptions
* Product pricing
* Stock management
* Product availability
* Product ratings
* Product reviews
* Seller-product relationships
* Product image uploads

---

# 🛒 Cart & Wishlist

Customers can manage their shopping experience through:

* Add products to cart
* Remove products from cart
* Manage cart products
* Add products to wishlist
* Remove products from wishlist

---

# 📦 Order Management

The order system handles:

* Creating orders
* Product quantities
* Customer-order relationships
* Order timestamps
* Order status
* Delivery relationships
* Order assignment
* Local order processing
* Global order processing

---

# ⭐ Reviews & Ratings

Customers can submit reviews and ratings for products.

The system supports:

* Product reviews
* Product ratings
* Rating validation
* Customer-review relationships
* Product-review relationships

Ratings are validated between **1 and 5**.

---

# 📍 Location-Based Delivery

The project includes location-based order management.

Locations are used to help controllers identify and process orders based on their **district/local delivery area**.

This allows the delivery workflow to distinguish between:

* Local orders
* Global orders
* Orders requiring transfer
* Orders received at another delivery point

---

# 🗄️ Database Models

The backend uses **MongoDB with Mongoose**.

The application contains models for major parts of the system, including:

```text
Customer
Seller
Product
Category
Cart
Wishlist
Order
Review
Delivery
Supplier
Location
```

These models are connected using MongoDB references where appropriate.

---

# 🧠 Backend Architecture

The backend follows a structured architecture separating responsibilities between routes, middleware, controllers, and models.

```text
                    Client
                      │
                      ▼
                   Routes
                      │
                      ▼
                 Middleware
                      │
                      ▼
                 Controllers
                      │
                      ▼
                   Models
                      │
                      ▼
                  MongoDB
```

### Controllers

Controllers contain the application's main business logic.

Examples include:

```text
Customer Controllers
Seller Controllers
Product Controllers
Order Controllers
Cart Controllers
Wishlist Controllers
Review Controllers
Delivery Controllers
Supplier Controllers
Controller Authentication
```

### Middleware

Middleware is used for tasks such as:

* Authentication
* Authorization
* Request validation
* Order validation
* File upload handling
* Request processing

### Models

Mongoose models define the structure and relationships of the application's data.

---

# 📁 Project Structure

```text
E-commerce/
│
├── backend/
│   │
│   ├── controllers/
│   │
│   ├── middleware/
│   │
│   ├── models/
│   │
│   ├── routes/
│   │
│   ├── utils/
│   │
│   ├── uploads/
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   │
│   ├── components/
│   │   ├── Customer/
│   │   └── Seller/
│   │
│   ├── routes/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚙️ Getting Started

## Prerequisites

Install the following:

* Node.js
* npm
* MongoDB / MongoDB Atlas
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/ManiNayaka990/E-commerce.git
```

```bash
cd E-commerce
```

---

## 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Add the other environment variables required by your application.

Start the backend:

```bash
npm start
```

---

## 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

# 🔗 API Architecture

The frontend communicates with the backend through REST APIs.

```text
React
  │
  │ HTTP Requests
  ▼
Express Routes
  │
  ▼
Middleware
  │
  ▼
Controllers
  │
  ▼
Mongoose Models
  │
  ▼
MongoDB
```

---

# 🤝 Contributing

Contributions are welcome!

If you want to contribute:

### 1. Fork the repository

Create your own fork of the project.

### 2. Clone your fork

```bash
git clone https://github.com/YOUR_USERNAME/E-commerce.git
```

### 3. Create a branch

```bash
git checkout -b feature/your-feature
```

### 4. Make your changes

Implement your feature or fix an existing issue.

### 5. Commit your changes

```bash
git add .
git commit -m "Add your feature"
```

### 6. Push your branch

```bash
git push origin feature/your-feature
```

### 7. Open a Pull Request

Describe your changes clearly in the Pull Request.

---

# 🌱 Looking for Contributors

This project is open to developers interested in working on a real-world full-stack E-Commerce application.

Contributors can work on:

### Backend

* Controller logic
* REST APIs
* Authentication
* Middleware
* MongoDB queries
* Mongoose models
* Order management
* Delivery management
* Performance improvements

### Frontend

* React components
* Routing
* UI improvements
* API integration
* State management
* User experience

### Other

* Bug fixes
* Testing
* Documentation
* Code quality
* Security improvements

---

# 🐛 Reporting Issues

Found a bug or have an improvement?

Open an issue with:

* Problem description
* Steps to reproduce
* Expected behavior
* Actual behavior
* Error messages
* Screenshots when useful

---

# 📌 Project Status

🚧 **Under Active Development**

This project is continuously being developed and improved. Features and APIs may change as development continues.

---

# 👨‍💻 Author

**Mani K M**

GitHub: [@ManiNayaka990](https://github.com/ManiNayaka990/E-commerce)

---

# ⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub.

Contributions, issues, pull requests, and suggestions are welcome.

---

Built with ❤️ using **React, Node.js, Express.js, MongoDB and Mongoose**
