/* 
Controllers - express modules
-----------------------------
express-formiddable: https://www.npmjs.com/package/express-formidable
- express-formidable can basically parse form types, including application/x-www-form-urlencoded, application/json, and multipart/form-data.
-----------------------------
fs/promises: https://nodejs.org/zh-tw/learn/manipulating-files/reading-files-with-nodejs
-----------------------------
*/
const express = require('express');
const app = express();
const fs = require('node:fs/promises');
const formidable = require('express-formidable'); 
app.use(formidable());

/* Model - mongodb modules
mongodb ^6.9: https://www.npmjs.com/package/mongodb
*/
const { MongoClient, ObjectId } = require("mongodb");
const mongourl = ''; //  MongoDB connection URL.
const client = new MongoClient(mongourl); 
const dbName = 'supermarket_db';
const collectionName = "products";

// Views
app.set('view engine', 'ejs');

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

app.delete('/api/products/delete/:id', async (req, res) => {
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

// Routes
app.get('/', (req,res) => {
    res.redirect('/find');
})

app.get('/create', (req,res) => {
    res.status(200).render('create',{user: 'admin'});
})

app.post('/create', (req, res) => {
    handle_Create(req, res);
})

app.get('/find', (req,res) => {
    let criteria = {};
    if (req.query.category) criteria.category = req.query.category;
    if (req.query.productName) criteria.productName = { $regex: req.query.productName, $options: 'i' };
    handle_Find(res, criteria);
})

app.get('/details', (req,res) => {
    handle_Details(res, req.query);
})

app.get('/edit', (req,res) => {
    handle_Edit(res, req.query);
})

app.post('/update', (req,res) => {
    handle_Update(req, res);
})

app.get('/delete', (req,res) => {
    handle_Delete(req, res);
})

app.use((req, res) => {
    res.status(404).render('info', { message: `${req.path} - Page not found!` });
});

app.listen(process.env.PORT || 8099, () => {
    console.log(`Server is running on port ${process.env.PORT || 8099}`);
});

