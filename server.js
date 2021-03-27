var express = require('express');
var app = express();
const { Client } = require('pg');

let DB_URI = "postgresql://postgres:postgres@localhost:5432/agario";
const db = new Client({
  connectionString: DB_URI  
  // ,ssl: {
  //   rejectUnauthorized: false
  // }
});

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({
  extended: true
}))
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
 

db.connect();
app.get('/highscores', async function (req, res) {
  
  try{
    
  let result =  await db.query(
    `SELECT username,
              score
          FROM scores 
          `
   
  );
  

  res.send(JSON.stringify(result.rows));
  }
  catch(error){ 
    res.send(error.toString());}

});

app.post('/newscore', async function (req, res) {

  try{

  let username = req.body.username;
  let score = req.body.score;

  let result= await db.query(
    `INSERT INTO scores (username,score) VALUES ($1, $2)`,
    [username, score]
  );
  let r =  await db.query(
    `SELECT username,
              score
          FROM scores 
          `
   
  );
  res.send(JSON.stringify(r.rows));
  }catch(error)
  {
    res.send(error.toString());
  }
 


});
app.listen(8000, function () {
});