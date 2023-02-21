import dotenv from "dotenv-safe";
import express, {
	NextFunction,
	Router,
	Request,
	Response,
} from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import helmet from "helmet";
import httpProxy from "express-http-proxy";
import cors from "cors";
import { authApi } from "./controllers/auth";
import verifyJWT from "./auth/verifyJWT";

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

const usuariosServiceProxy = httpProxy(process.env.PROXY_USUARIOS_URL ?? "");
const boisServiceProxy = httpProxy("http://localhost:5001/");

route.get("/", (req: Request, res: Response) =>
	res.status(200).json({ message: "Olá mundo" })
);

app.use(authApi);

route.get(
	"/usuarios",
	verifyJWT,
	(req: Request, res: Response, next: NextFunction) =>
		usuariosServiceProxy(req, res, next)
);

route.get(
	"/bois",
	verifyJWT,
	(req: Request, res: Response, next: NextFunction) =>
		boisServiceProxy(req, res, next)
);

app.listen(process.env.PORT, () => {
	console.log(
		`${new Date().toISOString()} ~[INFO] Servidor escutando na porta ${process.env.PORT}. http://localhost:${process.env.PORT}/`
	);
});
