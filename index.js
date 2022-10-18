const mongoose = require('mongoose');
const Models = require('./models.js');

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

const Movies = Models.Movie;
const Users = Models.User;


const express = require('express'); //imports express into package 
const app = express();//imports express into package

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

const { check, validationResult } = require('express-validator');

const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];


app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const { allowedNodeEnvironmentFlags, title } = require('process');

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });


const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});
app.use(express.json())
app.use(morgan('combined', {stream: accessLogStream}));

  let movies = [
    {
      "Title":"Inception",
      "Description": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
      "Genre": {
        "Name": "Action",
        "Description": "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
       },
       "Director": {
        "Name": "Christopher Nolan",
        "Bio": "Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England. Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made."
      },
      "ImageURL": "https://www.imdb.com/title/tt1375666/mediaviewer/rm3426651392/?ref_=tt_ov_i",
      "Year": "2010"
    },
    {
      "Title": "The GodFather",
      "Description": "The aging patriarch of an organized crime dynasty in postwar New York City transfers control of his clandestine empire to his reluctant youngest son.",
      "Genre":{
        "Name": "Crime",
        "Description": "Crime fiction, detective story, murder mystery, mystery novel, and police novel are terms used to describe narratives that centre on criminal acts and especially on the investigation, either by an amateur or a professional detective, of a crime, often a murder.[1] It is usually distinguished from mainstream fiction and other genres such as historical fiction or science fiction, but the boundaries are indistinct. Crime fiction has multiple subgenres,[2] including detective fiction (such as the whodunit), courtroom drama, hard-boiled fiction, and legal thrillers. Most crime drama focuses on crime investigation and does not feature the courtroom. Suspense and mystery are key elements that are nearly ubiquitous to the genre."
      },  
      "Director":{ 
        "Name": "Francis Ford Coppola",
        "Bio": "Francis Ford Coppola was born in 1939 in Detroit, Michigan, but grew up in a New York suburb in a creative, supportive Italian-American family. His father, Carmine Coppola, was a composer and musician. His mother, Italia Coppola (née Pennino), had been an actress. Francis Ford Coppola graduated with a degree in drama from Hofstra University, and did graduate work at UCLA in filmmaking. He was training as assistant with filmmaker Roger Corman, working in such capacities as sound-man, dialogue director, associate producer and, eventually, director of Dementia 13 (1963), Coppola's first feature film."
      },
      "ImageURL": "https://www.imdb.com/title/tt0068646/mediaviewer/rm746868224/?ref_=tt_ov_i",
      "Year": "1972"
    },
    {
      "Title": "Crazy, Stupid, Love.",
      "Description": "A middle-aged husband's life changes dramatically when his wife asks him for a divorce. He seeks to rediscover his manhood with the help of a newfound friend, Jacob, learning to pick up girls at bars.",
      "Genre":{ 
        "Name": "Comedy",
        "Description": "Comedy is a genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter, especially in theatre, film, stand-up comedy, television, radio, books, or any other entertainment medium."
      },
      "Director":{
        "Name": "Glenn Ficarra", 
        "Bio": "Glenn Ficarra is a producer and writer, known for I Love You Phillip Morris (2009), Cats & Dogs (2001) and This Is Us (2016)."
      },
      "ImageURL": "https://www.imdb.com/title/tt1570728/mediaviewer/rm3494755840/?ref_=tt_ov_i",
      "Year": "2011"
    },
    {
      "Title": "Deadpool",
      "Description": "A wisecracking mercenary gets experimented on and becomes immortal but ugly, and sets out to track down the man who ruined his looks.",
      "Genre": {
      "Name": "Action",
      "Description": "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
     },
      "Director": {
        "Name": "Tim Miller",
        "Bio": "Tim Miller is an American animator, film director, creative director and visual effects artist. He was nominated for the Academy Award for Best Animated Short Film for the work on his short animated film Gopher Broke. He made his directing debut with Deadpool. Miller is also famous for creating opening sequences of The Girl with the Dragon Tattoo and Thor: The Dark World."
    },
      "ImageURL": "https://www.imdb.com/title/tt1431045/mediaviewer/rm351021568/?ref_=tt_ov_i",
      "Year": "2016"
    },
    {
      "Title": "Thor: Ragnarok",
      "Description": "Imprisoned on the planet Sakaar, Thor must race against time to return to Asgard and stop Ragnarök, the destruction of his world, at the hands of the powerful and ruthless villain Hela.",
      "Genre": {
        "Name": "Action",
        "Description": "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
     },
      "Director": {
        "Name": "Taika Waititi",
        "Bio": "Taika Waititi, also known as Taika Cohen, hails from the Raukokore region of the East Coast of New Zealand, and is the son of Robin (Cohen), a teacher, and Taika Waititi, an artist and farmer. His father is Maori (Te-Whanau-a-Apanui), and his mother is of Ashkenazi Jewish, Irish, Scottish, and English descent. Taika has been involved in the film industry for several years, initially as an actor, and now focusing on writing and directing."
      },
      "ImageURL": "https://www.imdb.com/title/tt3501632/mediaviewer/rm1413491712/?ref_=tt_ov_i",
      "Year": "2017"
    },
    {
      "Title": "Spider-Man: Into the Spider-Verse",
      "Description": "Teen Miles Morales becomes the Spider-Man of his universe, and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.",
      "Genre": {
        "Name": "Animation",
        "Description": "Animation is a method in which figures are manipulated to appear as moving images. In traditional animation, images are drawn or painted by hand on transparent celluloid sheets to be photographed and exhibited on film. Today, most animations are made with computer-generated imagery (CGI). Computer animation can be very detailed 3D animation, while 2D computer animation (which may have the look of traditional animation) can be used for stylistic reasons, low bandwidth, or faster real-time renderings."
      },
      "Director": {
        "Name": "Bob Persichetti",
        "Bio": "Bob Persichetti is a director and writer, known for Spider-Man: Into the Spider-Verse (2018), The Little Prince (2015) and Puss in Boots (2011)."
      },
      "ImageURL": "https://www.imdb.com/title/tt4633694/mediaviewer/rm173371392/?ref_=tt_ov_i",
      "Year": "2018"
    },
    {
      "Title": "White Chicks",
      "Description": "Two disgraced FBI agents go way undercover in an effort to protect hotel heiresses the Wilson sisters from a kidnapping plot.",
      "Genre": {
        "Name": "Comedy",
        "Description": "Comedy is a genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter, especially in theatre, film, stand-up comedy, television, radio, books, or any other entertainment medium."
      },
      "Director": {
        "Name": "Keenen Ivory Wayans",
        "Bio": "The trail-blazing linchpin of a sprawling family dynasty of comic entertainers, it was multi-talented writer/director/producer Keenen Ivory Wayans (born June 8, 1958, in New York City) who led the familial pack and was the first to achieve national prominence when he successfully created, launched, wrote, hosted and starred in In Living Color (1990), a landmark 1990s black-oriented comedy sketch satire on Fox TV that beat the odds and transcended the then-narrow periphery of TV comedy to became a defiant movement of inclusion."
      },
      "ImageURL": "https://www.imdb.com/title/tt0381707/mediaviewer/rm2950732032/?ref_=tt_ov_i",
      "Year": "2004"
    },
    {
      "Title": "The Other Guys",
      "Description": "Two mismatched New York City detectives seize an opportunity to step up like the city's top cops, whom they idolize, only things don't quite go as planned.",
      "Genre": {
        "Name": "Comedy",
        "Description": "Comedy is a genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter, especially in theatre, film, stand-up comedy, television, radio, books, or any other entertainment medium."
      },
      "Director": {
        "Name": "Adam McKay",
        "Bio": "Adam McKay (born April 17, 1968) is an American screenwriter, director, comedian, and actor. McKay has a comedy partnership with Will Ferrell, with whom he co-wrote the films Anchorman, Talladega Nights, and The Other Guys. Ferrell and McKay also founded their comedy website Funny or Die through their production company Gary Sanchez Productions. He has been married to Shira Piven since 1999. They have two children."
      },
      "ImageURL": "https://www.imdb.com/title/tt1386588/mediaviewer/rm2586368513/?ref_=tt_ov_i",
      "Year": "2010"
    },
    {
      "Title": "Logan",
      "Description": "In a future where mutants are nearly extinct, an elderly and weary Logan leads a quiet life. But when Laura, a mutant child pursued by scientists, comes to him for help, he must get her to safety.", 
      "Genre": {
        "Name": "action",
        "Description": "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
      },
      "Director": {
        "Name": "James Mangold",
        "Bio": "James Mangold is an American film and television director, screenwriter and producer. Films he has directed include Girl, Interrupted (1999), Walk the Line (2005), which he also co-wrote, the 2007 remake 3:10 to Yuma (2007), The Wolverine (2013), and Logan (2017). Mangold also wrote and directed Cop Land (1997), starring Sylvester Stallone, Robert De Niro, Harvey Keitel, and Ray Liotta."
      },
      "ImageURL":"https://www.imdb.com/title/tt3315342/mediaviewer/rm2555988736/?ref_=tt_ov_i",
      "Year":"2017"
    },
    {
      "Title": "The Dark Knight",
      "Description": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      "Genre": {
        "Name": "action",
        "Description": "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
      },
      "Director": {
        "Name": "Christopher Nolan",
        "Bio": "Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England. Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made."
      },
      "ImageURL": "https://www.imdb.com/title/tt0468569/mediaviewer/rm4023877632/?ref_=tt_ov_i",
      "Year": "2008"
     },
  ];

  let users = [
    {
      id: 1,
      name: 'Joe',
      favoriteMovies: ["The Dark Knight"]
    },
    {
      id: 2,
      name: 'Mike',
      favoriteMovies: ["White Chicks"]
    },
   ];

  //CREATE
app.get("/", (req, res)=> {
    res.send("Welcome to MovieApi")
 });
 // CREATE user
 app.post('/users', (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
    .then((user) => {
      if (user) {
      //If the user is found, send a response that it already exists
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});
 //READ
 // Get all users
 app.get('/users', 
 passport.authenticate('jwt', { session: false }), 
 (req, res) => {
   Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });
  
  //Get a user by username 
  app.get('/users/:Username', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

  //Get all movies
  app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
   Movies.find()
     .then((movies) => {
       res.status(201).json(movies);
     })
     .catch((error) => {
       console.error(error);
       res.status(500).send('Error: ' + error);
      });
    });

    //Get movies by title
    app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
      const { title } = req.params; //object destructuring same 
      const movie = movies.find( movie => movie.Title === title );
      
      if (movie) {
        res.status(200).json(movie);
      } else {
        res.status(400).send('no such movie')
      }
    });

    //Get movies by genre information
    app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {
      const { genreName } = req.params;  
      const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;
    
      if (genre) {
        res.status(200).json(genre);
      } else {
        res.status(400).send('no such genre')
      }
    });

    //Get genre description
  app.get('/genres/:Genre', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find({ 'Genre.Name': req.params.Genre })
	  .then((movie) => {
	  res.send(movie.Genre.Description);
	})
	.catch((err) => {
	  console.error(err);
	  res.status(400).send('Error: ' + 'No such genre!');
	});
}
);
    //Get director information
  app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { directorName } = req.params;  
    const director = movies.find( movie => movie.Director.Name === directorName ).Director;
    
    if (director) {
      res.status(200).json(director);
    } else {
      res.status(400).send('no such director')
    }
  });

  //UPDATE
  //Update movie in user's list
  app.post('/users/:id/:movieTitle', passport.authenticate('jwt', { session: false }), (req, res) =>{
    const { id, movieTitle } = req.params;
    
    let user = users.find( user => user.id == id);
  
    if (user) {
      user.favoriteMovies.push(movieTitle);
      res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
    } else {
      res.status(400).send('no such user')
    }
  });



   

// Update username 
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Delete user
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Delete favorite movie
app.delete('/users/:id/:movieTitle', passport.authenticate('jwt', { session: false }), (req, res) =>{
  const { id, movieTitle } = req.params;
  
  let user = users.find( user => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send('no such user')
  }
});

//error handler
 app.use(express.static('public'));//appends public folder where static file is 
 
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
