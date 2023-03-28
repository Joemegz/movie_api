const mongoose = require("mongoose");
const Models = require("./models.js");
const bodyParser = require('body-parser');

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const Movies = Models.Movie;
const Users = Models.User;

const express = require("express"); //imports express into package
const app = express(); //imports express into package
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

const { check, validationResult } = require("express-validator");

let allowedOrigins = ["http://localhost:8080", "http://testsite.com", "http://localhost:1234"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn’t found on the list of allowed origins
        let message =
          "The CORS policy for this application doesn’t allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const { allowedNodeEnvironmentFlags, title } = require("process");

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

app.use(morgan("combined", { stream: accessLogStream }));

//CREATE!
app.get("/", (req, res) => {
  res.send("Welcome to MovieApi");
});
// CREATE user TESTED!
app.post("/users", (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
    .then((user) => {
      if (user) {
        //If the user is found, send a response that it already exists
        return res.status(400).send(req.body.Username + " already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});
//READ
// Get all users TESTED!
app.get(
  "/users",
  // passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Get a user by username TESTED!
app.get(
  "/users/:Username",
  // passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//add a movie TESTED! 
app.post(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
      Movies.findOne({ Title: req.body.Title }).then((movie) => {
          if (movie) {
              return res.status(400).send(req.body.Title + 'already exists');
          } else {
              Movies.create({
                  Title: req.body.Title,
                  Description: req.body.Description,
                  Genre: {
                      Name: req.body.Genre.Name,
                      Description: req.body.Genre.Description
                  },
                  Director: {
                      Name: req.body.Director.Name,
                      Bio: req.body.Director.Bio
                  },
                  ImagePath: req.body.ImagePath,
                  Featured: req.body.Featured,
              })
                  .then((movie) => {
                      res.status(201).json(movie);
                  })
                  .catch((err) => {
                      console.log(err);
                      res.status(500).send('Error: ' + err);
                  });
          }
      });
  }
);

//Get all movies TESTED! 
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }), 
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// Get a movie by title TESTED!
app.get(
  "/movies/:movieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ _id: req.params.movieID })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Get a Movie by Genre TESTED !
app.get(
  "/movies/genre/:genreName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find({ 'Genre.Name': req.params.genreName }) //nested strings use single quote pull
      .then((movie) => {
        res.json(movie); //sending all movies for the given genre
        console.log("inside then")
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);


//Get genre description TESTED !
app.get(
  "/genre/:genreName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.genreName })//finding the genre name
      .then((movie) => {
        res.send(movie.Genre.Description);//sending genre description
      })
      .catch((err) => {
        console.error(err);
        res.status(400).send("Error: " + "No such genre!");
      });
  }
);


//Get director information TESTED !
app.get(
  "/director/:directorName", 
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.directorName }) //nested strings use single quote pull
    .then((movie) => {
      res.send(movie.Director.Bio);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send("Error: " + "No such Director!");
    });
}
);

//UPDATE
//Update movie in user's list TESTED !
app.post(
  "/users/:username/:movieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ _id: req.params.movieID }) .then((movie) =>{
      Users.findOneAndUpdate({ Username: req.params.username }, {
      $push: { FavoriteMovies: movie }
    },
    { new: true }, // This line makes sure that the updated document is returned
   (err, updatedUser) => {
     if (err) {
       console.error(err);
       res.status(500).send('Error: ' + err);
     } else {
       res.status(200).send(updatedUser);
     }
   });


    })
    
  }
);


// Update username TESTED !
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Delete user TESTED !
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Delete favorite movie TESTED !
app.delete(
  "/users/:username/:movieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
  Movies.findOne({ _id: req.params.movieID }) .then((movie) => {
    Users.findOneAndUpdate(
      { Username: req.params.username }, 
      {$pull: {FavoriteMovies: movie} },
      {new: true })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.username + " was not found");
        } else {
          res.status(200).send(req.params.movieTitle + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  })
 }
);

//error handler
app.use(express.static("public")); //appends public folder where static file is

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});