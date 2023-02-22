/* eslint-disable @typescript-eslint/no-unused-vars */
import dotenv from "dotenv-safe";
import express, { Router } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import helmet from "helmet";
import cors from "cors";
import { authApi } from "./controllers/auth";
import { clienteApi } from "./controllers/cliente";
import { gerenteApi } from "./controllers/gerente";
import { contaApi } from "./controllers/conta";

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
app.use(authApi);
//FIM LOGIN

//CLIENTE - INICIO
app.use(clienteApi);
//FIM CLIENTE

//INICIO GERENTE
app.use(gerenteApi);
//FIM GERENTE

//CONTA
app.use(contaApi);
//FIM CONTA


app.listen(process.env.PORT, () => {
	console.log(
		`${new Date().toISOString()} ~[INFO] Servidor escutando na porta ${
			process.env.PORT
		}. http://localhost:${process.env.PORT}/`
	);
});
