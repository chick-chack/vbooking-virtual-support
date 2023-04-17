const path = require("path");
const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  console.log(req.path);
  console.log({ body: req.body });
  next();
});

router.use(express.static(path.join(__dirname, "..", "build")));

router.use((req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

router.get("/new-WebGL/Build/visit-dimension.data.br", (_, res, next) => {
  res.setHeader("Content-Encoding", "br");

  next();
});

router.get(
  "/new-WebGL/Build/visit-dimension.framework.js.br",
  (_, res, next) => {
    res.setHeader("Content-Encoding", "br");
    res.setHeader("Content-Type", "application/javascript");

    next();
  }
);

router.get("/new-WebGL/Build/visit-dimension.wasm.br", (_, res, next) => {
  res.setHeader("Content-Encoding", "br");
  res.setHeader("Content-Type", "application/wasm");

  next();
});

router.use((req, res, next) => {
  res.status(404).send({ statusCode: 404, msg: "Sorry can't find that!" });
});

module.exports = router;
