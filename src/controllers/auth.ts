import express, { NextFunction, Request, Response } from "express";
import jwt,{ Secret } from "jsonwebtoken";
import { HttpStatus } from "../interfaces";
import httpProxy from "express-http-proxy";

export const authApi = express.Router();

const loginProxy = httpProxy(process.env.PROXY_AUTH_URL + "/login", {
	userResDecorator: (proxyRes, proxyResData, userReq, userRes): any => {
		if (proxyRes.statusCode === HttpStatus.SUCCESS) {
			const retorno = Buffer.from(proxyResData).toString('utf-8');
			const id = JSON.parse(retorno);

			const token = jwt.sign({ id }, process.env.SECRET as Secret, {
				expiresIn: 300,
			});

			userRes.status(HttpStatus.SUCCESS);
			return { auth: true, token };
		}

		userRes.status(HttpStatus.UNAUTHORIZED);
		return { message: "Login inválido!" };
	}
});

authApi.post("/login", (req: Request, res: Response, next: NextFunction) => {
	loginProxy(req, res, next);
});

authApi.post("/logout", (req: Request, res: Response) =>
	res.json({ auth: false, token: null })
);
