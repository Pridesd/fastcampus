const express = require("express");
const fs = require("fs");
const cors = require("cors");

const data = JSON.parse(fs.readFileSync("data.json"));

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  const { author, message } = req.query;
  res.json(
    data
      .filter((value) => (author ? value.author.includes(author) : true))
      .filter((value) => (message ? value.message.includes(message) : true))
  );
});

app.get("/random", (req, res) => {
  const id = Math.floor(Math.random() * data.length);
  res.json(data[id]);
});

app.get("/:id", (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    res.json({
      rs: false,
    });
    return;
  }
  const num = parseInt(id);
  if (num < 0 || num >= data.length) {
    res.json({
      rs: false,
    });
    return;
  }
  res.json(data[id]);
});

app.post("/", (req, res) => {
  const { author, message } = req.body;
  if (!(author && author.length > 0 && message && message.length > 0)) {
    res.json({
      rs: false,
    });
    return;
  }
  data.push({
    author: req.body.author,
    message: req.body.message,
  });
  res.json({
    rs: true,
  });
});

app.delete("/:id", (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    res.json({
      rs: false,
    });
    return;
  }
  const num = parseInt(id);
  if (num < 0 || num >= data.length) {
    res.json({
      rs: false,
    });
    return;
  }
  data.splice(num, 1);
  res.json({
    rs: true,
  });
});

app.put("/:id", (req, res) => {
  const { author, message } = req.body;
  const { id } = req.params;
  if (
    !(author && author.length > 0 && message && message.length > 0) &&
    isNaN(id)
  ) {
    res.json({
      rs: false,
    });
    return;
  }
  const num = parseInt(id);
  if (num < 0 || num >= data.length) {
    res.json({
      rs: false,
    });
    return;
  }
  data.splice(num, 1, { author: author, message: message });
  res.json({
    rs: true,
  });
});

app.listen(8080, () => {
  console.log("start server!");
});
