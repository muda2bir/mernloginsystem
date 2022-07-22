const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/users")
  .then(() => console.log(`Connected Successfully to Database!`))
  .catch((err) => {
    console.log(`Something went wrong!! Error: ${err}`);
  });
