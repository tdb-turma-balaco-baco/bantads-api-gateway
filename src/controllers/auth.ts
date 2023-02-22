import express, { NextFunction, Request, Response } from "express";
import jwt,{ Secret } from "jsonwebtoken";
import { HttpStatus } from "../interfaces";
import httpProxy from "express-http-proxy";
import { IncomingMessage } from "http";
import verifyJWT from "../auth/verifyJWT";

const authApi = express.Router();

authApi.post("/login", (req: Request, res: Response) => {
	if (req.body.user === "admin" && req.body.password === "admin") {
		// Auth OK
		const id = 1;
		const token = jwt.sign({ id }, process.env.SECRET as Secret, {
			expiresIn: 300, // 5min
		});
		return res.json({ auth: true, token });
	}

	return res.status(500).json({ message: "Login inválido!" });
});

const usuariosServiceProxy = httpProxy("http://localhost:3000/");
authApi.get(
	"/usuarios",
	verifyJWT,
	(req: Request, res: Response, next: NextFunction) =>
		usuariosServiceProxy(req, res, next)
);

authApi.post("/auth/login", (req: Request, res: Response, next: NextFunction) => {
	httpProxy(process.env.PROXY_AUTH_URL + "", {
		proxyReqBodyDecorator(bodyContent, _srcReq) {
			const retBody = {
				email: bodyContent.email,
				password: bodyContent.senha,
			};
			bodyContent = retBody;
			return bodyContent;
		},
		userResDecorator: (
			proxyRes: IncomingMessage,
			proxyResData: any,
			userReq: Request,
			userRes: Response
		): any => {
			if (proxyRes.statusCode === HttpStatus.SUCCESS) {
				const retorno = Buffer.from(proxyResData).toString("utf-8");
				const id = JSON.parse(retorno);

				const token = jwt.sign({ id }, process.env.SECRET as Secret, {
					expiresIn: 300,
				});

				userRes.status(HttpStatus.SUCCESS);
				return { auth: true, token };
			} else {
				userRes.status(HttpStatus.UNAUTHORIZED);
				return { message: "Login inválido!" };
			}
		},
	})(req, res, next);
});

authApi.post("/logout", (req: Request, res: Response) =>
	res.json({ auth: false, token: null })
);

module.exports = authApi;
