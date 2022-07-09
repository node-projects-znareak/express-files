const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const PUBLIC_PATH = path.resolve(__dirname, "./public");
const FILE = path.join(PUBLIC_PATH, "test.txt");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    methods: ["GET", "POST"],
    origin: "*",
  })
);
app.use(express.static(PUBLIC_PATH));
app.use(morgan("dev"));

app.get("/:content", (req, res) => {
  const content = req.params.content || "Default content";

  fs.writeFile(FILE, content, (error) => {
    if (error) {
      console.log(error);
      return res.json({
        error,
      });
    }
    res.json({
      data: "The file had been created successfully",
      url: FILE,
      content,
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server listen on port: ${PORT}`);
});
