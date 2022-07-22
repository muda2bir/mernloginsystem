require("dotenv").config();
const express = require("express");
const app = express();
require("./db/conn.js");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const hbs = require("hbs");
const Register = require("./models/userregister");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

hbs.registerPartials(partials_path);
app.set("view engine", "hbs");
app.set("views", template_path);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).render("index");
});

app.get("/register", async (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

// Registration Part-
app.post("/submit", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.cpassword;

    if (password === cpassword) {
      const registerUser = new Register({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        gender: req.body.gender,
        password: req.body.password,
        cpassword: req.body.cpassword,
      });

      // we're using the middleware here
      // Generating the JWT token
      const token = await registerUser.generateToken();

      const registered = await registerUser.save();
      res.status(201).render("submit");
    } else {
      res.send("Passwords are not matching!!");
    }
  } catch (err) {
    res.status(400).send("Oops!! Some unexpected Error Occurred!!");
  }
});

// Login Part-
app.post("/signin", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const useremail = await Register.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, useremail.password);
    const token = await useremail.generateToken();
    console.log(token);

    if (isMatch) {
      res.status(201).render("signin");
    } else {
      res.send("Invalid User Credentials!!");
    }
  } catch (err) {
    res.status(400).send("Invalid User Credentials!!");
  }
});

const port = process.env.PORT || 8000;
const hostname = "127.0.0.1";
app.listen(port, hostname, () => {
  console.log(`Server is running on http://${hostname}:${port}/`);
});
