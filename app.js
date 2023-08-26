//Package Requirements
  //Express defaults:
const express = require("express");
const app = express();
const bodyParser = require('body-parser');

  //Security
const bcrypt = require("bcrypt"); //Password Hashing
const jwt = require("jsonwebtoken"); //Session Tokens

  //Database
const auth = require("./auth");
const dbConnect = require("./db/dbConnect.js"); // Require database connection.
dbConnect(); // Execute database connection.
const User = require("./db/userModel.js"); // User Model
const rentalItems = require("./db/rentalItemsModel.js"); // Rental Items Model


// Todo: Implement helmet.js to add security to header 
// Todo: Implement audit tracking and log, as well as secrets management
// Todo: Post to store errors in db. (Table called ExceptionLogs)

//Mounting Set Header middleware to allow CORS
app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Mounting Body Parser middleware to parse request body data.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Repsonse to show that server is online.
app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

//Registration End Point
app.post("/register", (request, response) => {
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
      });

      user
      .save()
      .then((result) => {
        response.status(201).send({
          message: "User created successfully!",
          result,
        })
      })
      .catch((error) => {
        response.status(500).send({
          message: "Error creating user!",
          error,
        })
      })
    })
    .catch((e) => {
      response.status(500).send({
        message: "Password was not succesfully hahsed!",
        e,
      })
    })
  })

  //Login Endpoint
app.post("/login", (request, response) => {
  User.findOne({email: request.body.email})
  .then((user) => {
    bcrypt.compare(request.body.password, user.password)
    .then((passwordCheck) => {
      if(!passwordCheck) {
        return response.status(400).send({
          message: "Passwords do not match!",
          error,
        })
      }
      const token = jwt.sign(
        {
          userId: user._id,
          userEmail: user.email
        },
        "RANDOM-TOKEN",
        {expiresIn: "24h"}
        )
        response.status(200).send({
        message: "Login Successful",
        email: user.email,
        token,
      })
    })
    .catch((error) => {
      response.status(400).send({
        message: "Passwords do not match!",
        error,
      })
    })
  })
  .catch((e) => {
    response.status(404).send({
      message: "Email not found!",
      e,
    })
  })
})

app.get("/free-endpoint", (request, response) => {
  response.json({message: "You are free to access me anytime!"})
})

app.get("/auth-endpoint", auth,(request, response) => {
  response.json({message: "You are authorized to access me!"})
})

app.get("/rentalItems", async (request, response) => {
  
  try {
    const data = await rentalItems.find(request.body);

    if (data) {
      response.json(data);//response.json(data);
    } else {
      response.status(404).json({ message: 'Item not found' });
    }

  } catch (error) {
    console.error(error);
    response.status(500).json({ message: `Server Error: ${error}` });
  }
})

/*
app.post("/rentalItems", async (request, response) => {
  try {
    const { itemImage, itemName, itemCategory, itemQuantity, itemDescription } = request.body;

    const newItem = new rentalItems({
      itemImage,
      itemName,
      itemCategory,
      itemQuantity,
      itemDescription,
    });

    const savedItem = await newItem.save();
    response.status(201).json(savedItem);

  } catch (error) {
    console.error(error);
    response.status(500).json({ message: `Server Error: ${error}` });
  }
});*/


module.exports = app;