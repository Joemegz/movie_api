const express = require('express'); //imports express into package 
const app = express();//imports express into package
   
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

app.use(morgan('combined', {stream: accessLogStream}));


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.get("/", (req, res)=> {
    res.send("Welcome to MovieApi")
 });//get route 
 app.get("/movies", (req, res)=> { 
    let movies = [
        {
          title: "My Neighbour Totoro",
        },
        {
          title: "Spirited Away",
        },
        {
          title: "Howl's Moving Castle",
        },
        {
          title: "Deadpool",
        },
        {
          title: "Your Name",
        },
        {
          title: "Kingsman The Secret Service",
        },
        {
          title: "The Greatest Showman",
        },
        {
          title: "Legally Blonde",
        },
        {
          title: "Parasite",
        },
        {
          title: "Guardians of the Galaxy",
        },
      ];
    res.json(movies)
 });//get route 

//add endpoints in this area BEFORE line 63





 app.use(express.static('public'));//appends public folder where static file is 
 app.listen(8080, () => {
    console.log("Server is running")
 })