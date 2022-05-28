const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cm7di1e.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        await client.connect();
        const productCollection = client.db('manufacturer_website').collection('products');
        const orderCollection = client.db('manufacturer_website').collection('orders');
        const reviewCollection = client.db('manufacturer_website').collection('review');



        app.get('/product', async(req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get('/product/:id', async(req, res) =>{
          const id = req.params.id;
          const query={_id: ObjectId(id)};
          const product = await productCollection.findOne(query);
          res.send(product);
      });
        
      app.post('/orders', async(req, res) =>{
        const orders = req.body;
        const result = await orderCollection.insertOne(orders);
        res.send(result);
    });

    app.get('/orders', async(req, res) => {
      const userEmail = req.query.userEmail;
      const query = {userEmail:userEmail};
      const orders = await orderCollection.find(query).toArray();
      res.send(orders);
  });

  app.get('/review', async(req, res) => {
    const query = {};
    const cursor = reviewCollection.find(query);
    const review = await cursor.toArray();
    res.send(review);
});

    }

    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Manufacturer app listening on port ${port}`)
})