# Supermarket Web Application
A comprehensive supermarket product management system built with Node.js and MongoDB, featuring Google OAuth authentication, product management, shopping cart functionality, and invoice generation.

# Project Information
Group Number : 11  

Student name & SID :  

SUM Ka On(13896581)  

SHAM Ying Ho(13975793)  

Shih Wai Tai(13898119)  

Ming Chun Wing(14218294)  

CHAN Chi Ho(12980916)  
  
  
GitHub Repository of the project: https://github.com/tomSum3345678/COMP3810SEF-Group11


# Technology Stack
Backend: Node.js, Express.js  

Database: MongoDB Atlas  

Authentication: Passport.js (Google OAuth 2.0 + Local Strategy)  

Template Engine: EJS  

Deployment Platform: Render  

Version Control: Git

# Cloud-base server URL for testing :
Production Environment: https://comp3810sef-group11.onrender.com/

# Project File Structure
```
COMP3810SEF-Group11/
├── 📁 .git/                     # Version control
├── 📁 controllers/              # Authentication Controller layer
│   └── 📄 authController.js     
├── 📁 models/                   # Data User models
│   └── 📄 User.js              
├── 📁 node_modules/            # After running npm install
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
│   ├── 📄 info.ejs             # Error message display
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
```
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
5. Product Management
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
1. Email: john@example.com / Password: USER (USER Role)
2. Email: alice@supermarket.com / Password: STAFF (STAFF Role)

# CRUD web pages provided after Login (Product)
Create Product:
1. Navigate to /create
2. Fill in product details (name, price, category, description , etc.)
3. Upload product image
4. Click "Create Product" button
     
Read Products:
1. Customer View: Visit /content for product catalog
2. Admin View: Visit /list for management interface
3. Use search and filter options
     
Update Product:
1. From product list, click "Edit" button
2. Modify product information in /edit/:id
3. Save changes
     
Delete Product:
1. From product list, click "Delete" button
2. Confirm deletion
     
#  Product APIs curl operation:
```
curl -X POST https://comp3810sef-group11.onrender.com/api/products -F "productId=PROD009" -F "productName=Banana" -F "category=Food" -F "price=10" -F "stock=150" -F "description=A fresh yellow banana, great source of potassium." -F "productImage=@banana.jpg"
```

```
curl -X PUT https://comp3810sef-group11.onrender.com/api/products/update/PROD009 -F "productName=Banana" -F "category=Food" -F "price=12.50" -F "stock=150" -F "description=Freshly updated price for this tasty banana." -F "productImage=@banana.jpg"
```

```
curl -X GET "https://comp3810sef-group11.onrender.com/api/products?category=Food"
```

```
curl -X DELETE https://comp3810sef-group11.onrender.com/api/products/delete/PROD009
```



# CRUD web pages provide the Logout button (Cart)
1. Shopping Cart Operations:
2. Add to Cart: Click "Add to Cart" on product pages
3. View Cart: Navigate to /shoppingcart
4. Update Quantities: Modify quantities in cart
5. Checkout: Generate invoice via "Checkout" button

# Shopping Cart APIs CRUD curl operation:   
1. Get cart contents from public user:
```
curl -X GET "https://comp3810sef-group11.onrender.com/api/cart"
```
2. Add item to cart to public user:
```
curl -X POST "https://comp3810sef-group11.onrender.com/api/cart/add" \
  -H "Content-Type: application/json" \
  -d '{"productId":"PROD004","quantity":2}'
```
3. Update cart item:
```
   curl -X PUT "https://comp3810sef-group11.onrender.com/api/cart/update" \
  -H "Content-Type: application/json" \
  -d '{"productId":"PROD004","quantity":5}'
```
4. Delete cart item:
```
   curl -X DELETE "https://comp3810sef-group11.onrender.com/api/cart/remove/PROD005"
```
# CRUD web pages provide the Login button (Cart)
1. Get cart contents from user:  
```
 curl -X GET "https://comp3810sef-group11.onrender.com/api/cart?userId=USER001"
```
2. Add item to cart to user:
```
curl -X POST "https://comp3810sef-group11.onrender.com/api/cart/add" \
  -H "Content-Type: application/json" \
  -d '{"productId":"PROD004","quantity":2,"userId":"USER001"}'
```
3. Update cart:
```
   curl -X PUT "https://comp3810sef-group11.onrender.com/api/cart/update?userId=USER001" \
  -H "Content-Type: application/json" \
  -d '{"productId":"PROD004","quantity":5}'
```
4. Delete cart item:
```
   curl -X DELETE "https://comp3810sef-group11.onrender.com/api/cart/remove/PROD005?userId=USER001"
```
# Search and Filter APIs curl operation:
Search products
```
curl -X GET "https://comp3810sef-group11.onrender.com/api/products"
curl -X GET "https://comp3810sef-group11.onrender.com/api/products?category=Beverages"
curl -X GET "https://comp3810sef-group11.onrender.com/api/products?productName=Orange"
```

# Installation and Setup
local MongoDB installation

# MongoDB Database Tools (Use mongodump.exe)
1. download MongoDB Database Tools via (https://www.mongodb.com/try/download/database-tools)

Database Backup
```
.\mongodump --uri="mongodb+srv://<username>:<passward>@cluster0.sdtvkpd.mongodb.net/supermarket_db" --out=D:\xampp\htdocs\Node.js-App
```
Database Restore
```
.\mongorestore --uri="mongodb+srv://<username>:<passward>@cluster0.sdtvkpd.mongodb.net/supermarket_db" --dir="D:\xampp\htdocs\Node.js-App\supermarket_db"
```
# Localhost Operation Guides
1. Clone the Project
     ```
     git clone https://github.com/tomSum3345678/COMP3810SEF-Group11.git
     ```
2. cd COMP3810SEF-Group11

3. Install Dependencies
   >Do not just "npm install"
     ```
     npm install passport passport-local passport-google-oauth20 express express-session connect-mongo mongoose bcryptjs dotenv
     ```
4. Environment Variables Configuration  

>Make sure the production `GOOGLE_CALLBACK_URL` in the `COMP3810SEF-Group11-main/.env` is commented out like so:

```
#GOOGLE_CALLBACK_URL=https://comp3810sef-group11.onrender.com/auth/google/callback
```

>Make sure the `GoogleStrategy` in `COMP3810SEF-Group11-main/server.js` is set as `proxy: false` like so:  

```
...
clientID: process.env.GOOGLE_CLIENT_ID,
clientSecret: process.env.GOOGLE_CLIENT_SECRET,
callbackURL: process.env.GOOGLE_CALLBACK_URL,
// true for production Render
// proxy: true
// false for localhost testing
proxy: false
...
```

>Make sure to comment out the code for Middleware Render Production Setup in `server.js` from line 220 - 232 and uncomment the middleware localhost session like so:  

```
// localhost
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  }
}));
/* Render Production
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  }
}));
*/
```

5. Run "npm start"  

The application will start at http://localhost:8099
