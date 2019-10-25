const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

const process = require('process');

process.on('beforeExit', (code) => {
  console.log('Process beforeExit event with code: ', code);
});

process.on('exit', (code) => {
  console.log('Process exit event with code: ', code);
});

console.log('This message is displayed first.');

var db

// Remember to change YOUR_USERNAME and YOUR_PASSWORD to your username and password! 
MongoClient.connect('mongodb://localhost/star-wars-quotes', (err, database) => {
  if (err) return console.log(err)
  db = database.db('star-wars-quotes')
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {quotes: result})
  })
})

app.post('/single', (req, res) => {

  //var queryString = req.query.nameViewText; //GET

  var queryString = req.body.nameViewText; // POST
  
  db.collection('quotes').findOne({name:queryString}, (err, result) => {
    if (err)
    {
        return console.log(err)
    }
    if(result)
    {
      res.render('index.ejs', {quotes: [result]})
    }
     
    
  })
})
  //res.send("All ok");
  /*
  db.collection('quotes').findOne({name:"Bharath"})
    .then(result => {
      if(result) {
        res.render('index.ejs', {quotes: result})
        console.log(`Successfully found document: ${result}.`)
      } else {
        console.log("No document matches the provided query.")
      }
      return result
    })
    .catch(err => console.error(`Failed to find document: ${err}`))
    */


app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/quotes', (req, res) => {
  db.collection('quotes')
  .findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('A darth vadar quote got deleted')
  })
})
