# ShopSphere - Complete Full-Stack E-Commerce Platform

A professional, fully-functional e-commerce platform built with Node.js, Express, MySQL, and vanilla JavaScript.

## 🚀 Features

### Core Functionality
- ✅ User Authentication (Register, Login, JWT)
- ✅ Product Browsing with Filters & Search
- ✅ Shopping Cart Management
- ✅ Wishlist System
- ✅ Order Management & Tracking
- ✅ Product Reviews & Ratings
- ✅ Responsive Design (Mobile, Tablet, Desktop)

### Advanced Features
- ✅ Dark/Light Mode
- ✅ Infinite Scrolling
- ✅ Product Zoom Effect
- ✅ Toast Notifications
- ✅ Recently Viewed Products
- ✅ Search Suggestions
- ✅ Loading States

## 🛠️ Tech Stack

**Backend**
- Node.js v18+
- Express.js v4+
- Sequelize ORM
- MySQL 8+

**Frontend**
- HTML5
- CSS3 (Tailwind CSS)
- Vanilla JavaScript (ES6+)
- LocalStorage API

**Security**
- bcryptjs (Password Hashing)
- JWT (Authentication)
- Helmet (Security Headers)
- CORS (Cross-Origin)
- Input Validation

## 📁 Project Structure

```
ShopSphere/
├── config/
│   ├── database.js
│   ├── environment.js
│   └── constants.js
├── src/
│   ├── backend/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.js
│   └── frontend/
│       ├── pages/
│       ├── css/
│       ├── js/
│       └── images/
├── database/
│   └── schema.sql
├── tests/
│   └── seed.js
├── .env.example
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MySQL Server running locally
- npm or yarn

### Installation

1. **Clone and Navigate**
```bash
cd ShopSphere
```

2. **Install Dependencies**
```bash
npm install
```

3. **Create Database**
```bash
mysql -u root -p < database/schema.sql
```

4. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. **Seed Sample Data**
```bash
npm run seed
```

6. **Start Server**
```bash
npm start
```

Server will run at: `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - List products (paginated, filterable)
- `GET /api/products/:id` - Get product details
- `GET /api/products/search/:query` - Search products

### Cart
- `GET /api/cart` - Get user's cart (requires auth)
- `POST /api/cart` - Add item to cart (requires auth)
- `PUT /api/cart/:itemId` - Update cart item quantity (requires auth)
- `DELETE /api/cart/:itemId` - Remove cart item (requires auth)

### Wishlist
- `GET /api/wishlist` - Get user's wishlist (requires auth)
- `POST /api/wishlist` - Add to wishlist (requires auth)
- `DELETE /api/wishlist/:productId` - Remove from wishlist (requires auth)

### Orders
- `POST /api/orders` - Create order from cart (requires auth)
- `GET /api/orders` - Get user's orders (requires auth)
- `GET /api/orders/:id` - Get order details (requires auth)

## 🗄️ Database Schema

### Tables
- `users` - User accounts
- `products` - Product catalog
- `categories` - Product categories
- `cart_items` - Shopping cart items
- `wishlist` - Wishlist items
- `orders` - Order records
- `order_items` - Items in each order
- `reviews` - Product reviews

## 🔐 Security Features

- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ JWT token-based authentication
- ✅ CORS protection
- ✅ Security headers with Helmet
- ✅ SQL injection prevention via Sequelize ORM
- ✅ Input validation on all endpoints
- ✅ Protected routes with auth middleware

## 🎨 Frontend Pages

- `/` - Home page (Hero, trending, best sellers)
- `/products` - Product listing with filters
- `/products/:id` - Product detail page
- `/login` - User login
- `/register` - User registration
- `/cart` - Shopping cart
- `/checkout` - Order checkout
- `/orders` - Order history
- `/about` - About page
- `/contact` - Contact page
- `/faq` - FAQ page

## 💾 Sample Data

The seeder includes 120+ products across 6 categories:
- Electronics (30 products)
- Fashion (25 products)
- Home & Kitchen (20 products)
- Books (15 products)
- Sports & Outdoors (15 products)
- Beauty & Personal Care (15 products)

## 🧪 Testing the Application

1. **Register a new account**
   - Go to http://localhost:3000/register
   - Fill in email, password, and name
   - Click Register

2. **Browse products**
   - Navigate to /products
   - Use filters (category, price, rating)
   - Click on product to see details

3. **Add to cart**
   - Click "Add to Cart" on product detail page
   - View cart updates in navbar

4. **Checkout**
   - Go to /cart page
   - Click "Proceed to Checkout"
   - Fill in delivery details
   - Place order

5. **View orders**
   - Go to /orders page
   - See order history with status

## ⚙️ Configuration

### Environment Variables (.env)
```
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=shopsphere_db
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

## 🐛 Troubleshooting

### MySQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution**: Ensure MySQL server is running
```bash
# Windows
net start MySQL80

# Mac
brew services start mysql

# Linux
sudo systemctl start mysql
```

### Database Already Exists
```bash
# Drop and recreate
mysql -u root -p -e "DROP DATABASE shopsphere_db;"
mysql -u root -p < database/schema.sql
```

### Port Already in Use
```bash
# Change PORT in .env to 3001 or another available port
```

## 📈 Performance Features

- Connection pooling (max 10 connections)
- Database indexing on key fields
- Pagination on product listing (20 items/page)
- Lazy loading for images
- Caching with localStorage on frontend

## 🔄 API Response Format

All responses follow this format:

**Success (2xx)**
```json
{
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

**Error (4xx, 5xx)**
```json
{
  "error": "Error message"
}
```

## 🎯 Next Steps for Development

Phase 2 additions:
- Admin dashboard
- Real payment integration (Stripe/Razorpay)
- Email notifications
- Product recommendations
- Seller dashboard
- Return/refund system

## 📝 Development Notes

### Adding New Routes
1. Create controller in `src/backend/controllers/`
2. Create routes in `src/backend/routes/`
3. Import and register in `src/backend/routes/index.js`

### Adding New Models
1. Create model file in `src/backend/models/`
2. Define relationships in `src/backend/models/index.js`
3. Run `npm run seed` to sync database

### Adding Frontend Pages
1. Create HTML file in `src/frontend/pages/`
2. Add CSS in `src/frontend/css/`
3. Add JavaScript logic in `src/frontend/js/pages/`

## 📞 Support

For issues or questions, refer to the troubleshooting section or check the source code comments.

## 📄 License

ISC

## 👨‍💻 Author

ShopSphere Development Team

---

**Version**: 1.0.0  
**Last Updated**: May 2026  
**Status**: Production Ready for Local Development
