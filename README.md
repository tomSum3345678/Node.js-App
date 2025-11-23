# Node.js-App

# Supermarket Web Application
A comprehensive supermarket product management system built with Node.js and MongoDB, featuring Google OAuth authentication, product management, shopping cart functionality, and invoice generation.

# Project Information
Group Number : 11
student name & SID :

# Technology Stack
Backend: Node.js, Express.js
Database: MongoDB Atlas
Authentication: Passport.js (Google OAuth 2.0 + Local Strategy)
Template Engine: EJS
Deployment Platform: Render
Version Control: Git

# Cloud-base server URL for testing :
Production Environment: https://node-js-app-1-9vi5.onrender.com

# Project File Structure
NODE_JS-APP/

├── 📁 .git/                     # Version control

├── 📁 controllers/              # Authentication Controller layer

│   └── 📄 authController.js     

├── 📁 models/                   # Data User models

│   └── 📄 User.js              

├── 📁 node_modules/            

├── 📁 supermarket_db/          # MongoDB database backup

│   ├── 📄 carts.bson     

│   ├── 📄 carts.metadata.json

│   ├── 📄 permissions.bson     

│   ├── 📄 permissions.metadata.json

│   ├── 📄 prelude.json

│   ├── 📄 products.bson        

│   ├── 📄 products.metadata.json

│   ├── 📄 users.bson           

│   └── 📄 users.metadata.json

├── 📁 views/                   # EJS template files

│   ├── 📄 content.ejs          # Main page

│   ├── 📄 create.ejs           # Create product page

│   ├── 📄 details.ejs          # Product details page

│   ├── 📄 edit.ejs             # Edit product page

│   ├── 📄 info.ejs             # System information page

│   ├── 📄 invoice.ejs          # Invoice page

│   ├── 📄 list.ejs             # Product list page

│   ├── 📄 login.ejs            # Login page

│   ├── 📄 navbar.ejs           # Navigation bar component

│   ├── 📄 shoppingcart.ejs     # Shopping cart page

│   └── 📄 signup.ejs           # Registration page

├── 📄 .env                     # Environment variables configuration

├── 📄 DB.js                    # Database connection configuration backup

├── 📄 package.json             # Project dependencies configuration

├── 📄 package-lock.json        # Lock dependency versions

├── 📄 README.md               # Project documentation

└── 📄 server.js               # Main server file

# Project file intro:
/models
     User.js: Mongoose schema for user authentication with support for:
     Google OAuth users (googleId, displayName, picture)
     Local users (username, password)
     User roles and permissions
     Profile information (firstName, lastName, email)

/controllers
     authController.js: Handles authentication logic including:
     Login page rendering
     Local login processing
     Google OAuth authentication
     User registration
     Logout functionality

/views (EJS Templates)
     content.ejs: Main product catalog page with search and filtering
     create.ejs: Product creation form
     details.ejs: Individual product details page
     edit.ejs: Product editing form
     list.ejs: Administrative product list view
     login.ejs: User login page
     signup.ejs: User registration page
     shoppingcart.ejs: Shopping cart display and management
     invoice.ejs: Order invoice generation
     navbar.ejs: Navigation bar component
     info.ejs: System information page

/supermarket_db (MongoDB Collections)
     products.bson/metadata.json: Product inventory data
     users.bson/metadata.json: User account information
     carts.bson/metadata.json: Shopping cart data
     permissions.bson/metadata.json: User permission settings

# System Usage Guide
User Features
1. Registration/Login
     Quick login with Google account
     Or create a local account by input email and password
2. Browse Products
     View all products on the main page
     Use search and filter functions
3. Shopping Cart Operations
     Add products to cart
     Adjust item quantities
     View cart total
4. Checkout
     Generate invoices
5. Admin Features Product Management
     Add products: Fill in product information, upload images
     Edit products: Modify product details
     Delete products: Remove unwanted products

# Production Environment Operation Guides
Login Options:
1. Google OAuth Login:
     Click "Sign in with Google" button
     Authorize the application
     Automatic account creation for new users
2. Local Account Login:
     Use registered email and password
     Access via /login route
3. Create a new user
     signup user First name , Last Name , Email , password , comfirm password
     Access via /signup route
# Test Accounts
End User: john@example.com / USER
Staff: alice@supermarket.com / STAFF
# CRUD web pages provided after Login
Product Management (Admin Functions):
Create Product:
     Navigate to /create
     Fill in product details (name, price, category, description , etc.)
     Upload product image
     Click "Create Product" button
Read Products:
     Customer View: Visit /content for product catalog
     Admin View: Visit /list for management interface
     Use search and filter options
Update Product:
     From product list, click "Edit" button
     Modify product information in /edit/:id
     Save changes
Delete Product:
     From product list, click "Delete" button
     Confirm deletion
# CRUD web pages provide the Logout button 
Shopping Cart Operations:
Add to Cart: Click "Add to Cart" on product pages
View Cart: Navigate to /shoppingcart
Update Quantities: Modify quantities in cart
Checkout: Generate invoice via "Checkout" button

#  Product APIs curl operation:
curl -X POST https://node-js-app-1-9vi5.onrender.com//api/products \
     -F "productId=PROD123" \
     -F "productName=Sample Widget" \
     -F "category=Electronics" \
     -F "price=49.99" \
     -F "stock=150" \
     -F "description=A description of the widget." \
     -F "productImage=@/path/to/your/image.jpg"

curl -X POST https://node-js-app-1-9vi5.onrender.com/api/products -F "productId=PROD009" -F "productName=Banana" -F "category=Food" -F "price=10" -F "stock=150" -F "description=A fresh yellow banana, great source of potassium." -F "productImage=@D:\study\Server-side & Cloud\image\banana.jpg"

curl -X PUT https://node-js-app-1-9vi5.onrender.com/api/products/update/PROD009 -F "price=12.50" -F "description=Freshly updated price for this tasty banana."

curl -X GET "https://node-js-app-1-9vi5.onrender.com/api/products?category=Food"

curl -X DELETE https://node-js-app-1-9vi5.onrender.com/api/products/delete/[product_id]

# Shopping Cart APIs curl operation:
# Add item to cart
POST /api/cart/add
curl -X POST "https://node-js-app-1-9vi5.onrender.com/api/cart/add" \
-H "Content-Type: application/json" \
-d '{"productId":"[product_id]","quantity":2}'

# Get cart contents
GET /api/cart
curl -X GET "https://node-js-app-1-9vi5.onrender.com/api/cart"

# Update cart item
PUT /api/cart/update
curl -X PUT "https://node-js-app-1-9vi5.onrender.com/api/cart/update" \
-H "Content-Type: application/json" \
-d '{"productId":"[product_id]","quantity":3}'

# Remove from cart
DELETE /api/cart/remove/:productId
curl -X DELETE "https://node-js-app-1-9vi5.onrender.com/api/cart/remove/[product_id]"

# Search and Filter APIs curl operation:
Search products
GET /api/products/search?q=searchterm&category=Electronics&minPrice=10&maxPrice=100
curl -X GET "https://your-server.com/api/products/search?q=laptop&category=Electronics"
Get categories
GET /api/categories
curl -X GET "https://your-server.com/api/categories"

# Installation and Setup
local MongoDB installation

# MongoDB Database Tools (Use mongodump.exe)
1. download MongoDB Database Tools via (https://www.mongodb.com/try/download/database-tools)
Database Backup
.\mongodump --uri="mongodb+srv://<username>:<passward>@cluster0.sdtvkpd.mongodb.net/supermarket_db" --out=D:\xampp\htdocs\Node.js-App
Database Restore
.\mongorestore --uri="mongodb+srv://<username>:<passward>@cluster0.sdtvkpd.mongodb.net/supermarket_db" --dir="D:\xampp\htdocs\Node.js-App\supermarket_db"

# localhost Operation Guides
1. Clone the Project
git clone https://github.com/tomSum3345678/Node.js-App.git
cd Node.js-App
2. Install Dependencies
npm install passport passport-local passport-google-oauth20 express express-session connect-mongo mongoose bcryptjs dotenv
3. Environment Variables Configuration
make sure production of GOOGLE_CALLBACK_URL in the .env was comment
4. start with localhost
please comment the code of Middleware Setup in server.js from line 218 - 228
Uncomment the code of Middleware Setup in server.js from line 203 - 216
5. npm start
The application will start at http://localhost:8099
