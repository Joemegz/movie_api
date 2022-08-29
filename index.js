const express = require('express'); //imports express into package 
const app = express();//imports express into package
   
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const { allowedNodeEnvironmentFlags, title } = require('process');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});
app.use(express.json())
app.use(morgan('combined', {stream: accessLogStream}));



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  let movies = [
    {
      "Title":"The Guardian",
      "Description": "A high school swim champion with a troubled past enrolls in the U.S. Coast Guard's 'A' School, where legendary rescue swimmer Ben Randall teaches him some hard lessons about loss, love, and self-sacrifice.",
      "Genre": {
        "Name": "Action",
        "Description": "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
       },
      "Director": { 
        "Name": "Andrew Davis",
        "Bio": "Andrew Davis is a filmmaker with a reputation for directing intelligent thrillers, most notably the Academy Award-nominated box-office hit The Fugitive (1993), starring Harrison Ford and Tommy Lee Jones. The film received seven Academy Award nominations including Best Picture and earned Jones a Best Supporting Actor award. Davis garnered a Golden Globe nomination for Best Director and a Directors Guild of America nomination for Outstanding Directorial Achievement in Theatrical Direction."
      },
      "ImageURL": "https://www.imdb.com/title/tt0406816/mediaviewer/rm58757632/?ref_=tt_ov_i",
      "Year": "2006"
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

app.get("/", (req, res)=> {
    res.send("Welcome to MovieApi")
 });//get route 
 app.get("/movies", (req, res)=> { 
    
    res.json(movies)
 });//get route 



//add endpoints in this area 

// CREATE
app.post('/users', (req, res) =>{
  const newUser = req.body;

  if (newUser.name) {
    // newUser.id = uuid.v4;
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('users need names')
  }
})

//UPDATE
app.put('/users/:id', (req, res) =>{
  const { id } = req.params;
  const updatedUser = req.body;

    let user = users.find( user => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no such user')
  }
})


// CREATE
app.post('/users/:id/:movieTitle', (req, res) =>{
  const { id, movieTitle } = req.params;
  
  let user = users.find( user => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send('no such user')
  }
})


// DELETE
app.delete('/users/:id/:movieTitle', (req, res) =>{
  const { id, movieTitle } = req.params;
  
  let user = users.find( user => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send('no such user')
  }
})

// DELETE
app.delete('/users/:id', (req, res) =>{
  const { id } = req.params;
  
  let user = users.find( user => user.id == id);

  if (user) {
    users = users.filter( user => user.id != id);
    res.status(200).send(`user ${id} has been deleted`);
  } else {
    res.status(400).send('no such user')
  }
})


// READ
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
})

//READ
app.get('/movies/:title', (req, res) => {
  const { title } = req.params; //object destructuring same 
  const movie = movies.find( movie => movie.Title === title );

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('no such movie')
  }
  
})
// READ
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;  
  const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('no such genre')
  }

})

// READ
app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;  
  const director = movies.find( movie => movie.Director.Name === directorName ).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('no such director')
  }

})

 app.use(express.static('public'));//appends public folder where static file is 
 app.listen(8080, () => {
    console.log("Server is running")
 })