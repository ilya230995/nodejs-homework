const app = require("../app");
const db = require("../model/db");
const createFolderExist = require("../helpers/create-dir");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

db.then(() => {
  app.listen(PORT, async () => {
    const UPLOAD_DIR = process.env.UPLOAD_DIR;
    const AVATARS = process.env.AVATARS;
    await createFolderExist(UPLOAD_DIR);
    await createFolderExist(AVATARS);
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch((err) => {
  console.log(err.message);
  process.exit(1);
});
