import express from "express";
import path from "path";
import request from "request";
import bodyParser from "body-parser";
import dotenv from 'dotenv';

dotenv.config();

const GITHUB_AUTH_URL = "https://github.com/login/oauth";
const { PORT = 3000, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/authenticate/github", (req, res) => {
  const scopes = [
    "read:org",
    "public_repo",
    "read:user",
    "repo:status",
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
