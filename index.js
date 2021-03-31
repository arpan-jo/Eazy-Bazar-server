const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3500;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u4kcg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

client.connect(err => {
   console.log(err);
   const productCollection = client
      .db('eazyBazarDotCom')
      .collection('products');

   app.get('/products', (req, res) => {
      productCollection.find({}).toArray((err, items) => {
         res.send(items);
      });
   });

   app.get('/product/:id', (req, res) => {
      const id = req.params.id;
      console.log(id);
      productCollection.find({ _id: ObjectID(id) }).toArray((err, items) => {
         res.send(items);
      });
   });

   app.post('/addProducts', (req, res) => {
      const products = req.body;
      productCollection.insertOne(products).then(result => {
         res.send(result.insertedCount > 0);
      });
   });
});

app.get('/', (req, res) => {
   res.send('WELCOME TO EAZY BAZAR!');
});

app.listen(port);
