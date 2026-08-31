# E-Commerce Web Backend

A backend API for an e-commerce platform built with **Node.js, Express.js, MongoDB, and Mongoose**.

The project handles customers, sellers, products, orders, deliveries, reviews, authentication, and location-based delivery management.

## Features

### Customer

* Customer registration and login
* JWT authentication using HTTP-only cookies
* Customer profile management
* Add/remove products from cart
* Add/remove products from wishlist
* View cart and wishlist
* Place orders
* Select payment method
* Cancel orders
* Add product reviews and ratings
* Delete reviews
* Delete customer account

### Seller

* Seller registration and login
* Seller profile management
* Profile photo and QR code upload
* Add products
* Update products
* Delete products
* View seller products
* Product category management

### Controller / Delivery Management

* Controller authentication
* Location-based order management
* Add and manage delivery suppliers
* Assign collectors and distributors
* Manage delivery status
* Transfer deliveries between districts
* Confirm received deliveries
* Track supplier availability and delivery count

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Multer
* Cookie Parser
* dotenv

## Project Structure

```text
E-commerce-web/
│
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── utils/
├── upload/
├── .env
├── .gitignore
├── package.json
└── server.js
```

## Installation

Clone the repository:

```bash
git clone https://github.com/ManiNayaka990/E-commerce
```

Move into the project:

```bash
cd E-commerce-web
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRETE_KEY=your_jwt_secret
```

Start the server:

```bash
npm start
```

For development with nodemon:

```bash
npm run nodemon
```

## Environment Variables

Do not commit your `.env` file to GitHub.

Example:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRETE_KEY=your_secret_key
```

## Authentication

The application uses **JWT tokens stored in HTTP-only cookies**.

Protected routes require the user to be authenticated.

## API

The project provides separate routes for different users and responsibilities:

```text
/customer
/seller
/controller
```

API endpoints are still under development and may change as the project evolves.

## Contributing

Contributions are welcome.

Before contributing:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Test your changes.
5. Commit your changes.
6. Push your branch.
7. Create a Pull Request.

Example:

```bash
git checkout -b feature/your-feature
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature
```

Please read `CONTRIBUTING.md` before submitting a Pull Request.

## Current Status

This project is currently under development.

The backend contains the main e-commerce functionality, but some parts may require bug fixes, refactoring, validation improvements, testing, and additional features.

## Contributors

Contributions from developers are welcome. If you find a bug or have an improvement, feel free to open an issue or submit a Pull Request.

## License

This project is licensed under the ISC License.

```
```
