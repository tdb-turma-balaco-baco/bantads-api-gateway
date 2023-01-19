import dotenv from "dotenv-safe";
import express, {
	NextFunction,
	Router,
	Request,
	Response,
	urlencoded,
} from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import cookieParser from "cookie-parser";
import logger from "morgan";
import helmet from "helmet";
import proxy from "express-http-proxy";

interface TypedRequest<T> extends Request {
	body: T;
}

dotenv.config();
const app = express();
const route = Router();

app.use(logger("dev"));
// parse p/ application/x-www-form-encoded
app.use(express.urlencoded({ extended: false }));
// parse p/ application/json
app.use(express.json());

const urlencodedParser = urlencoded({ extended: false });

const usuariosServiceProxy = proxy("http://localhost:5000/");
const boisServiceProxy = proxy("http://localhost:5001/");

const verifyJWT = (
	req: TypedRequest<{ userId: number }>,
	res: Response,
	next: NextFunction
) => {
	const token = req.headers["x-access-token"];

	if (!token) {
		return res
			.status(401)
			.json({ auth: false, message: "Token não fornecido" });
	}

	if (typeof token === "string")
		jwt.verify(token, process.env.SECRET as Secret, (error, decoded) => {
			if (error) {
				return res
					.status(500)
					.json({ auth: false, message: "Falha na autenticação do token" });
			}
			req.body.userId = (decoded as JwtPayload).id;
			next();
		});
};

route.get("/", (req: Request, res: Response) =>
	res.status(200).json({ message: "Olá mundo" })
);

route.post("/login", urlencodedParser, (req: Request, res: Response) => {
	if (req.body.user === "admin" && req.body.password === "admin") {
		// Auth OK
		const id = 1;
		const token = jwt.sign({ id }, process.env.SECRET as Secret, {
			expiresIn: 300, // 5min
		});
		res.json({ auth: true, token });
	}

	res.status(500).json({ message: "Login inválido!" });
});

route.post("/logout", (req: Request, res: Response) =>
	res.json({ auth: false, token: null })
);

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

app.use(route);
app.use(helmet());
app.use(cookieParser());

app.listen(process.env.PORT, () => {
	console.log(
		`Servidor escutando na porta ${process.env.PORT}. http://localhost:${process.env.PORT}/`
	);
});
