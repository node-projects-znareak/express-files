const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { uuid } = require("uuidv4");
const { getCurrentDate } = require("./helpers/utils");
const PUBLIC_PATH = path.resolve(__dirname, "./public");

const DEFAULT_CONTENT = `# File created on: ${getCurrentDate()} \n\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    methods: ["GET", "POST"],
    origin: "*",
  })
);
app.use(express.static(PUBLIC_PATH));
app.use(morgan("dev"));

app.get("/create", (req, res) => {
  const ID = uuid();
  const { filename = ID, content = DEFAULT_CONTENT } = req.query;
  const FILENAME = `${filename}.txt`;
  const FILE = path.join(PUBLIC_PATH, FILENAME);

  fs.writeFile(FILE, content, (error) => {
    if (error) {
      console.log(error);
      return res.json({
        error,
      });
    }
    res.json({
      message: "The file had been created successfully",
      local_url: FILE,
      public_url: `/${FILENAME}`,
      filename: FILENAME,
      content,
    });
  });
});

app.get("/list", (req, res) => {
  fs.readdir(PUBLIC_PATH, (error, files) => {
    if (error) {
      console.log(error);
      return res.json({
        error,
      });
    }

    const fileList = files.map((file) => {
      const FILE_PATH = path.join(PUBLIC_PATH, file);
      return {
        name: file,
        local_url: FILE_PATH,
        public_url: `/${file}`,
      };
    });
    res.json(fileList);
  });
});

app.listen(PORT, () => {
  console.log(`Server listen on port: ${PORT}`);
});
