import dotenv from "dotenv-safe";
import express, {
	Router,
	Request,
	Response,
} from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import helmet from "helmet";
import cors from "cors";
import { authApi } from "./controllers/auth";
import { clienteApi } from "./controllers/cliente";
import { gerenteApi } from "./controllers/gerente";

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

route.get("/", (req: Request, res: Response) =>
	res.status(200).json({ message: "Olá mundo" })
);

app.use(authApi);
app.use("/cliente", clienteApi);
app.use("/gerente", gerenteApi);

app.listen(process.env.PORT, () => {
	console.log(
		`${new Date().toISOString()} ~[INFO] Servidor escutando na porta ${process.env.PORT}. http://localhost:${process.env.PORT}/`
	);
});
