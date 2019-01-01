import express from "express";
import path from "path";
import request from "request";
import bodyParser from "body-parser";

import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_AUTH_URL
} from "./src/constants.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/authenticate/github", (req, res) => {
  const scopes = [
    "read:org",
    "public_repo",
    "repo:status",
    "read:user",
    "user:email"
  ];
  res.redirect(
    `${GITHUB_AUTH_URL}/authorize?scope=${scopes.join(
      "%20"
    )}&client_id=${GITHUB_CLIENT_ID}`
  );
});

app.post("/authenticate/token", (req, res) => {
  request(
    {
      url: `${GITHUB_AUTH_URL}/access_token`,
      method: "POST",
      json: {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: req.body.code
      }
    },
    (error, response, body) => {
      // TODO: handle error
      res.send(body);
    }
  );
});

app.use(express.static(path.join(__dirname, "dist")));
app.use("*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
