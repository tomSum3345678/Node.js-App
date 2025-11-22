/* 
Controllers - express modules
-----------------------------
express-formiddable: https://www.npmjs.com/package/express-formidable
- express-formidable can basically parse form types, including application/x-www-form-urlencoded, application/json, and multipart/form-data.
-----------------------------
fs/promises: https://nodejs.org/zh-tw/learn/manipulating-files/reading-files-with-nodejs
-----------------------------
*/
// ===== .env =====
require('dotenv').config();
const express = require('express');
const app = express();
const fs = require('node:fs/promises');
const formidable = require('express-formidable');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const path = require('path');
// ===== Models =====
const User = require('./models/User');
const authController = require('./controllers/authController');
/* Model - mongodb modules
mongodb ^6.9: https://www.npmjs.com/package/mongodb
*/
const { MongoClient, ObjectId } = require("mongodb");
//const mongourl = 'mongodb+srv://test1:test1@cluster0.sdtvkpd.mongodb.net/?appName=Cluster0';
const mongourl = process.env.MONGODB_URI.replace('supermarket_db?retryWrites=true&w=majority', '?appName=Cluster0');

const client = new MongoClient(mongourl);
const dbName = 'supermarket_db';
const collectionName = "products";

const t = (new Date()).toString() + Math.floor(Math.random() * 1000000);

// ===== Mongoose Connection (for User authentication) =====
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(' Mongoose connected successfully for authentication'))
  .catch(err => console.error(' Mongoose connection error:', err));

// ===== Google OAuth 2.0 Configuration =====
/*const googleAuth = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
};*/

// ===== Passport Google OAuth 2.0 Strategy =====
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  proxy: true
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      //  Debug
      console.log('\n Complete Google Profile:');
      console.log(JSON.stringify(profile, null, 2));

      
      const googleId = profile.id || profile._json?.sub;
      const email = profile.emails?.[0]?.value;
      const displayName = profile.displayName || profile.name?.givenName || 'User';
      const firstName = profile.name?.givenName || '';        
      const lastName = profile.name?.familyName || '';        
      const picture = profile.photos?.[0]?.value || '';       

      console.log('\n Extracted Data:');
      console.log('Google ID:', googleId);
      console.log('Email:', email);
      console.log('Display Name:', displayName);
      console.log('First Name:', firstName);
      console.log('Last Name:', lastName);

     
      if (!googleId) {
        console.error(' Google ID is missing from profile!');
        return done(new Error('Google ID not found in profile'), null);
      }

      if (!email) {
        console.error(' Email is missing from profile!');
        return done(new Error('Email not found in profile'), null);
      }

      
      let user = await User.findOne({ googleId: googleId });

      if (user) {
        console.log(' Existing user found:', user.email);
        
       
        user.lastLogin = new Date();
        await user.save();
        
        return done(null, user);
      }

      
      console.log(' Creating new user...');

      
      const generateUserId = async () => {
        const randomNum = Math.floor(Math.random() * 900000) + 100000; 
        const userId = `USER${randomNum}`;
        
        
        const existingUser = await User.findOne({ userId });
        if (existingUser) {
          return generateUserId(); 
        }
        return userId;
      };

      const userId = await generateUserId();  

      user = new User({
        googleId: googleId,
        userId: userId,
        email: email,
        displayName: displayName,
        firstName: firstName,
        lastName: lastName,
        picture: picture,
        provider: 'google',
        role: 'end-user',
        permissions: ['view_products', 'place_orders'],
        lastLogin: new Date(),
        createdAt: new Date()
      });

      await user.save();
      console.log('New user created:', user.email, 'with userId:', user.userId);

      return done(null, user);

    } catch (err) {
      console.error(' Passport Strategy Error:', err);
      return done(err, null);
    }
  }
));

passport.use(new LocalStrategy({
  usernameField: 'email',    
  passwordField: 'password',
  passReqToCallback: true  
},
  async function (req, email, password, done) {
    try {

      const user = await User.findOne({ email: email });

      if (!user) {
        return done(null, false, { message: 'Email address not found' });
      }

      if (user.provider === 'google') {
        return done(null, false, { message: 'This account is signed in with Google. Please click the "Sign in with Google" button.' });
      }

      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect Email or password' });
      }

      user.lastLogin = new Date();
      await user.save();

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// ===== Passport Serialize and Deserialize Users =====
// Passport uses serializeUser function to persist user data into session
passport.serializeUser(function (user, done) {
  //console.log('Serializing user:', user.id);
  done(null, user.id); // Store MongoDB _id in session
});

// Function deserializeUser is used to retrieve user data from session
passport.deserializeUser(async function (id, done) {
  try {
    console.log('Deserialize User ID:', id);
    const user = await User.findById(id);
    console.log('Deserialized User:', user);
    done(null, user);
  } catch (error) {
    console.error('Error in deserializing user:', error);
    done(error, null);
  }
});



// ===== Middleware Setup =====
app.set('trust proxy', 1);
// 1. Session configuration
//localhost
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));
//Render Production
/*app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  }
}));*/



// 2. Initialize passport and session for persistent login sessions
app.use(passport.initialize());
app.use(passport.session());

// 3. Formidable middleware (for form parsing)
app.use(formidable());

// 4. Static files
app.use(express.static(path.join(__dirname, 'public')));

// 5. Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 6. Make user available to all views
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

// ===== Middleware: Check if user is logged in =====
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.returnTo = req.originalUrl; // Save the original URL
  res.redirect('/login');
}

function checkRole(allowedRoles) {
  return function (req, res, next) {
    if (!req.isAuthenticated()) {
      return res.redirect('/login');
    }

    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    res.status(403).render('info', {
      message: 'Access Denied: You do not have permission to access this page.'
    });
  };
}


const insertDocument = async (db, doc, collectionname = collectionName) => {
  var collection = db.collection(collectionname);
  let results = await collection.insertOne(doc);
  console.log("insert one document:" + JSON.stringify(results));
  return results;
}

const findDocument = async (db, criteria, projection = null) => {
  const collection = db.collection(collectionName);
  console.log(`findCriteria: ${JSON.stringify(criteria)}`);
  let cursor;
  if (projection) {
    // If projection provided, use it
    cursor = collection.find(criteria, { projection });
  } else {
    // Otherwise, return all fields
    cursor = collection.find(criteria);
  }
  const findResults = await cursor.toArray();
  //console.log(`findDocument: ${findResults.length}`); // Toooooo long in console
  // console.log(`findResults: ${JSON.stringify(findResults)}`);  // optional
  return findResults;
};

const updateDocument = async (db, criteria, updateDoc, collectionname = collectionName) => {
  let updateResults = [];
  let collection = db.collection(collectionname);
  console.log(`updateCriteria: ${JSON.stringify(criteria)}`);
  updateResults = await collection.updateOne(criteria, { $set: updateDoc });
  console.log(`updateResults: ${JSON.stringify(updateResults)}`);
  return updateResults;
}

const deleteDocument = async (db, criteria) => {
  let collection = db.collection(collectionName);
  console.log(`deleteCriteria: ${JSON.stringify(criteria)}`);
  let deleteResults = await collection.deleteOne(criteria);
  console.log(`deleteResults: ${JSON.stringify(deleteResults)}`);
  return deleteResults;
}

/* //testing user check
async function syncUsersFromMongoDB() {
  try {
    console.log('🔄 開始同步用戶數據...');
    await client.connect();
    const db = client.db(dbName);
    const mongoUsers = await db.collection('users').find({}).toArray();

    console.log(`📊 找到 ${mongoUsers.length} 個 MongoDB 用戶`);

    for (const mongoUser of mongoUsers) {
      // 檢查用戶是否已存在於 Mongoose 中
      const existingUser = await User.findOne({ email: mongoUser.email });

      if (existingUser) {
        console.log(`✓ 用戶已存在: ${mongoUser.email}`);
        continue;
      }
      console.log(`✅ 同步用戶: ${mongoUser.email}`);
    }

    console.log('✅ 用戶數據同步完成');
  } catch (err) {
    console.error('❌ 同步用戶數據時出錯:', err);
  }
}*/

// ===== Authentication Routes =====

app.get("/login", authController.showLoginPage);
app.post("/login", authController.processLogin);

app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }),
  authController.googleCallback);
app.get('/signup', authController.showSignupPage);
app.post('/signup', authController.processSignup);
app.get("/logout", authController.logout);
app.get('/auth/status', authController.checkAuthStatus);

// RESTful APIs
app.get('/api/products', async (req, res) => { //search products
  try {
    await client.connect();
    const db = client.db(dbName);
    // a projection that excludes productImage(base64 is too long)
    const projection = { productImage: 0 }; 
    const docs = await findDocument(db, req.query, projection);
    res.status(200).json(docs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    let newDoc = {
      productId: req.fields.productId,
      productName: req.fields.productName,
      category: req.fields.category,
      price: parseFloat(req.fields.price),
      stock: parseInt(req.fields.stock),
      description: req.fields.description
    };

    if (req.files.productImage && req.files.productImage.size > 0) {
      const data = await fs.readFile(req.files.productImage.path);
      newDoc.productImage = Buffer.from(data).toString('base64');
    }

    const result = await insertDocument(db, newDoc);
    res.status(201).json({ message: 'Product created', id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/update/:productId', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const criteria = { productId: req.params.productId };

    let updateDoc = {
      productName: req.fields.productName,
      category: req.fields.category,
      price: parseFloat(req.fields.price),
      stock: parseInt(req.fields.stock),
      description: req.fields.description
    };

    if (req.files.productImage && req.files.productImage.size > 0) {
      const data = await fs.readFile(req.files.productImage.path);
      updateDoc.productImage = Buffer.from(data).toString('base64');
    }

    const result = await updateDocument(db, criteria, updateDoc);
    res.status(200).json({ message: `Updated ${result.modifiedCount} product(s)` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/delete/:productId', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const criteria = { productId: req.params.productId };
    const result = await deleteDocument(db, criteria);
    res.status(200).json({ message: `Deleted ${result.deletedCount} product(s)` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Web UI Handlers
const handle_Create_Product = async (req, res) => {
  try {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    let newDoc = {
      productId: req.fields.productId,
      productName: req.fields.productName,
      category: req.fields.category,
      price: parseFloat(req.fields.price),
      stock: parseInt(req.fields.stock),
      description: req.fields.description
    };

    if (req.files.productImage && req.files.productImage.size > 0) {
      const data = await fs.readFile(req.files.productImage.path);
      newDoc.productImage = Buffer.from(data).toString('base64');
    }

    await insertDocument(db, newDoc);
    res.redirect('/');
  } catch (error) {
    res.status(500).render('info', { message: `Error: ${error.message}` });
  }
}

const handle_Create_Invoice = async (req, res) => {
    try {
        await client.connect();
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        const { userId, cartId } = req.fields;
        if (!userId || !cartId) {
            return res.status(400).send({ message: 'Missing userId or cartId' });
        }
        let items = [];
        let index = 0;
        while (true) {
            const productId = req.fields[`items[${index}][productId]`];
            if (productId === undefined) break; // Stop loop if no more items
            items.push({
                productId: productId,
                productName: req.fields[`items[${index}][productName]`],
                quantity: parseInt(req.fields[`items[${index}][quantity]`], 10),
                unitPrice: parseFloat(req.fields[`items[${index}][unitPrice]`]),
                totalPrice: parseFloat(req.fields[`items[${index}][totalPrice]`])
            });
            index++; 
        }

        // Generate a unique ID for the invoice
        let invoiceId = `INV-${Date.now()}`;
        let newInvoice = {
            invoiceId: invoiceId,
            userId: userId,
            cartId: cartId,
            items: items,
            totalAmount: items.reduce((total, item) => total + item.totalPrice, 0),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await insertDocument(db, newInvoice, 'invoices');
        await db.collection('carts').deleteOne({ userId: userId });
        res.redirect(`/invoice/${invoiceId}`);
    } catch (error) {
        console.error("Error creating invoice:", error);
        res.status(500).render('info', { message: `Error: ${error.message}` });
    }
};

const Handle_Delete_Cart = async (req, res) => {
    try {
        await client.connect();
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        const { userId, cartId } = req.fields;
        await db.collection('carts').deleteOne({ userId: userId });
        res.redirect(`/`);
    } catch (error) {
        console.error("Error", error);
        res.status(500).render('info', { message: `Error: ${error.message}` });
    }
};

const handle_Add_To_Cart = async (req, res) => {
    try {
    
        await client.connect();
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        const { userId, productId, quantity } = req.fields;
        let UserId = '';
        if(userId == null || userId == ''){ 
        UserId = t;
        } else { 
        UserId = userId;
        }
        const doc = await db.collection('carts').findOne({ userId: UserId });
        if(doc){
          handle_Update(req, res, 2);
        }else{
        let cartId = `Cart-${Date.now()}`;
        let cart = {
            cartId: cartId,
            userId: UserId,
            items: [{
productId: productId, 
quantity: Number(quantity),
addedAt: new Date()
}],
            updatedAt: new Date()
        };

        await insertDocument(db, cart, 'carts');
        res.redirect(`/`);
        }
    } catch (error) {
        console.error("Error creating invoice:", error);
        res.status(500).render('info', { message: `Error: ${error.message}` });
    }
};

const handle_Find = async (res, criteria = {}) => {
  try {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const docs = await findDocument(db, criteria);
    res.status(200).render('list', { nProducts: docs.length, products: docs });
  } catch (error) {
    res.status(500).render('info', { message: `Error: ${error.message}` });
  }
}

const handle_Details = async (res, criteria) => {
  try {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    let DOCID = {};
    DOCID['_id'] = new ObjectId(criteria._id);
    const docs = await findDocument(db, DOCID);
    res.status(200).render('details', { product: docs[0] });
  } catch (error) {
    res.status(500).render('info', { message: `Error: ${error.message}` });
  }
}

const handle_Edit = async (res, criteria) => {
  try {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    let DOCID = {};
    DOCID['_id'] = new ObjectId(criteria._id);
    const docs = await findDocument(db, DOCID);
    res.status(200).render('edit', { product: docs[0] });
  } catch (error) {
    res.status(500).render('info', { message: `Error: ${error.message}` });
  }
}

const handle_Update = async (req, res, i = 1) => {
  try {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    if(i==1){
    let DOCID = {};
    DOCID['_id'] = new ObjectId(req.fields._id);
    let updateDoc = {
      productName: req.fields.productName,
      category: req.fields.category,
      price: parseFloat(req.fields.price),
      stock: parseInt(req.fields.stock),
      description: req.fields.description
    };

    if (req.files.productImage && req.files.productImage.size > 0) {
      const data = await fs.readFile(req.files.productImage.path);
      updateDoc.productImage = Buffer.from(data).toString('base64');
    }

    const results = await updateDocument(db, DOCID, updateDoc);
    res.status(200).render('info', { message: `Updated ${results.modifiedCount} product(s)` });
    }else if(i==2){
     const userId = req?.user?.userId || t;
     const productId = req.fields.productId;
     const quantityToAdd = parseInt(req.fields.quantity, 10);
     const cartDoc = await db.collection('carts').findOne({ userId });

        let updateDoc;

        if (cartDoc) {
            // If cart document exists, check for the product
            const itemIndex = cartDoc.items.findIndex(item => item.productId === productId);

            if (itemIndex > -1) {
                // Product exists, update the quantity
                cartDoc.items[itemIndex].quantity += quantityToAdd;
            } else {
                // Product doesn't exist, add new product
                const newItem = {
                    productId,
                    quantity: quantityToAdd,
                    addedAt: new Date()
                };
                cartDoc.items.push(newItem);
            }

            updateDoc = {
                items: cartDoc.items, // Updated items array
                updatedAt: new Date()
            };

            // Update the cart document
            const results = await db.collection('carts').updateOne(
                { userId },
                { $set: updateDoc }
            );

            res.status(200).render('info', { message: `Updated ${results.modifiedCount} item(s)` });
 
     }
    }
  } catch (error) {
    res.status(500).render('info', { message: `Error: ${error.message}` });
  }
}

const handle_Delete = async (req, res) => {
  try {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    let DOCID = {};
    DOCID['_id'] = new ObjectId(req.query._id);

    const results = await deleteDocument(db, DOCID);
    res.status(200).render('info', { message: `Deleted ${results.deletedCount} product(s)` });
  } catch (error) {
    res.status(500).render('info', { message: `Error: ${error.message}` });
  }
}

// ===== Web UI Routes =====
/*
app.get('/', (req,res) => {
    res.redirect('/find');
})*/
// Home route
app.get('/', (req, res) => {
  res.redirect('/content');
});

// Home route - redirect to product list
app.get('/', isLoggedIn, (req, res) => {
  if (req.user.role === 'end-user' || req.user.role === '') {
    res.redirect('/content');
  } else if (['staff', 'manager', 'storage'].includes(req.user.role)) {
    res.redirect('/find');
  } else {
    res.redirect('/content');
  }
});

// Content page 
app.get('/content', async (req, res) => {
  console.log('Render Log - User:', req.user);
  console.log('Render Log - Authenticated:', req.isAuthenticated());
  console.log('Session:', req.session);
  console.log('User:', req.user);
  console.log('Authenticated:', req.isAuthenticated());
  try {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);

    let criteria = {};
    if (req.query.category) {
      criteria.category = req.query.category;
    }
    if (req.query.productName) {
      criteria.productName = { $regex: req.query.productName, $options: 'i' };
    }

    const docs = await findDocument(db, criteria);

    res.status(200).render('content', {
      nProducts: docs.length || 0,
      products: docs || [],
      user: req.user || null,
      isAuthenticated: req.isAuthenticated()
    });
      if(req?.user){
  try{
  
    const userId = req.user.userId;
    if (t && userId) {
      const result = await db.collection('carts').updateMany(
        { 
        userId: t,
        userId: { $ne: userId }
        },
        { $set: { userId: userId } }
      );
    }
  }catch(error){
    console.log("ERROR",error.message);//Error or userId already exists
  }
  }
  
  } catch (error) {
    res.status(500).render('info', {
      message: `Error: ${error.message}`
    });
  }
});

// Shopping Cart
app.get('/shoppingcart', async (req, res) => {
console.log(t);
if(req.user==null&&1==2){
	res.redirect('/login');
}else{
  const user = req?.user || { userId: t };
  try {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);

    const cart =  await db.collection('carts').find({userId:user.userId}).toArray();
    const products =  await db.collection('products').find({}).toArray();

 if (cart.length > 0 && products.length > 0) {
  cart[0].items.forEach(cartItem => {
    products.forEach(product => {
      if (cartItem.productId === product.productId) { 
        cartItem.productName = product.productName;
        cartItem.productImage = product.productImage || null; 
        cartItem.unitPrice = product.price; 
        }
      });
    });
  }
	
   res.status(200).render('shoppingcart', {
      nCart: cart.length || 0,
      cart: cart || [],
      user: req.user || null,
      isAuthenticated: req.isAuthenticated()
    });
  } catch (error) {
    res.status(500).render('info', {
      message: `Error: ${error.message}`
    });
  }
 }
});

app.get('/invoice', async (req, res) => {

    try {
    if(req.user==null){
	res.redirect('/login');
}else{
        await client.connect();
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        const invoice = await db.collection('invoices').find({ userId: req.user.userId }).toArray();

        res.render('invoice', { manyInvoices: invoice });
        }
    } catch (error) {
        console.error("Error fetching invoice:", error);
        res.status(500).render('info', { message: `Error: ${error.message}` });
    }
    
});


app.get('/invoice/:invoiceId', async (req, res) => {
    const { invoiceId } = req.params;

    try {
        await client.connect();
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        // Fetch the invoice details from the database
        const invoice = await db.collection('invoices').findOne({ invoiceId: invoiceId });

        if (!invoice) {
            return res.status(404).render('info', { message: 'Invoice not found' });
        }

        // Render the invoice view with the retrieved invoice data
        res.render('invoice', { invoice });
    } catch (error) {
        console.error("Error fetching invoice:", error);
        res.status(500).render('info', { message: `Error: ${error.message}` });
    }
});


app.get('/create', checkRole(['staff', 'manager', 'storage']), isLoggedIn, (req, res) => {
  res.status(200).render('create', { user: 'admin' });
})

app.post('/create', checkRole(['staff', 'manager', 'storage']), isLoggedIn, (req, res) => {
  handle_Create_Product(req, res);
})

app.post('/create-invoice', checkRole(['end-user']), isLoggedIn, (req, res) => {
    handle_Create_Invoice(req, res);
});

app.post('/delete-cart', (req, res) => {
    Handle_Delete_Cart(req, res);
});


app.post('/add-to-cart', (req, res) => {
    handle_Add_To_Cart(req, res);
});

app.get('/find', checkRole(['staff', 'manager', 'storage']), isLoggedIn, (req, res) => {
  let criteria = {};
  if (req.query.category) criteria.category = req.query.category;
  if (req.query.productName) criteria.productName = { $regex: req.query.productName, $options: 'i' };
  handle_Find(res, criteria);
})

app.get('/details', (req, res) => {
console.log("session ===== ",req.session);
  handle_Details(res, req.query);
})

app.get('/edit', checkRole(['staff', 'manager', 'storage']), isLoggedIn, (req, res) => {
  handle_Edit(res, req.query);
})

app.post('/update', checkRole(['staff', 'manager', 'storage']), isLoggedIn, (req, res) => {
  handle_Update(req, res);
})

app.get('/delete', checkRole(['staff', 'manager', 'storage']), isLoggedIn, (req, res) => {
  handle_Delete(req, res);
})

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).render('info', {
    message: `${req.path} - Page not found!`
  });
});

// ===== Error Handler =====
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).render('info', {
    message: err.message || 'Internal Server Error'
  });
});

// ===== Start Server =====
const PORT = process.env.PORT || 8099;
app.listen(PORT, async () => {
  console.log(` Server is running on http://localhost:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Authentication: Google OAuth 2.0`);
  console.log(` Database: ${dbName}`);
  //await syncUsersFromMongoDB();
});

// ===== Graceful Shutdown =====
process.on('SIGINT', async () => {
  console.log('\n Shutting down gracefully...');
  await client.close();
  await mongoose.connection.close();
  console.log(' Database connections closed');
  process.exit(0);
});





