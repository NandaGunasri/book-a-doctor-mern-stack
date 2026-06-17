const mongoose = require("mongoose");

const connectToDB = () => {
  const dbUrl = process.env.MONGO_DB;
  mongoose
    .connect(dbUrl)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      throw new Error(`Could not connect to MongoDB: ${err}`);
    });
};

module.exports = connectToDB;