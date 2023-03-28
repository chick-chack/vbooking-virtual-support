const app = require("./app");

const PORT = app.get("PORT");
const HOSTNAME = app.get("HOSTNAME");

app.listen(PORT, () => {
  console.log(`the server is running on HOST: http://${HOSTNAME}:${PORT}`);
});
