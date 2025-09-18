import * as dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import http from "http";
import router from "./router/index.router";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use("/api/v1", router());
