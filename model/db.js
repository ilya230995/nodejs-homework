const mongoose = require("mongoose");
require("dotenv").config();
const uriDb = process.env.URI_DB;

const db = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

mongoose.connection.on("connect", () => {
  console.log("Database connection successful");
});

mongoose.connection.on("error", (err) => {
  console.log(`Connection error: ${err.message}`);
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(1);
});

module.exports = db;
