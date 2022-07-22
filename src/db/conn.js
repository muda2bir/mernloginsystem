const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_LINK, () => {
  console.log(`Connected to the Database Successfully!!`);
});
