/* eslint-disable @typescript-eslint/no-unused-vars */
import dotenv from "dotenv-safe";
import express, { Router } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import helmet from "helmet";
import cors from "cors";

const app = express();
const route = Router();

// Configurações do servidor express
dotenv.config();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(route);
app.use(cors());
app.use(helmet());
app.use(logger("dev"));
app.use(cookieParser());

//LOGIN
app.use(require('./controllers/auth'));
//FIM LOGIN

//CLIENTE - INICIO
app.use(require('./controllers/cliente'));
//FIM CLIENTE

//INICIO GERENTE
app.use(require('./controllers/gerente'));
//FIM GERENTE

//CONTA
app.use(require('./controllers/conta'));
//FIM CONTA

app.listen(process.env.PORT, () => {
	console.log(
		`${new Date().toISOString()} ~[INFO] Servidor escutando na porta ${
			process.env.PORT
		}. http://localhost:${process.env.PORT}/`
	);
});
