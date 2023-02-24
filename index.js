const mongoose = require("mongoose");
const Models = require("./models.js");

mongoose.connect(
  "mongodb+srv://dbAnu:passw0rd@cluster0.w1fyk.mongodb.net/moviedb",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

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

let allowedOrigins = ["http://localhost:8080", "http://testsite.com"];

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

//CREATE
app.get("/", (req, res) => {
  res.send("Welcome to MovieApi");
});
// CREATE user
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
// Get all users
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
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

//Get a user by username
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
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

//Get all movies
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

//Get movies by title
app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { title } = req.params; //object destructuring same
    const movie = movies.find((movie) => movie.Title === title);

    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(400).send("no such movie");
    }
  }
);

//Get movies by genre information
app.get(
  "/movies/genre/:genreName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find((movie) => movie.Genre.Name === genreName).Genre;

    if (genre) {
      res.status(200).json(genre);
    } else {
      res.status(400).send("no such genre");
    }
  }
);

//Get genre description
app.get(
  "/genres/:Genre",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find({ "Genre.Name": req.params.Genre })
      .then((movie) => {
        res.send(movie.Genre.Description);
      })
      .catch((err) => {
        console.error(err);
        res.status(400).send("Error: " + "No such genre!");
      });
  }
);
//Get director information
app.get(
  "/movies/directors/:directorName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { directorName } = req.params;
    const director = movies.find(
      (movie) => movie.Director.Name === directorName
    ).Director;

    if (director) {
      res.status(200).json(director);
    } else {
      res.status(400).send("no such director");
    }
  }
);

//UPDATE
//Update movie in user's list
app.post(
  "/users/:id/:movieTitle",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find((user) => user.id == id);

    if (user) {
      user.favoriteMovies.push(movieTitle);
      res
        .status(200)
        .send(`${movieTitle} has been added to user ${id}'s array`);
    } else {
      res.status(400).send("no such user");
    }
  }
);

// Update username
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

// Delete user
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

// Delete favorite movie
app.delete(
  "/users/:id/:movieTitle",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find((user) => user.id == id);

    if (user) {
      user.favoriteMovies = user.favoriteMovies.filter(
        (title) => title !== movieTitle
      );
      res
        .status(200)
        .send(`${movieTitle} has been removed from user ${id}'s array`);
    } else {
      res.status(400).send("no such user");
    }
  }
);

//error handler
app.use(express.static("public")); //appends public folder where static file is

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
