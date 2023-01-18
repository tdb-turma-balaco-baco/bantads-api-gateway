// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv-safe").config();

import express from "express";
import jwt from "jsonwebtoken";
import http from "http";
import httpProxy from "express-http-proxy";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import logger from "morgan";
import helmet from "helmet";
import { Router, Request, Response } from "express";

const app = express();

const route = Router();

app.use(express.json());

route.get("/", (req: Request, res: Response) => {
	res.json({ message: "Olá mundo com TypeScript" });
});

app.use(route);

app.listen(3333, () => console.log("Servidor escutando na porta 3333. http://localhost:3333/"));
