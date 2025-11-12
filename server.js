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
const mongourl = ''; // your url
const client = new MongoClient(mongourl); 
const dbName = 'supermarket_db';
const collectionName = "products";

// ===== Mongoose Connection (for User authentication) =====
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(' Mongoose connected successfully for authentication'))
  .catch(err => console.error(' Mongoose connection error:', err));

// ===== Google OAuth 2.0 Configuration =====
const googleAuth = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
};

// ===== Passport Google OAuth 2.0 Strategy =====
passport.use(new GoogleStrategy({
  clientID: googleAuth.clientID,
  clientSecret: googleAuth.clientSecret,
  callbackURL: googleAuth.callbackURL,
  proxy: true
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      // 🔍 Debug: 完整顯示 profile 結構
      console.log('\n📋 Complete Google Profile:');
      console.log(JSON.stringify(profile, null, 2));

      // ✅ 正確提取 Google ID
      const googleId = profile.id || profile._json?.sub;
      const email = profile.emails?.[0]?.value;
      const displayName = profile.displayName || profile.name?.givenName || 'User';

      console.log('\n✅ Extracted Data:');
      console.log('Google ID:', googleId);
      console.log('Email:', email);
      console.log('Display Name:', displayName);

      // ⚠️ 驗證必要欄位
      if (!googleId) {
        console.error('Google ID is missing from profile!');
        return done(new Error('Google ID not found in profile'), null);
      }

      if (!email) {
        console.error('Email is missing from profile!');
        return done(new Error('Email not found in profile'), null);
      }

      // 🔍 查找或創建用戶
      let user = await User.findOne({ googleId: googleId });

      if (user) {
        console.log('✅ Existing user found:', user.email);
        return done(null, user);
      }

      // 📝 創建新用戶
      console.log('📝 Creating new user...');
      user = new User({
        googleId: googleId,           // ← 確保這裡有值
        email: email,
        displayName: displayName,
        provider: 'google',
        createdAt: new Date()
      });

      await user.save();
      console.log('✅ New user created:', user.email);

      return done(null, user);

    } catch (err) {
      console.error('❌ Passport Strategy Error:', err);
      return done(err, null);
    }
  }
));
passport.use(new LocalStrategy({
    usernameField: 'email',    // 使用 email 作為用戶名
    passwordField: 'password',
    passReqToCallback: true  // 使用 password 作為密碼
  },
  async function(req, email, password, done) {
    try {
      // 查找用戶
      const user = await User.findOne({ email: email });
      
      // 如果用戶不存在
      if (!user) {
        return done(null, false, { message: '找不到該電子郵件地址' });
      }
      
      // 如果用戶是通過 Google 註冊的
      if (user.provider === 'google') {
        return done(null, false, { message: '此帳戶使用 Google 登入，請點擊 "使用 Google 登入" 按鈕' });
      }
      
      // 驗證密碼 (因為是明文密碼)
      if (user.password !== password) {
        return done(null, false, { message: '密碼不正確' });
      }
      
      // 更新最後登入時間
      user.lastLogin = new Date();
      await user.save();
      
      // 登入成功
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// ===== Passport Serialize and Deserialize Users =====
// Passport uses serializeUser function to persist user data into session
passport.serializeUser(function (user, done) {
  done(null, user.id); // Store MongoDB _id in session
});

// Function deserializeUser is used to retrieve user data from session
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});


// ===== Middleware Setup =====
// 1. Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' // HTTPS only in production
  }
}));

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


const insertDocument = async (db, doc) => {
    var collection = db.collection(collectionName);
    let results = await collection.insertOne(doc);
    console.log("insert one document:" + JSON.stringify(results));
    return results;
}

const findDocument = async (db, criteria) => {
    let findResults = [];
    let collection = db.collection(collectionName);
    console.log(`findCriteria: ${JSON.stringify(criteria)}`);
    findResults = await collection.find(criteria).toArray();
    console.log(`findDocument: ${findResults.length}`);
    console.log(`findResults: ${JSON.stringify(findResults)}`);
    return findResults;
};

const updateDocument = async (db, criteria, updateDoc) => {
    let updateResults = [];
    let collection = db.collection(collectionName);
    console.log(`updateCriteria: ${JSON.stringify(criteria)}`);
    updateResults = await collection.updateOne(criteria,{$set : updateDoc});
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
app.get("/logout", authController.logout);
app.get('/auth/status', authController.checkAuthStatus);

// RESTful APIs
app.get('/api/products', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const docs = await findDocument(db, req.query);
        res.status(200).json(docs);
    } catch (error) {
        res.status(500).json({error: error.message});
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
        res.status(201).json({message: 'Product created', id: result.insertedId});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        let DOCID = {};
        DOCID['_id'] = new ObjectId(req.params.id);
        
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
        
        const result = await updateDocument(db, DOCID, updateDoc);
        res.status(200).json({message: `Updated ${result.modifiedCount} product(s)`});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.delete('/api/products/delete/:productId', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const result = await db.collection('products').deleteOne({ productId: req.params.productId });
        res.status(200).json({message: `Deleted ${result.deletedCount} product(s)`});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


// Web UI Handlers
const handle_Create = async (req, res) => {
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
        res.status(500).render('info', {message: `Error: ${error.message}`});
    }
}

const handle_Find = async (res, criteria = {}) => {
    try {
        await client.connect();
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        const docs = await findDocument(db, criteria);
        res.status(200).render('list',{nProducts: docs.length, products: docs});
    } catch (error) {
        res.status(500).render('info', {message: `Error: ${error.message}`});
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
        res.status(200).render('details', {product: docs[0]});
    } catch (error) {
        res.status(500).render('info', {message: `Error: ${error.message}`});
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
        res.status(200).render('edit',{product: docs[0]});
    } catch (error) {
        res.status(500).render('info', {message: `Error: ${error.message}`});
    }
}

const handle_Update = async (req, res) => {
    try {
        await client.connect();
        console.log("Connected successfully to server");
        const db = client.db(dbName);
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
        res.status(200).render('info', {message: `Updated ${results.modifiedCount} product(s)`});
    } catch (error) {
        res.status(500).render('info', {message: `Error: ${error.message}`});
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
        res.status(200).render('info', {message: `Deleted ${results.deletedCount} product(s)`});
    } catch (error) {
        res.status(500).render('info', {message: `Error: ${error.message}`});
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
      nProducts: docs.length,
      products: docs,
      user: req.user || null,
      isAuthenticated: req.isAuthenticated()
    });
  } catch (error) {
    res.status(500).render('info', {
      message: `Error: ${error.message}`
    });
  }
});

app.get('/create', checkRole(['staff', 'manager', 'storage']), isLoggedIn,(req,res) => {
    res.status(200).render('create',{user: 'admin'});
})

app.post('/create', checkRole(['staff', 'manager', 'storage']), isLoggedIn,(req, res) => {
    handle_Create(req, res);
})

app.get('/find', checkRole(['staff', 'manager', 'storage']), isLoggedIn,(req,res) => {
    let criteria = {};
    if (req.query.category) criteria.category = req.query.category;
    if (req.query.productName) criteria.productName = { $regex: req.query.productName, $options: 'i' };
    handle_Find(res, criteria);
})

app.get('/details', (req,res) => {
    handle_Details(res, req.query);
})

app.get('/edit', checkRole(['staff', 'manager', 'storage']), isLoggedIn,(req,res) => {
    handle_Edit(res, req.query);
})

app.post('/update', checkRole(['staff', 'manager', 'storage']), isLoggedIn,(req,res) => {
    handle_Update(req, res);
})

app.get('/delete', checkRole(['staff', 'manager', 'storage']), isLoggedIn,(req,res) => {
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



