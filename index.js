const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const moment = require("moment");

const app = express();
const port = 8080;

// ✅ Topic A: API in NodeJS - User Login

const users = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const usernameRegex = /^[a-zA-Z]{6,12}$/;
  const passwordRegex = /^[\w@#$%^&*!]{6,}$/;

  if (!usernameRegex.test(username)) {
    return res.status(400).json({ error: "Invalid username format" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({ error: "Invalid password format" });
  }

  users.push({ username, password });
  res.json({ message: "User login successful!" });
});

// ✅ Topic B: NodeJS + MySQL - Get Users by Company ID

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "test",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database!");
});

app.get("/users/:companyId", (req, res) => {
  const companyId = req.params.companyId;

  const query = `SELECT * FROM user WHERE companyId = ?`;

  connection.query(query, [companyId], (error, results) => {
    if (error) throw error;

    res.json(results);
  });
});

// ✅ Topic C: NodeJS + MySQL - Get Orders in the Past 7 Days

app.get("/orders", (req, res) => {
  const query = `SELECT * FROM orders WHERE createdAt >= ?`;
  const sevenDaysAgo = moment().subtract(7, "days").format("YYYY-MM-DD");

  connection.query(query, [sevenDaysAgo], (error, results) => {
    if (error) throw error;

    res.json(results);
  });
});

// ✅ Topic D: API in NodeJS - Sort Fruits by Color

class Fruit {
  constructor(id, name, color) {
    this.id = id;
    this.name = name;
    this.color = color;
  }
}

const fruits = [
  new Fruit(1, "Apple", "Red"),
  new Fruit(2, "Banana", "Yellow"),
  new Fruit(3, "Orange", "Orange"),
  new Fruit(4, "Grapes", "Purple"),
  new Fruit(5, "Kiwi", "Green"),
  new Fruit(6, "Blueberry", "Blue"),
];

app.get("/fruits", (req, res) => {
  const sortedFruits = fruits.sort((a, b) => a.color.localeCompare(b.color));
  res.json(sortedFruits);
});

// Server Litening

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});