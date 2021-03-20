const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const { httpCode } = require("./helpers/constant");

const contactsRouter = require("./routes/api/contacts");
const usersRouter = require("./routes/api/users/index");

const app = express();

app.use(express.static("public"));

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(httpCode.NOT_FOUND).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(httpCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
});

module.exports = app;
