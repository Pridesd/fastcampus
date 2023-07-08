const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const data = JSON.parse(fs.readFileSync("data.json"));
let tempData = "";
const save = () => {
  fs.writeFileSync("data.json", JSON.stringify(data));
};

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json(data);
});

app.get("/tmp", (___, res) => {
  if (tempData.length === 0) {
    res.json({
      rs: false,
      msg: "임시저장된 값이 없습니다. ",
    });
    return;
  }
  res.json({
    rs: true,
    content: tempData,
  });
});

app.get("/:id", (req, res) => {
  const { id } = req.params;

  const idx = data.findIndex((memo) => memo.id === id);
  if (idx === -1) {
    res.json({
      rs: false,
      msg: "잘못된 Id입니다.",
    });
    return;
  } else {
    res.json(data[idx]);
  }
});

app.post("/", (req, res) => {
  const { content } = req.body;
  if (content.length === 0 || !content) {
    res.json({
      rs: false,
      msg: "값이 없습니다.",
    });
    return;
  }
  data.push({
    content: content,
    id: uuidv4(),
    upload: new Date().getTime(),
    update: null,
    delete: null,
  });
  save();
  res.json({
    rs: true,
    msg: "데이터가 추가되었습니다.",
  });
});
app.post("/tmp", (req, res) => {
  const { content } = req.body;
  tempData = content;
  res.json({
    rs: true,
    msg: "임시저장 되었습니다.",
  });
});
app.put("/:id", (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const idx = data.findIndex((memo) => memo.id === id);
  if (idx === -1) {
    res.json({
      rs: false,
      msg: "잘못된 Id입니다.",
    });
    return;
  }
  if (data[idx].delete) {
    res.json({
      rs: false,
      msg: "이미 삭제된 정보입니다.",
    });
    return;
  }
  if (content.length === 0 || !content) {
    res.json({
      rs: false,
      msg: "값이 없습니다.",
    });
    return;
  }
  data[idx].content = content;
  data[idx].update = new Date().getTime();
  save();
  res.json({
    rs: true,
    msg: "데이터가 수정되었습니다.",
  });
});
app.delete("/:id", (req, res) => {
  const { id } = req.params;
  const idx = data.findIndex((memo) => memo.id === id);
  if (idx === -1) {
    res.json({
      rs: false,
      msg: "잘못된 Id입니다.",
    });
    return;
  }
  if (data[idx].delete) {
    res.json({
      rs: false,
      msg: "이미 삭제된 정보입니다.",
    });
    return;
  }
  data[idx].delete = new Date().getTime();
  save();
  res.json({
    rs: true,
    msg: "삭제 성공",
  });
});

app.listen(8080, () => {
  console.log("연결");
});
