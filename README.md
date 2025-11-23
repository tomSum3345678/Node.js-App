# Node.js-App

# Supermarket Web Application
A comprehensive supermarket product management system built with Node.js and MongoDB, featuring Google OAuth authentication, product management, shopping cart functionality, and invoice generation.

# Project Information
Backend: Node.js, Express.js
Database: MongoDB Atlas
Authentication: Passport.js (Google OAuth 2.0 + Local Strategy)
Template Engine: EJS
Deployment Platform: Render
Version Control: Git

# Cloud URL
Production Environment: https://node-js-app-1-9vi5.onrender.com

# Test Accounts
Email: john@example.com / Password : USER (customer user role)
Email: alice@supermarket.com / Password : STAFF (staff user role)

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


# MongoDB Database Tools (Use mongodump.exe)
Database Backup
.\mongodump --uri="mongodb+srv://<username>:<passward>@cluster0.sdtvkpd.mongodb.net/supermarket_db" --out=D:\xampp\htdocs\Node.js-App
Database Restore
.\mongorestore --uri="mongodb+srv://<username>:<passward>@cluster0.sdtvkpd.mongodb.net/supermarket_db" --dir="D:\xampp\htdocs\Node.js-App\supermarket_db"

# Operation Guides
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

#  curl operation
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

curl -X DELETE https://node-js-app-1-9vi5.onrender.com/api/products/delete/(productID)
